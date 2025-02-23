import { FC } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

type SharedTextDialogProps = {
  open: boolean;
  onVoice: () => void;
  onDisscuss: () => void;
  onOpenChange: (opan: boolean) => void;
};

export const SharedTextDialog: FC<SharedTextDialogProps> = ({
  onVoice,
  onDisscuss,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <Dialog {...props}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <Button onClick={onDisscuss}>{t("reading.disscuss")}</Button>
        <Button onClick={onVoice}>{t("reading.voice")}</Button>
      </DialogContent>
    </Dialog>
  );
};
