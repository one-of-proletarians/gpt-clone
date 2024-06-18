import { useChatId } from "@/hooks/useChatId";
import { useKeyPress } from "@/hooks/useKeyPress";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useHistoryChat } from "@/store/history-store";
import { useShare } from "@/store/share-store";
import { Loader, LoaderIcon, Share2 } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { errorStyle } from "./ui/sonner";
import { QrCode } from "./qr-code";

const createURL = (id: string) => location.origin + `/share/${id}`;
const hasShareAPI = "share" in navigator;

export const ShareDialog: FC = () => {
  const chatId = useChatId();
  const { t } = useTranslation();
  const getChat = useHistoryChat((s) => s.getChat);
  const [open, setShareOpen] = useShare((s) => [s.open, s.setShareOpen]);
  const [isPending, setPending] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [shareId, setShareId] = useState("");

  const status = useNetworkStatus();

  useKeyPress(
    "KeyS",
    () => {
      if (chatId && status === "online") {
        setShareOpen(true);
      }
    },
    ["alt", "prevent"],
  );

  const copy = () => {
    setButtonDisabled(true);
    navigator.clipboard
      .writeText(createURL(shareId))
      .then(() => {
        toast.success(t("common.copySuccess"), {
          position: "top-right",
          duration: 700,
        });

        setShareOpen(false);
      })
      .finally(() => setButtonDisabled(false));
  };

  useEffect(() => {
    if (open) {
      const chat = getChat(chatId);
      setPending(true);

      fetch(`/api/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chat),
      })
        .then((r) => r.json())
        .then((json) => setShareId(json.id))
        .catch(() => {
          toast.error(t("errors.default"), errorStyle);
          setShareOpen(false);
        })
        .finally(() => setPending(false));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, open]);

  const nativeShare = () =>
    navigator.share({ url: createURL(shareId) }).then(() => {
      setShareOpen(false);
      setShareId("");
    });

  return (
    <Dialog open={open} onOpenChange={setShareOpen}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="max-w-full outline-none xs:max-w-xs"
      >
        {isPending ? (
          <div className="flex justify-center">
            <Loader className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle>{t("share.title")}</DialogTitle>
              <DialogClose className="h-6 w-6" />
            </DialogHeader>

            <DialogDescription className="flex flex-col gap-3">
              <QrCode
                value={createURL(shareId)}
                className="mx-auto !h-40 !w-40 rounded-md border border-foreground dark:border-none"
              />
              <span className="flex items-center justify-center gap-3">
                <Button
                  disabled={buttonDisabled || !shareId.length}
                  onClick={copy}
                  className="flex-1 gap-2"
                >
                  {!shareId.length && (
                    <LoaderIcon className="h-4 w-4 animate-spin" />
                  )}
                  <span>{t("share.copyLink")}</span>
                </Button>

                {hasShareAPI && !!shareId.length && (
                  <Button
                    size={"icon"}
                    onClick={nativeShare}
                    className="h-9 w-9"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                )}
              </span>
            </DialogDescription>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
