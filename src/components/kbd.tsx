import { checkMacOS } from "@/lib/utils";
import { FC } from "react";

interface KbdProps {
  children: React.ReactNode;
}

interface KbdWithStaticProps extends FC<KbdProps> {
  Meta: () => JSX.Element;
  Slash: () => JSX.Element;
  Shift: () => JSX.Element;
  Escape: () => JSX.Element;
  Backspace: () => JSX.Element;
  Alt: () => JSX.Element;
}

export const Kbd: KbdWithStaticProps = ({ children }) => (
  <div className="flex h-8 min-w-8 items-center justify-center rounded-md border px-2.5 capitalize">
    <span className="text-xs">{children}</span>
  </div>
);

Kbd.Slash = () => <Kbd>/</Kbd>;
Kbd.Escape = () => <Kbd>Esc</Kbd>;
Kbd.Shift = () => <Kbd>Shift</Kbd>;
Kbd.Backspace = () => <Kbd>Backspace</Kbd>;
Kbd.Meta = () => <Kbd>{checkMacOS() ? "⌘" : "Ctrl"}</Kbd>;
Kbd.Alt = () => <Kbd>{checkMacOS() ? "⌥" : "Alt"}</Kbd>;
