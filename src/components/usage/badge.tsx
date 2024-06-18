import { useChatId } from "@/hooks/useChatId";
import { useTokenUsage } from "@/store/token-usage-store";

import { calculateUsageCost, cn } from "@/lib/utils";
import { FC, memo, useState } from "react";
import { BadgeProps, badgeVariants } from "../ui/badge";

import { useMobile } from "@/hooks/useMobile";
import { useWhisperUsage } from "@/store/whisper-usage-store";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { useBadgeDialogState } from "./state";

export const UsageBadge: FC<BadgeProps> = memo(({ className, ...rest }) => {
  const uid = useChatId();
  const { t } = useTranslation();

  const isMobile = useMobile();
  const setOpen = useBadgeDialogState((s) => s.setOpen);
  const [cardIsOpen, setCardIsOpen] = useState(false);
  const toggleCard = () => isMobile && setCardIsOpen((open) => !open);

  const [usage, titleUsage, tts, ttsHD, model] = useTokenUsage((s) => {
    const item = s.items[uid];
    return [item?.usage, item?.titleUsage, item?.tts, item?.ttsHD, item?.model];
  });

  const whisper = useWhisperUsage(
    (s) => s.items.find((i) => i.chatId === uid)?.duration ?? 0,
  );

  const audio = [{ whisper }, { tts }, { ttsHD }];

  if (!uid || !usage) return null;

  const total = usage.total_tokens + (titleUsage?.total_tokens || 0);
  const price = calculateUsageCost(usage, titleUsage, model);

  return (
    <>
      <HoverCard open={cardIsOpen} onOpenChange={setCardIsOpen} openDelay={400}>
        <HoverCardTrigger asChild onClick={toggleCard}>
          <div
            className={cn(
              "cursor-default select-none",
              badgeVariants(),
              className,
            )}
            {...rest}
          >
            {total}
          </div>
        </HoverCardTrigger>

        <HoverCardContent className="flex flex-col gap-4">
          <h2 className="font-bold">{t("usage.title")}</h2>
          <ul>
            <li className="usage-item">
              <span>{t("usage.prompt")}</span>
              <span>{usage.prompt_tokens}</span>
            </li>
            <li className="usage-item">
              <span>{t("usage.response")}</span>
              <span>{usage.completion_tokens}</span>
            </li>
            <li className="usage-item">
              <span>{t("usage.name")}</span>
              <span>{titleUsage?.total_tokens || "null"}</span>
            </li>
            <li className="usage-item">
              <span>{t("usage.total")}</span>
              <span>{total}</span>
            </li>
            {price && price >= 0.0001 && (
              <li className="usage-item">
                <span>{t("usage.price.tokens")}</span>
                <span>{price.toFixed(3)}</span>
              </li>
            )}

            {audio.map((item) => {
              const [key, value] = Object.entries(item)[0];
              if (!value) return null;

              return (
                <li key={key} className={"usage-item"}>
                  <span>{key}</span>
                  <span>
                    {key === "whisper"
                      ? `${value.toFixed(1)}s`
                      : `${value} chars`}
                  </span>
                </li>
              );
            })}
          </ul>

          <Button onClick={() => setOpen(true)}>
            {t("usage.openFullUsage")}
          </Button>
        </HoverCardContent>
      </HoverCard>
    </>
  );
});
