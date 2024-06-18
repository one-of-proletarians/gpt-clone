import { Tooltip } from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAPIKey } from "@/store/key-store";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { FC, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/hooks/useTheme";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";

import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useMenuState } from "@/hooks/useMenuState";
import { useMobile } from "@/hooks/useMobile";
import { useHistoryChat } from "@/store/history-store";
import { useSettings } from "@/store/settings-store";
import { useKeyPress } from "@/hooks/useKeyPress";

const languages: Record<string, string> = {
  "ua-UA": "Українська",
  "en-US": "English",
  "ru-RU": "Русский",
  "de-DE": "Deutsch",
  "tr-TR": "Türkçe",
};

const Li: FC<{ children: ReactNode }> = (props) => (
  <li className="flex items-center justify-between" {...props} />
);

export const Settings: FC = () => {
  useEffect(() => {
    if (apiKey.length === 0) {
      router.history.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [historyCleared, setHistoryCleared] = useState(false);
  const setOpenMenu = useMenuState((s) => s.setOpen);
  const isMobile = useMobile();

  useEffect(() => {
    isMobile && setOpenMenu(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const apiKey = useAPIKey((s) => s.apiKey);
  const router = useRouter();

  const { theme, setTheme } = useTheme();
  const clear = useHistoryChat((store) => store.clear);

  const mods = Object.entries(
    t("settings.theme.mode", { returnObjects: true }),
  );

  const back = () => {
    if (historyCleared) router.navigate({ to: "/chat/" });
    else router.history.back();
  };

  useKeyPress("Escape", back, ["prevent"]);

  const {
    clearAtLogout,
    scrollWhenResponding,
    setClearAtLogout,
    setScrollWhenResponding,
  } = useSettings();

  return (
    <div className="flex h-full w-full justify-center">
      <div className="flex h-full w-full flex-col items-center p-2 md:w-[80%] lg:w-1/2">
        <div className="flex w-full gap-4 border-b pb-2 md:border-none">
          <Tooltip label={t("settings.back")}>
            <Button size={"icon"} onClick={back}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Tooltip>
          <h1 className="text-2xl font-medium">{t("settings.title")}</h1>
        </div>

        <ScrollArea className="w-full pr-2.5 pt-1">
          <ul className="flex flex-col gap-2 p-1">
            <Li>
              <span>{t("settings.language")}</span>
              <Select onValueChange={i18n.changeLanguage}>
                <SelectTrigger className="w-48 !ring-0">
                  {languages[i18n.language]}
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(languages).map(([lang, label]) => (
                    <SelectItem key={lang} value={lang} className="hovering">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Li>

            <Separator />

            <Li>
              <span>{t("settings.theme.label")}</span>
              <Select onValueChange={setTheme}>
                <SelectTrigger className="w-48 !ring-0">
                  {t(`settings.theme.mode.${theme}`)}
                </SelectTrigger>
                <SelectContent>
                  {mods.map(([mode, label]) => (
                    <SelectItem
                      key={mode}
                      value={mode}
                      className="hovering active:!bg-white"
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Li>

            <Separator />

            <Li>
              <label className="flex w-full items-center justify-between py-1.5">
                <span>{t("settings.scrollWhenResponding")}</span>
                <Checkbox
                  className="h-5 w-5"
                  checked={scrollWhenResponding}
                  onCheckedChange={(value: boolean) =>
                    setScrollWhenResponding(value)
                  }
                />
              </label>
            </Li>

            <Separator />

            <Li>
              <label className="flex w-full items-center justify-between py-1.5">
                <span>{t("settings.clearHistoryAtLogout")}</span>
                <Checkbox
                  className="h-5 w-5"
                  checked={clearAtLogout.history}
                  onCheckedChange={(history: boolean) =>
                    setClearAtLogout({ history })
                  }
                />
              </label>
            </Li>

            <Separator />

            <Li>
              <label className="flex w-full items-center justify-between py-1.5">
                <span>{t("settings.clearAudioCacheAtLogout")}</span>
                <Checkbox
                  className="h-5 w-5"
                  checked={clearAtLogout.cache}
                  onCheckedChange={(value: boolean) =>
                    setClearAtLogout({ cache: value })
                  }
                />
              </label>
            </Li>

            <Separator />

            <Li>
              <span>{t("settings.clearHistory")}</span>
              <Button variant={"destructive"} onClick={() => setOpen(true)}>
                {t("settings.clear")}
              </Button>
            </Li>
          </ul>
        </ScrollArea>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader className="text-start">
            {t("settings.clearHistoryConfirm")}
          </DialogHeader>
          <DialogFooter className="flex-row justify-end gap-2 sm:gap-0">
            <Button variant={"secondary"} onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant={"destructive"}
              onClick={() => {
                clear();
                setOpen(false);
                setHistoryCleared(true);
              }}
            >
              {t("settings.clear")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
