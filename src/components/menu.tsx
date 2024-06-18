import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useNavigate } from "@tanstack/react-router";
import {
  BookA,
  GhostIcon,
  Keyboard,
  LogOut,
  PieChart,
  Settings,
} from "lucide-react";
import { cloneElement, memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { GptInstruction } from "./gpt-instruction";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

import { useKeyPress } from "@/hooks/useKeyPress";
import { useMenuState } from "@/hooks/useMenuState";
import { clearCache } from "@/lib/voiceStorage";
import { useHistoryChat } from "@/store/history-store";
import { useAPIKey } from "@/store/key-store";
import { usePlayer } from "@/store/player-store";
import { useSettings } from "@/store/settings-store";
import { ShortcutsDialog } from "./shortcuts-dialog";
import { useMobile } from "@/hooks/useMobile";
import { useBadgeDialogState } from "./usage/state";

interface DropdownCustomItemProps {
  children: React.ReactNode;
  icon?: React.ReactElement;
  onClick?: () => void;
}

const DropdwonCustomItem = memo<DropdownCustomItemProps>(
  ({ children, icon, ...props }) => {
    return (
      <DropdownMenuItem
        inset
        className="hovering cursor-pointer py-4"
        {...props}
      >
        {icon && cloneElement(icon, { className: "mr-3 h-4 w-4" })}
        {children}
      </DropdownMenuItem>
    );
  },
);

export const Menu = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [openInstruction, setOpenInstruction] = useState(false);
  const [openShortcuts, setOpenShortcuts] = useState(false);

  const clearAtLogout = useSettings((s) => s.clearAtLogout);
  const clearApiKey = useAPIKey((s) => s.clearApiKey);
  const clearHistory = useHistoryChat((s) => s.clear);
  const setOpenMenu = useMenuState((s) => s.setOpen);
  const [setText] = usePlayer((s) => [s.setText]);
  const setOpenStatistics = useBadgeDialogState((s) => s.setOpen);

  const isMobile = useMobile();

  const logout = () => {
    if (clearAtLogout.history) clearHistory();
    if (clearAtLogout.cache) clearCache();

    setText("");

    clearApiKey();

    navigate({ to: "/" });

    setOpenMenu(false);
  };

  useKeyPress("Slash", () => setOpenShortcuts((open) => !open), [
    "meta",
    "prevent",
  ]);
  useKeyPress("KeyI", () => setOpenInstruction((open) => !open), [
    "shift",
    "meta",
    "prevent",
  ]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="hovering h-auto w-full justify-start py-2"
          >
            <Avatar className="mr-4">
              <AvatarImage src={import.meta.env.VITE_AVATAR_URL} />
              <AvatarFallback>
                <GhostIcon className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            {t("sidebar.profile")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent className="sidebar-menu-width margin-auto">
            {!isMobile && (
              <DropdwonCustomItem
                icon={<Keyboard />}
                onClick={() => setOpenShortcuts(true)}
              >
                {t("shortcuts.title")}
              </DropdwonCustomItem>
            )}

            <DropdwonCustomItem
              icon={<PieChart />}
              onClick={() => setOpenStatistics(true)}
            >
              {t("usage.shortTitle")}
            </DropdwonCustomItem>

            <DropdwonCustomItem
              icon={<BookA />}
              onClick={() => setOpenInstruction(true)}
            >
              {t("sidebar.customInstructions")}
            </DropdwonCustomItem>

            <DropdwonCustomItem
              icon={<Settings />}
              onClick={() => navigate({ to: "/settings" })}
            >
              {t("sidebar.settings")}
            </DropdwonCustomItem>

            <DropdownMenuSeparator />
            <DropdwonCustomItem icon={<LogOut />} onClick={logout}>
              {t("sidebar.logout")}
            </DropdwonCustomItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>

      <GptInstruction
        open={openInstruction}
        onOpenChange={setOpenInstruction}
      />

      <ShortcutsDialog open={openShortcuts} onOpenChange={setOpenShortcuts} />
    </>
  );
});
