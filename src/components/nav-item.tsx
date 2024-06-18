import { cn } from "@/lib/utils";
import { useHistoryChat } from "@/store/history-store";
import { Link, useNavigate } from "@tanstack/react-router";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import {
  KeyboardEvent,
  SyntheticEvent,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "./tooltip";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { useKeyPress } from "@/hooks/useKeyPress";

interface NavItemProps {
  children: string;
  id: string;
  active: boolean;
}

export const NavItem = memo<NavItemProps>(({ children, active, id }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(active);
  const navigate = useNavigate();

  const [edited, setEdited] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [rename, remove] = useHistoryChat((state) => [
    state.setTitle,
    state.remove,
  ]);

  const handleBlur = () => {
    setEdited(false);
    setVisible(active);
  };

  useEffect(() => {
    setVisible(active);
  }, [active]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code !== "Enter") return;

    const value = (e.target as HTMLInputElement).value.trim();
    if (value.length) rename(value, id);
    handleBlur();
  };

  const renameHandle = (e: SyntheticEvent) => {
    e.stopPropagation();

    setEdited(true);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const removeHandle = (e: SyntheticEvent) => {
    e.stopPropagation();
    remove(id);
    navigate({ to: "/" });
  };

  useKeyPress(
    "Backspace",
    () => {
      remove(id);
      navigate({ to: "/" });
    },
    ["shift", "meta", "prevent"],
  );

  if (edited)
    return (
      <Input
        ref={inputRef}
        className="my-1 h-7 py-0 pl-2"
        defaultValue={children}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
    );

  // TODO: пепеписать активные ссылки
  return (
    <Button
      asChild
      variant="ghost"
      className={cn("hovering relative justify-start overflow-hidden pl-2", {
        "bg-primary text-white dark:bg-white dark:text-black":
          visible || active,
      })}
    >
      <Link to={`/chat/$chatId`} params={{ chatId: id }}>
        <span className="max-w-[90%] overflow-hidden text-ellipsis">
          {children}
        </span>
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 top-0 flex items-center justify-end gap-3 opacity-0 hover:opacity-100",
            { "opacity-100": visible || active },
          )}
        >
          <DropdownMenu onOpenChange={setVisible}>
            <DropdownMenuTrigger tabIndex={-1}>
              <Tooltip label={t("sidebar.more")}>
                <div className="pr-2">
                  <Ellipsis className="w-6 px-1 hover:stroke-gray-400 focus-visible:border-none" />
                </div>
              </Tooltip>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="hovering cursor-pointer"
                onClick={renameHandle}
              >
                <Pencil className="mr-2 h-4 w-4" />
                {t("common.rename")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hovering cursor-pointer text-red-500 hover:!text-red-500"
                onClick={removeHandle}
              >
                <Trash2 className="mr-2 h-4 w-4 stroke-red-500" />
                {t("common.remove")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Link>
    </Button>
  );
});
