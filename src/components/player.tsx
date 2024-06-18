import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useMobile } from "@/hooks/useMobile";
import { handleAPIError, openai } from "@/lib/openai";
import { cn, stringToHash } from "@/lib/utils";
import { getVoice, saveVoice } from "@/lib/voiceStorage";
import { usePlayer } from "@/store/player-store";
import { Download, Loader2, Pause, Play, X } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "./tooltip";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { useTokenUsage } from "@/store/token-usage-store";

const rates = [0.5, 0.75, 1, 1.5, 1.75, 2];
const audio = new Audio();

const secondsToTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.trunc(seconds % 60);
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  return `${formattedMinutes}:${formattedSeconds}`;
};

export const Player: FC = () => {
  const [value, setValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useLocalStorage("rate", rates[2]);
  const [url, setUrl] = useState("");

  const { t } = useTranslation();

  const { visible, isLoading, setIsLoading, setVisible, setText } = usePlayer();

  const input = usePlayer((s) => s.text);
  const rangeToTime = (range: number) => {
    return (range / 100) * audio.duration;
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "audio.mp3";
    a.click();
  };

  const start = (blob: Blob) => {
    const url = URL.createObjectURL(blob);

    setIsLoading(false);
    saveVoice(blob, stringToHash(input));
    setUrl(url);

    audio.pause();
    audio.src = url;
    audio.playbackRate = rate;
    audio.play();
  };

  useEffect(() => {
    if (input) {
      setVisible(true);

      getVoice(stringToHash(input))
        .then(start)
        .catch(() => {
          setIsLoading(true);

          openai.audio.speech
            .create({
              model: "tts-1",
              voice: "shimmer",
              response_format: "mp3",
              input,
            })
            .then((response) => {
              useTokenUsage.getState().setTTSUsage("tts", input.length);
              response.blob().then(start);
            })
            .catch((e) => {
              handleAPIError(e);
              stop();
            });
        });
    } else {
      stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  useEffect(() => {
    audio.playbackRate = rate;
  }, [rate]);

  useEffect(() => {
    audio.ontimeupdate = () =>
      setValue((audio.currentTime / audio.duration) * 100);

    audio.onended = () => {
      audio.currentTime = 0;
      setValue(0);
      setIsPlaying(false);
    };
    audio.onplay = () => setIsPlaying(true);
  }, []);

  const changeRate = () => {
    const max = rates.length - 1;

    if (rate === rates[max]) {
      setRate(rates[0]);
    } else {
      setRate(rates[rates.indexOf(rate) + 1]);
    }
  };

  const stop = () => {
    setIsPlaying(false);
    setVisible(false);
    setIsLoading(false);
    setValue(0);
    setText("");

    audio.src = "";
  };

  const isMobile = useMobile();

  return (
    <div
      id="player"
      className={cn(
        "absolute -top-14 z-40 flex w-full flex-col items-center gap-4 rounded-lg border",
        "bg-white p-2 shadow-lg transition duration-300 dark:bg-black sm:right-2 sm:w-1/3 md:border-none",
        {
          "translate-y-[3.7rem]": visible && !isMobile,
          "translate-y-28": visible && isMobile,
        },
      )}
    >
      <div className="flex w-full items-center gap-3">
        <div className="min-w-8">
          <Button
            size={"xs"}
            onClick={() => {
              isPlaying ? audio.pause() : audio.play();
              setIsPlaying(!isPlaying);
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
        <Slider
          onValueChange={([v]) => {
            audio.currentTime = rangeToTime(v);
          }}
          value={[value]}
          disabled={isLoading}
        />

        <span className="select-none text-[.6rem] text-muted-foreground">
          {audio.duration ? secondsToTime(audio.duration) : "00:00"}
        </span>

        <Tooltip label={t("common.download")}>
          <button
            disabled={isLoading}
            tabIndex={-1}
            className="disabled:cursor-not-allowed disabled:text-muted-foreground"
            onClick={download}
          >
            <Download className="h-4 w-4" />
          </button>
        </Tooltip>

        <Tooltip label={t("common.speed")}>
          <button
            className="w-14 cursor-pointer whitespace-nowrap disabled:cursor-not-allowed disabled:text-muted-foreground"
            onClick={changeRate}
            disabled={isLoading}
            tabIndex={-1}
          >
            {rate}x
          </button>
        </Tooltip>

        <Tooltip label={t("common.close")}>
          <button onClick={stop} tabIndex={-1}>
            <X className="h-4 w-4" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
