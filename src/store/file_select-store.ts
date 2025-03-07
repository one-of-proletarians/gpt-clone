import { getImageNameFromURL } from "@/lib/utils";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type FileState = {
  pending: boolean;
  blobLink: string;
  url: string;
};

interface FileSelect {
  files: FileState[];
  clear(): void;
  pushFile(file: File): string;
  removeFile(index: string): void;
  setUrl(index: string, url: string): void;
}

export const useFileSelect = create<FileSelect>()(
  immer((set) => ({
    files: [],
    clear: () => set({ files: [] }),

    pushFile: (file) => {
      const blobLink = URL.createObjectURL(file);
      set((store) => {
        store.files.push({
          blobLink,
          pending: true,
          url: "",
        });
      });

      return blobLink;
    },

    removeFile: (index) =>
      set((store) => {
        store.files = store.files.filter((file) => {
          if (file.blobLink === index) {
            const imageName = getImageNameFromURL(file.url);
            fetch(`${import.meta.env.VITE_IMAGE_SERVER}/image?name=${imageName}`, {
              method: "DELETE",
            })
              .then(() => console.info("Файл из сервера удален"))
              .catch((e) => console.log("[Ошибка удаления]", e));
            return false;
          }
          return true;
        });
      }),

    setUrl: (blobLink, url) =>
      set((store) => {
        for (const file of store.files) {
          if (blobLink === file.blobLink) {
            file.url = url;
            file.pending = false;
            break;
          }
        }
      }),
  })),
);
