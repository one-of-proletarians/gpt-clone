import { Tooltip } from "@/components/tooltip";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Clipboard } from "lucide-react";
import { languages } from "prismjs/components";

interface CodeHeaderProps {
  language: string;
  copyText: string;
}
export const CodeHeader = memo<CodeHeaderProps>(({ language, copyText }) => {
  const { t } = useTranslation();

  const copyCode = () => {
    navigator.clipboard.writeText(copyText).then(() => {
      toast.success(t("common.copyCodeSuccess"), {
        position: "top-right",
        duration: 2000,
      });
    });
  };

  return (
    <div className="sticky left-0 right-0 top-0 flex items-center justify-between bg-sidebar px-4 py-2 text-foreground">
      <span className="text-sm">{languages[language]?.title ?? language}</span>
      <Tooltip label={t("common.copyCode")}>
        <button
          tabIndex={-1}
          className="inline-flex select-none items-center text-sm"
          onClick={copyCode}
        >
          <Clipboard className="h-4 w-4" /> Copy code
        </button>
      </Tooltip>
    </div>
  );
});
