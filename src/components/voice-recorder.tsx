import { useKeyPress } from "@/hooks/useKeyPress";
import { memo, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { ChevronRight, X } from "lucide-react";
import { Tooltip } from "./tooltip";
import { useTranslation } from "react-i18next";

interface VoiceRecorderProps {
  onStop: () => void;
  onCancel: () => void;
}

const WIDTH = 400;
const HEIGHT = 300;
const shuffle = [1, 3, 0, 4, 2];
const options = {
  smoothing: 0.9,
  fft: 8,
  minDecibels: -60,
  scale: 0.2,
  glow: 10,
  color1: [203, 36, 128],
  color2: [41, 200, 192],
  color3: [24, 137, 218],
  fillOpacity: 0.6,
  lineWidth: 1,
  blend: "screen" as GlobalCompositeOperation,
  shift: 30,
  width: 30,
  amp: 0.8,
};

const onStreamError = (e: Error) => console.log("stream error", e);
const range = (i: number) => Array.from(Array(i).keys());
const scale = (i: number) => {
  const x = Math.abs(2 - i); // 2,1,0,1,2
  const s = 3 - x; // 1,2,3,2,1
  return (s / 3) * options.amp;
};

function freq(channel: number, i: number, freqs: Uint8Array) {
  const band = 2 * channel + shuffle[i] * 6;
  return freqs[band];
}

function path(
  ctx: CanvasRenderingContext2D,
  freqs: Uint8Array,
  channel: number,
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const color = options[`color${channel + 1}`].map(Math.floor);

  ctx.fillStyle = `rgba(${color}, ${options.fillOpacity})`;
  ctx.strokeStyle = ctx.shadowColor = `rgb(${color})`;
  ctx.lineWidth = options.lineWidth;
  ctx.shadowBlur = options.glow;
  ctx.globalCompositeOperation = options.blend;

  const m = HEIGHT / 2;
  const offset = (WIDTH - 15 * options.width) / 2;

  const x = range(15).map(
    (i) => offset + channel * options.shift + i * options.width,
  );

  const y = range(5).map((i) =>
    Math.max(0, m - scale(i) * freq(channel, i, freqs)),
  );

  const h = 2 * m;

  ctx.beginPath();
  ctx.moveTo(0, m);
  ctx.lineTo(x[0], m + 1);

  ctx.bezierCurveTo(x[1], m + 1, x[2], y[0], x[3], y[0]);
  ctx.bezierCurveTo(x[4], y[0], x[4], y[1], x[5], y[1]);
  ctx.bezierCurveTo(x[6], y[1], x[6], y[2], x[7], y[2]);
  ctx.bezierCurveTo(x[8], y[2], x[8], y[3], x[9], y[3]);
  ctx.bezierCurveTo(x[10], y[3], x[10], y[4], x[11], y[4]);

  ctx.bezierCurveTo(x[12], y[4], x[12], m, x[13], m);

  ctx.lineTo(1000, m + 1);
  ctx.lineTo(x[13], m - 1);

  ctx.bezierCurveTo(x[12], m, x[12], h - y[4], x[11], h - y[4]);
  ctx.bezierCurveTo(x[10], h - y[4], x[10], h - y[3], x[9], h - y[3]);
  ctx.bezierCurveTo(x[8], h - y[3], x[8], h - y[2], x[7], h - y[2]);
  ctx.bezierCurveTo(x[6], h - y[2], x[6], h - y[1], x[5], h - y[1]);
  ctx.bezierCurveTo(x[4], h - y[1], x[4], h - y[0], x[3], h - y[0]);
  ctx.bezierCurveTo(x[2], h - y[0], x[1], m, x[0], m);

  ctx.lineTo(0, m);

  ctx.fill();
  ctx.stroke();
}

function visualize(
  ctx: CanvasRenderingContext2D,
  freqs: Uint8Array,
  analyser: AnalyserNode,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  animationRef: React.MutableRefObject<number | null>,
  audioContextRef: React.MutableRefObject<AudioContext | null>,
) {
  // Проверяем, что аудио контекст не закрыт.
  if (audioContextRef.current?.state === "closed") {
    return;
  }

  analyser.smoothingTimeConstant = options.smoothing;
  analyser.fftSize = Math.pow(2, options.fft);
  analyser.minDecibels = options.minDecibels;
  analyser.maxDecibels = 0;
  analyser.getByteFrequencyData(freqs);

  if (canvasRef.current) {
    canvasRef.current.width = WIDTH;
    canvasRef.current.height = HEIGHT;
  }

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  path(ctx, freqs, 0);
  path(ctx, freqs, 1);
  path(ctx, freqs, 2);

  // Сохраняем ссылку на requestAnimationFrame
  animationRef.current = requestAnimationFrame(() =>
    visualize(ctx, freqs, analyser, canvasRef, animationRef, audioContextRef),
  );
}

export const VoiceRecorder = memo<VoiceRecorderProps>(
  ({ onStop, onCancel }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const animationRef = useRef<number | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      const freqs = new Uint8Array(analyser.frequencyBinCount);
      analyserRef.current = analyser;

      let isCancelled = false;

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          if (isCancelled) {
            // Если компонент размонтирован раньше времени, останавливаем дорожки и выходим
            stream.getTracks().forEach((track) => track.stop());
            return;
          }
          mediaStreamRef.current = stream;
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);
          visualize(
            ctx,
            freqs,
            analyser,
            canvasRef,
            animationRef,
            audioContextRef,
          );
        })
        .catch(onStreamError);

      return () => {
        isCancelled = true;

        // Останавливаем анимацию
        if (animationRef.current !== null) {
          cancelAnimationFrame(animationRef.current);
        }

        // Останавливаем все аудиодорожки
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        }

        // Отключаем и закрываем аудиоконтекст
        if (audioContextRef.current) {
          if (audioContextRef.current.state !== "closed") {
            audioContextRef.current.close();
          }
        }
      };
    }, []);

    useKeyPress("Enter", onStop);
    useKeyPress("Escape", onCancel);

    return (
      <Dialog open={true}>
        <DialogContent className="mt-20 items-center justify-center border-none bg-transparent p-0 shadow-none outline-none">
          <canvas ref={canvasRef} />

          <div className="flex justify-center gap-10">
            <Tooltip label={t("common.cancel")} side="bottom">
              <button
                className="voice-recorder__button bg-destructive"
                onClick={onCancel}
                type="button"
                tabIndex={-1}
              >
                <X />
              </button>
            </Tooltip>
            <Tooltip label={t("common.ok")} side="bottom">
              <button
                className="voice-recorder__button bg-white text-black"
                onClick={onStop}
                type="button"
                tabIndex={-1}
              >
                <ChevronRight />
              </button>
            </Tooltip>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);
