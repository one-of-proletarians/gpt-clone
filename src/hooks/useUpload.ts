import { uid } from "@/lib/utils";
import { useState } from "react";

interface ApiError {
  status_code: number;
  error: {
    message: string;
    code: number;
  };
  status_txt: string;
}

interface ImageInfo {
  filename: string;
  name: string;
  mime: string;
  extension: string;
  url: string;
}

interface Data {
  id: string;
  title: string;
  url_viewer: string;
  url: string;
  display_url: string;
  width: number;
  height: number;
  size: number;
  time: number;
  expiration: number;
  image: ImageInfo;
  thumb: ImageInfo;
  medium: ImageInfo;
  delete_url: string;
}

interface ApiResponse {
  data: Data;
  success: boolean;
  status: number;
}

export const useUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [abortController, setAbortController] = useState<AbortController>(
    new AbortController(),
  );

  const upload = async (file: File): Promise<ApiResponse> => {
    const body = new FormData();
    const apiKey = import.meta.env.VITE_IMGBB_KEY;
    const apiUrl = import.meta.env.VITE_IMGBB_URL;

    if (!apiKey || !apiUrl) {
      throw new Error(
        "API key or URL is not defined in environment variables.",
      );
    }

    body.append("key", apiKey);
    body.append("image", file);
    body.append("name", uid());

    setIsLoading(true);
    setIsError(false);

    try {
      const response = await fetch(apiUrl, {
        signal: abortController.signal,
        method: "POST",
        body,
      });

      if (!response.ok) {
        const errorJson: ApiError = await response.json();
        throw new Error(errorJson.error.message);
      }

      return response.json();
    } catch (err) {
      setIsError(true);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsError(false);
    setIsLoading(false);
    abortController.abort();
    setAbortController(new AbortController());
  };

  return { upload, reset, isLoading, isError };
};
