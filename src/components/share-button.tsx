import { Share } from "lucide-react";
import { memo } from "react";
import { Button } from "./ui/button";
import { Tooltip } from "./tooltip";
import { useTranslation } from "react-i18next";

interface ShareButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}

export const ShareButton = memo<ShareButtonProps>(({ onClick, disabled }) => {
  const { t } = useTranslation();
  return (
    <Tooltip label={t("common.share")}>
      <Button
        size={"icon"}
        variant={"ghost"}
        className="hovering ml-auto hidden md:flex"
        onClick={onClick}
        disabled={disabled}
      >
        <Share className="h-5 w-5" />
      </Button>
    </Tooltip>
  );
});
