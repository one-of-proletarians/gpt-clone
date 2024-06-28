import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FC, PropsWithChildren, memo } from "react";
import { useTranslation } from "react-i18next";
import { Kbd } from "./kbd";

interface ShortcutItemProps extends PropsWithChildren {
  label: string;
}

interface ShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShortcutItem = memo<ShortcutItemProps>(({ children, label }) => {
  return (
    <div className="shortcut-item">
      <span className="command-name">{label}</span>
      <div className="kbds">{children}</div>
    </div>
  );
});

export const ShortcutsDialog: FC<ShortcutsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="outline-none lg:max-w-4xl" tabIndex={-1}>
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-6">
          <DialogTitle>{t("shortcuts.title")}</DialogTitle>
          <DialogClose />
        </DialogHeader>

        <div className="grid gap-x-6 gap-y-3 lg:grid-cols-2">
          <ShortcutItem label={t("shortcuts.openNewChat")}>
            <Kbd.Meta />
            <Kbd.Shift />
            <Kbd>O</Kbd>
          </ShortcutItem>

          <ShortcutItem label={t("shortcuts.removeChat")}>
            <Kbd.Meta />
            <Kbd.Shift />
            <Kbd.Backspace />
          </ShortcutItem>

          <ShortcutItem label={t("shortcuts.inputFocus")}>
            <Kbd.Shift />
            <Kbd.Escape />
          </ShortcutItem>

          <ShortcutItem label={t("shortcuts.toggleSidebar")}>
            <Kbd.Meta />
            <Kbd.Shift />
            <Kbd>E</Kbd>
          </ShortcutItem>

          <ShortcutItem label={t("shortcuts.setUserInstructions")}>
            <Kbd.Meta />
            <Kbd.Shift />
            <Kbd>I</Kbd>
          </ShortcutItem>

          <ShortcutItem label={t("shortcuts.showShortcuts")}>
            <Kbd.Meta />
            <Kbd.Slash />
          </ShortcutItem>

          <ShortcutItem label={t("shortcuts.share")}>
            <Kbd.Alt />
            <Kbd>S</Kbd>
          </ShortcutItem>

          <ShortcutItem label={t("settings.title")}>
            <Kbd.Meta />
            <Kbd>.</Kbd>
          </ShortcutItem>

          <ShortcutItem label={t("usage.title")}>
            <Kbd.Meta />
            <Kbd.Shift />
            <Kbd>P</Kbd>
          </ShortcutItem>

          <ShortcutItem label={t("shortcuts.voiceInput")}>
            <Kbd.Alt />
            <Kbd>R</Kbd>
          </ShortcutItem>
        </div>
      </DialogContent>
    </Dialog>
  );
};
