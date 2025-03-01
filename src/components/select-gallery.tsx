import { useFileSelect } from "@/store/file_select-store";
import { LoaderCircle, X } from "lucide-react";
import { FC } from "react";
import { useShallow } from "zustand/react/shallow";

export const SelectGallery: FC = () => {
  const [files, removeFile] = useFileSelect(
    useShallow((s) => [s.files, s.removeFile]),
  );

  return (
    <div className="absolute left-3 top-3 flex gap-1 rounded-md">
      {files.map((file) => (
        <div
          key={file.blobLink}
          className="relative aspect-square w-16 overflow-hidden rounded-md border"
        >
          <button
            className="absolute right-0.5 top-0.5 z-20 rounded-full bg-black"
            type="button"
            onClick={() => removeFile(file.blobLink)}
          >
            <X className="h-5 w-5" />
          </button>

          {file.pending && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-30">
              <LoaderCircle className="h-8 w-8 animate-spin" />
            </div>
          )}

          <img
            className="relative h-full w-full object-cover"
            src={file.blobLink}
            alt="image"
          />
        </div>
      ))}
    </div>
  );
};
