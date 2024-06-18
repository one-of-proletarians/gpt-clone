import { useChatId } from "@/hooks/useChatId";
import { useMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { useHistoryChat } from "@/store/history-store";
import { memo, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { ChatButton } from "./chat-button";
import { Menu } from "./menu";
import { NavItem } from "./nav-item";
import { ToggleMenu } from "./toggle-menu";
import { ScrollArea } from "./ui/scroll-area";

interface SidebarProps {
  open: boolean;
  onToggle: (open: boolean) => void;
}

export const Sidebar = memo<SidebarProps>(({ open, onToggle }) => {
  const chats = useHistoryChat((store) =>
    Object.entries(store.chats).map(([key, chat]) => ({
      key,
      title: chat.title,
    })),
  );

  const overlayRef = useRef<HTMLDivElement>(null);

  const chatId = useChatId();
  const isMobile = useMobile();

  return (
    <>
      <CSSTransition
        in={open}
        nodeRef={overlayRef}
        timeout={300}
        classNames="overlay"
        unmountOnExit
      >
        <div
          ref={overlayRef}
          className={cn(
            "overlay absolute bottom-0 left-0 top-0 z-50 h-full w-full bg-black/80 md:hidden",
          )}
          onClick={() => onToggle(false)}
        />
      </CSSTransition>

      <div
        className={cn(
          "absolute bottom-0 left-0 top-0 z-50 bg-sidebar transition-all md:relative md:z-auto",
          isMobile
            ? {
                "w-sidebar": true,
                "-translate-x-[var(--menu-offset-distance)]": !open,
              }
            : {
                "w-sidebar min-w-sidebar": open,
                "w-0 min-w-0 max-w-0": !open,
              },
        )}
      >
        <ToggleMenu open={open} onToggle={onToggle} />

        <div className="relative flex h-full w-full max-w-full flex-col overflow-hidden">
          <div className="absolute left-0 right-0 top-0 w-full bg-sidebar px-2 pb-1 pt-2">
            <ChatButton />
          </div>
          <ScrollArea className="h-full w-full">
            <ul className="flex w-sidebar flex-col gap-1 px-4 pt-12">
              {chats.map(({ key, title }) => (
                <NavItem key={key} id={key} active={key === chatId}>
                  {title}
                </NavItem>
              ))}
            </ul>
          </ScrollArea>

          <div className="overflow-hidden p-3 pb-4">
            <Menu />
          </div>
        </div>
      </div>
    </>
  );
});
