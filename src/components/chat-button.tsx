import { useChatId } from "@/hooks/useChatId";
import { useNavigate } from "@tanstack/react-router";
import { SquarePen } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Logo } from "./logo";
import { Tooltip } from "./tooltip";
import { Button, ButtonProps } from "./ui/button";
import { cn } from "@/lib/utils";

const penIcon = <SquarePen className="h-4 w-4" />;

interface ChatButtonProps extends ButtonProps {
  small?: boolean;
}

export const ChatButton = memo<ChatButtonProps>(
  ({ small, disabled, className, ...props }) => {
    const { t } = useTranslation();
    const chatId = useChatId();
    const navigate = useNavigate();

    const onClick = () => navigate({ to: "/chat/" });
    const label = t("chat.newChat");

    disabled = disabled || !chatId;

    return small ? (
      <Tooltip label={label}>
        <Button
          size={"icon"}
          variant={"ghost"}
          disabled={disabled}
          onClick={onClick}
          className={cn("hovering", className)}
          {...props}
        >
          {penIcon}
        </Button>
      </Tooltip>
    ) : (
      <Button
        variant="ghost"
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "hovering relative z-10 flex w-full justify-between bg-sidebar",
          className,
        )}
        {...props}
      >
        <span className="inline-flex items-center gap-2">
          <Logo className="h-6 w-6" />
          {label}
        </span>
        {penIcon}
      </Button>
    );
  },
);
