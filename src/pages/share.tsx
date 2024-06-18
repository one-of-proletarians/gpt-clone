import { Logo } from "@/components/logo";
import { MessageItem } from "@/components/message-item";
import { Button } from "@/components/ui/button";
import { useSharedChat } from "@/hooks/useSharedChat";
import { cn, uid } from "@/lib/utils";
import { useHistoryChat } from "@/store/history-store";
import { useAPIKey } from "@/store/key-store";
import { Link, useNavigate } from "@tanstack/react-router";
import { FC } from "react";
import { useTranslation } from "react-i18next";

export const Share: FC = () => {
  const { chat, isError } = useSharedChat();
  const hasApiKey = useAPIKey((s) => !!s.apiKey);
  const addChat = useHistoryChat((s) => s.addChat);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const add = () => {
    if (!chat) return;

    const id = uid();
    addChat(chat, id);
    navigate({ to: `/chat/${id}` });
  };

  return (
    <div className="relative flex h-dvh-fallback w-full min-w-[320px] flex-col">
      {chat && (
        <div className="flex">
          <h1 className="w-full border-b py-2 text-center text-xl sm:border-none sm:text-3xl">
            {chat.title}
          </h1>
        </div>
      )}
      <div className="flex grow flex-col items-center gap-2 overflow-auto md:pb-5">
        {chat ? (
          <div className="flex w-full flex-col sm:gap-2 lg:w-[80%] xl:w-[65%]">
            {chat.messages.map((message, i) => (
              <MessageItem
                key={i}
                index={i}
                role={message.role}
                content={message.content || ""}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3">
            <Logo
              className={cn("h-10 w-10 animate-spin", {
                "animate-none": isError,
              })}
              style={{ animationDuration: "3s" }}
            />

            {isError && (
              <>
                <h1>{t("share.linkNotFound")}</h1>
                {hasApiKey && (
                  <Button asChild>
                    <Link to="/chat/">{t("common.chat")}</Link>
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {hasApiKey && chat && (
        <div className="flex justify-center p-1">
          <Button onClick={add}>{t("share.continueChat")}</Button>
        </div>
      )}
    </div>
  );
};
