import { useImageToBase64 } from "@/hooks/useImageToBase64";
import { usePasteEvent } from "@/hooks/usePasteEvent";
import { useUpload } from "@/hooks/useUpload";
import { cn, fileSizeIsLessOrEqualTo, formatFileSize } from "@/lib/utils";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Tooltip } from "./tooltip";
import { Button, ButtonProps } from "./ui/button";
import { errorStyle } from "./ui/sonner";

type ButtonFileProps = Omit<ButtonProps, "onClick" | "size" | "variant"> & {
  onFileChange?: (link?: string) => void;
  onLoadChange?: (loaded: boolean) => void;
};

export interface FileHandler {
  clearFile: () => void;
}

export const ButtonFile = memo(
  forwardRef<FileHandler | undefined, ButtonFileProps>(
    (
      { disabled = false, className, onFileChange, onLoadChange, ...props },
      ref,
    ) => {
      const [file, setFile] = useState<File>();
      const base64 = useImageToBase64(file);
      const inputRef = useRef<HTMLInputElement>(null);
      const [fileIsLoaded, setFileIsLoaded] = useState(false);
      const { t } = useTranslation();
      const { upload, isLoading, reset } = useUpload();

      usePasteEvent(setFile);

      const clearFile = () => {
        if (inputRef.current) inputRef.current.value = "";
        onFileChange?.(undefined);
        setFileIsLoaded(false);
        setFile(undefined);
        reset();
      };

      // eslint-disable-next-line react-hooks/exhaustive-deps
      useImperativeHandle(ref, () => ({ clearFile }), []);

      useEffect(() => {
        if (!file) return;
        else if (!fileSizeIsLessOrEqualTo(20_000_000, file)) {
          clearFile();
          toast.error(t("common.fileTooLarge"), errorStyle);
        } else {
          onLoadChange?.(true);
          upload(file)
            .then(({ data }) => {
              setFileIsLoaded(true);
              onFileChange?.(data.image.url);
            })
            .catch(() => toast.error(t("errors.default"), errorStyle))
            .finally(() => onLoadChange?.(false));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [file]);

      return (
        <>
          {file && base64 ? (
            <Tooltip
              label={
                <div>
                  <div>{file.name}</div>
                  <div>
                    {t("common.size")}: {formatFileSize(file.size)}
                  </div>
                </div>
              }
              side="bottom"
            >
              <div
                className="group absolute bottom-[16px] left-3 h-9 w-9 border-spacing-2 cursor-pointer overflow-hidden rounded-full"
                onClick={clearFile}
              >
                {fileIsLoaded && (
                  <img
                    src={base64}
                    alt=""
                    className="block h-full w-full object-cover"
                  />
                )}

                <div
                  className={cn(
                    "absolute left-1/2 top-1/2 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white transition-opacity group-hover:opacity-100",
                    {
                      "opacity-0": !isLoading,
                    },
                  )}
                >
                  {isLoading ? (
                    <LoaderCircle className="h-full w-full animate-spin" />
                  ) : (
                    <X className="h-full w-full" />
                  )}
                </div>
              </div>
            </Tooltip>
          ) : (
            <Tooltip
              label={t(disabled ? "chat.onlyGPTVision" : "chat.uploadFile")}
            >
              <Button
                type="button"
                size={"icon"}
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
                className={cn(
                  "absolute bottom-[16px] left-3 rounded-xl disabled:pointer-events-auto disabled:z-10 disabled:cursor-not-allowed",
                  className,
                )}
                {...props}
              >
                <ImagePlus className="h-4 w-4" />
              </Button>
            </Tooltip>
          )}

          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept=".png,.jpeg,.jpg"
            onChange={({ target }) => setFile(target.files?.[0] as File)}
          />
        </>
      );
    },
  ),
);
