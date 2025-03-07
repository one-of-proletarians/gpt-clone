import { useMobile } from "@/hooks/useMobile";
import { useFileSelect } from "@/store/file_select-store";
import { ImageIcon, LucideCamera, Plus } from "lucide-react";
import { ChangeEvent, FC, forwardRef, memo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { Button, ButtonProps } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { errorStyle } from "./ui/sonner";

export interface FileHandler {
  clearFile: () => void;
}

type FileButtonProps = ButtonProps & { onChangeLoaded(state: boolean): void };

const MAX_FILES = 4;

const AddButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <Button
    type="button"
    className={"absolute bottom-[16px] left-3 rounded-full"}
    size={"icon"}
    ref={ref}
    {...props}
  >
    <Plus />
  </Button>
));

export const ButtonFile: FC<FileButtonProps> = memo(
  ({ disabled = false, onChangeLoaded }) => {
    const [files, pushFile, setUrl, removeFile] = useFileSelect(
      useShallow((s) => [s.files, s.pushFile, s.setUrl, s.removeFile]),
    );

    disabled = disabled || files.length >= MAX_FILES;

    const isMobile = useMobile();
    const { t } = useTranslation();
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const responses: Promise<void>[] = [];

    // usePasteEvent(setFile);

    const clearInputs = () => {
      if (galleryInputRef.current) galleryInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
    };

    const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
      onChangeLoaded(true);

      const images = e.target.files;
      if (!images) return clearInputs();
      const length = files.length + images.length;

      if (length > MAX_FILES) {
        clearInputs();
        return toast(
          t("errors.maxFilesCount", { count: MAX_FILES }),
          errorStyle,
        );
      }

      for (const image of images) {
        const blobLink = pushFile(image);
        const body = new FormData();
        body.append("image", image);

        const response = fetch(import.meta.env.VITE_IMAGE_SERVER + "/image", {
          method: "POST",
          body,
        })
          .then((res) => res.json() as Promise<string>)
          .then((url) => setUrl(blobLink, url))
          .catch(() => {
            removeFile(blobLink);
            toast(t("errors.imageUpload", { name: image.name }), errorStyle);
          });

        responses.push(response);
      }

      Promise.all(responses).then(() => onChangeLoaded(false));

      clearInputs();
    };

    const inputProps = {
      onChange,
      type: "file",
      accept: ".png,.jpeg,.jpg",
      className: "hidden h-0 w-0",
    };

    return (
      <>
        {!isMobile ? (
          <AddButton
            onClick={() => galleryInputRef.current?.click()}
            disabled={disabled}
          />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <AddButton disabled={disabled} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-2xl" align="start">
              <DropdownMenuItem
                className="px-5 py-2 text-lg"
                onClick={() => galleryInputRef?.current?.click()}
              >
                <ImageIcon className="mr-2 h-5 w-5" />
                {t("fileButton.file")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="px-5 py-2 text-lg"
                onClick={() => cameraInputRef?.current?.click()}
              >
                <LucideCamera className="mr-2 h-5 w-5" />
                {t("fileButton.camera")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <input ref={galleryInputRef} multiple {...inputProps} />
        <input ref={cameraInputRef} capture="environment" {...inputProps} />
      </>
    );
  },
);
