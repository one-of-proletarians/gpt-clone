import { transcribeAudio } from "@/lib/openai";
import { getAudioDuration } from "@/lib/utils";
import { useWhisperUsage } from "@/store/whisper-usage-store";

import { useRef, useState } from "react";

let recorder: MediaRecorder;
const audioChunks: Blob[] = [];

export const useRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [transcript, setTranscript] = useState("");
  const isCanceledRef = useRef(false);

  const recordingStart = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    recorder = new MediaRecorder(stream);
    recorder.onstart = () => (audioChunks.length = 0);
    recorder.ondataavailable = ({ data }) => audioChunks.push(data);
    recorder.onstop = recordingStop;

    recorder.start();
  };

  const recordingStop = async () => {
    setIsRecording(false);
    recorder.stream.getTracks().forEach((track) => track.stop());

    if (isCanceledRef.current) return;

    setIsLoading(true);

    const file = new File(audioChunks, "audio.mp3", { type: "audio/mp3" });
    const result = await transcribeAudio(file);

    const duration = await getAudioDuration(file);

    useWhisperUsage.getState().addOrUpdate(duration);

    setIsLoading(false);
    setTranscript(result || "");
  };

  const start = () => {
    isCanceledRef.current = false;
    recordingStart().then(() => setIsRecording(true));
  };

  const stop = () => {
    recorder.stop();
  };

  const toggle = () => {
    if (isRecording) {
      stop();
    } else {
      start();
    }
  };

  const cancel = () => {
    isCanceledRef.current = true;
    stop();
  };

  return {
    toggle,
    start,
    stop,
    cancel,
    transcript,
    isLoading,
    isRecording,
  };
};
