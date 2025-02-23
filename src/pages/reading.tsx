import { Player } from "@/components/player";
import { SharedTextDialog } from "@/components/shared-text-dialog";
import { useSharedText } from "@/hooks/useSharedText";
import { usePlayer } from "@/store/player-store";
import { useNavigate } from "@tanstack/react-router";

import { FC, useEffect, useState } from "react";

export const Reading: FC = () => {
  const navigate = useNavigate();
  const setText = usePlayer((s) => s.setText);
  const text = useSharedText();
  const [open, setOpen] = useState(false);

  const onVoice = () => {
    setText(text);
    setOpen(false);
  };

  useEffect(() => {
    setOpen(text.length > 0);
  }, [text]);

  return (
    <>
      <div className="h-[100vh] p-5">
        <div className="h-full overflow-auto">
          <p className="pt-8">{text}</p>
        </div>
      </div>

      <Player />

      <SharedTextDialog
        open={open}
        onOpenChange={setOpen}
        onVoice={onVoice}
        onDisscuss={() => navigate({ to: "/chat/" })}
      />
    </>
  );
};
