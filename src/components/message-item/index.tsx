import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import {
  FocusEvent,
  KeyboardEvent,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import Markdown from "react-markdown";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { usePlayer } from "@/store/player-store";
import {
  AudioLines,
  Clipboard,
  ImagePlus,
  Pencil,
  RotateCw,
  TextSelect,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

import { A as a } from "./components/a";
import { Code as code } from "./components/code";
import { Pre as pre } from "./components/pre";
import { Span as span } from "./components/span";

import { parseContent } from "@/lib/parseContent";
import { cn, createChatMessage } from "@/lib/utils";
import TextareaAutosize from "react-textarea-autosize";
import { Tooltip } from "../tooltip";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useMobile } from "@/hooks/useMobile";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { Logo } from "../logo";

import "katex/dist/katex.min.css";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

interface MessageProps {
  role: ChatCompletionMessageParam["role"];
  content: ChatCompletionMessageParam["content"];
  index: number;
  disabled?: boolean;
  retryable?: boolean;
  editable?: boolean;
  onRetry?: () => void;
  onEdit?: (
    message: ChatCompletionMessageParam["content"],
    index: number,
  ) => void;
}

export const MessageItem = memo<MessageProps>(
  ({
    role,
    content,
    index,
    disabled,
    editable,
    retryable,
    onRetry,
    onEdit,
  }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    const [edit, setEdit] = useState(false);
    const [editImage, setEditImage] = useState(true);
    const [textareaValue, setTextareaValue] = useState("");
    const [isSelectText, setSelectText] = useState(false);
    const [setText, isLoading, currentText] = usePlayer((s) => [
      s.setText,
      s.isLoading,
      s.text,
    ]);

    const { text, images } = parseContent(content);
    const isMobile = useMobile();
    const status = useNetworkStatus();

    useEffect(() => setTextareaValue(text), [text]);
    useEffect(() => () => setEdit(false), []);

    if (role !== "assistant" && role !== "user") return null;

    const getText = () => {
      if (contentRef.current) {
        return contentRef.current.innerText;
      }
      return "";
    };

    const play = () => {
      const text = getText();
      if (text && currentText !== text) {
        setText(text);
      }
    };

    const copy = () => {
      navigator.clipboard.writeText(getText()).then(() => {
        toast.success(t("common.copySuccess"), {
          position: "top-right",
          duration: 2000,
        });
      });
    };

    const cancel = () => {
      setEdit(false);
      setTextareaValue(text);
      setEditImage(true);
    };

    const save = () => {
      const newMessage = createChatMessage(editImage, textareaValue);

      onEdit?.(newMessage, index);
      setEdit(false);
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancel();
      }
    };

    const setCursor = ({
      target,
    }: FocusEvent<HTMLTextAreaElement, Element>) => {
      target.selectionStart = target.value.length;
      target.selectionEnd = target.value.length;
    };

    const itemDisabled = disabled || isLoading || status === "offline";

    return (
      <>
        {!!images.length && editImage && (
          <div className="relative mb-1 ml-auto overflow-hidden ">
            <div className="flex gap-2">
              {images.map((image) => (
                <img
                  key={image}
                  src={image}
                  alt="image"
                  className="block w-20 max-w-full rounded-md border xs:w-28 md:w-36 lg:w-40"
                />
              ))}
            </div>

            {edit && (
              <Tooltip label={t("common.removeImage")}>
                <Button
                  size={"xs"}
                  onClick={() => setEditImage(false)}
                  className="absolute bottom-1 right-1"
                >
                  <X />
                </Button>
              </Tooltip>
            )}
          </div>
        )}

        {isSelectText && (
          <div
            className="absolute inset-0 z-40 bg-black/80"
            onClick={() => setSelectText(false)}
          />
        )}

        <ContextMenu>
          <ContextMenuTrigger
            disabled={isSelectText}
            asChild
            className={cn("px-3 py-2 shadow-none", {
              "ml-auto max-w-72 rounded-2xl bg-sidebar md:max-w-[90%]":
                role === "user",
              "rounded-se-md": !!images.length,
              "border-none": role === "assistant",
              "select-none": isMobile,
              "w-full": edit,
              "z-50 select-auto": isSelectText,
            })}
          >
            {text && (
              <Card>
                <CardContent className={"p-0"} ref={contentRef}>
                  {!!images.length && !editImage && (
                    <Tooltip label={t("common.returnImage")}>
                      <Button size="xs" onClick={() => setEditImage(true)}>
                        <ImagePlus />
                      </Button>
                    </Tooltip>
                  )}

                  {!edit ? (
                    <>
                      <Markdown
                        className="prose max-w-full leading-5 dark:prose-invert sm:leading-6"
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        components={{ code, pre, a, span }}
                      >
                        {text}
                      </Markdown>
                    </>
                  ) : (
                    <Textarea
                      autoFocus
                      onFocus={setCursor}
                      as={TextareaAutosize}
                      value={textareaValue}
                      onKeyDown={handleEscape}
                      onChange={(e) => setTextareaValue(e.target.value)}
                      className="text-md min-h-fit resize-none rounded-none border-none p-0 leading-5 text-slate-700 focus-visible:outline-none focus-visible:ring-0 dark:text-gray-300 sm:leading-6"
                    />
                  )}
                </CardContent>

                {edit && (
                  <CardFooter className="flex gap-2 p-0 pt-2">
                    <>
                      <Button
                        onClick={cancel}
                        variant={"destructive"}
                        className="h-7"
                      >
                        {t("common.cancel")}
                      </Button>
                      <Button
                        onClick={save}
                        className="h-7"
                        disabled={textareaValue.trim().length === 0}
                      >
                        {t("common.save")}
                      </Button>
                    </>
                  </CardFooter>
                )}
              </Card>
            )}
          </ContextMenuTrigger>
          {!isSelectText && (
            <ContextMenuContent>
              <ContextMenuItem
                className="hovering"
                onClick={copy}
                disabled={disabled}
              >
                <Clipboard className="mr-2 h-4 w-4" />
                {t("common.copy")}
              </ContextMenuItem>

              <ContextMenuItem
                className="hovering"
                onClick={play}
                disabled={itemDisabled}
              >
                <AudioLines className="mr-2 h-5 w-5" />
                {t("common.play")}
              </ContextMenuItem>

              {retryable && (
                <ContextMenuItem
                  className="hovering"
                  onClick={onRetry}
                  disabled={itemDisabled}
                >
                  <RotateCw className="mr-2 h-4 w-4" />
                  {t("common.retry")}
                </ContextMenuItem>
              )}
              {editable && (
                <ContextMenuItem
                  className="hovering"
                  onClick={() => setEdit(true)}
                  disabled={itemDisabled}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  {t("common.edit")}
                </ContextMenuItem>
              )}

              {isMobile && (
                <ContextMenuItem
                  className="hovering"
                  onClick={() => setSelectText(true)}
                >
                  <TextSelect className="mr-2 h-4 w-4" />
                  {t("common.selectText")}
                </ContextMenuItem>
              )}
            </ContextMenuContent>
          )}
        </ContextMenu>

        {!content && (
          <div className="mx-auto flex h-9 w-9 items-center justify-center">
            <Logo className="h-6 w-6 animate-spin" />
          </div>
        )}
      </>
    );
  },
);

export default MessageItem;
