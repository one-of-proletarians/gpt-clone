import { FC, useId, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useInstruction } from "@/store/instructions-store";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Textarea, TextareaProps } from "../ui/textarea";
import { DescTooltip } from "./desc-tooltip";
import { Description } from "./description";
import { Hint } from "./hint";
import { InstructionCounter } from "./instruction-counter";

interface GptInstructionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GptInstruction: FC<GptInstructionProps> = ({
  open,
  onOpenChange,
}) => {
  const { t } = useTranslation();

  const id = useId();

  const [hasUserFocus, setHasUserFocus] = useState(false);
  const [hasGptFocus, setHasGptFocus] = useState(false);

  const [showUserHint, setShowUserHint] = useState(true);
  const [showGptHint, setShowGptHint] = useState(true);

  const userRef = useRef<HTMLTextAreaElement>(null);
  const gptRef = useRef<HTMLTextAreaElement>(null);

  const {
    gptInstruction,
    userInstruction,
    includeForNewChat,
    setGptInstruction,
    setUserInstruction,
    setIncludeForNewChat,
  } = useInstruction();

  const userHints: string[] = t("instruction.user", {
    returnObjects: true,
  });

  const gptHints: string[] = t("instruction.gpt", {
    returnObjects: true,
  });

  const textareaProps: TextareaProps = {
    rows: Number(import.meta.env.VITE_INSTRUCTION_TEXTAREA_ROWS),
    disabled: !includeForNewChat,
    className: "mb-2 resize-none p-5",
  };

  const handleChange = (open: boolean) => {
    onOpenChange(open);
    setShowUserHint(!open);
    setShowGptHint(!open);
  };

  return (
    <Dialog open={open} onOpenChange={handleChange}>
      <DialogContent className="lg:min-w-[600px]">
        <DialogHeader>
          <DialogTitle className="border-b pb-5">
            {t("sidebar.customInstructions")}
          </DialogTitle>
          <div>
            <div className="flex items-center gap-1">
              <div className="text-sm font-medium">
                {t("instruction.description")}
              </div>

              <DescTooltip />
            </div>

            <Description>{t("instruction.userDescription")}</Description>
            <div className="relative">
              <Textarea
                ref={userRef}
                value={userInstruction}
                onChange={(e) => setUserInstruction(e.target.value)}
                onBlur={() => setHasUserFocus(false)}
                onFocus={() => setHasUserFocus(true)}
                {...textareaProps}
              />
              <InstructionCounter
                counter={userInstruction.length}
                hasFocus={hasUserFocus}
                showHint={showUserHint}
                onToggle={() => {
                  setShowUserHint((s) => !s);
                  userRef.current?.focus();
                }}
              />

              <Hint
                title={t("instruction.title")}
                show={hasUserFocus && showUserHint}
                list={userHints}
              />
            </div>

            <Description>{t("instruction.gptDescription")}</Description>
            <div className="relative">
              <Textarea
                ref={gptRef}
                value={gptInstruction}
                onChange={(e) => setGptInstruction(e.target.value)}
                onBlur={() => setHasGptFocus(false)}
                onFocus={() => setHasGptFocus(true)}
                {...textareaProps}
              />

              <InstructionCounter
                counter={gptInstruction.length}
                hasFocus={hasGptFocus}
                showHint={showGptHint}
                onToggle={() => {
                  setShowGptHint((s) => !s);
                  gptRef.current?.focus();
                }}
              />

              <Hint
                title={t("instruction.title")}
                show={hasGptFocus && showGptHint}
                list={gptHints}
              />
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor={id}>{t("instruction.enableForNew")}</Label>
              <Switch
                id={id}
                checked={includeForNewChat}
                onCheckedChange={setIncludeForNewChat}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={"destructive"}
                onClick={() => handleChange(false)}
              >
                {t("common.ok")}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
