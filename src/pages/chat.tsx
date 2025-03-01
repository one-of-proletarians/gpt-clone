import { ButtonFile, FileHandler } from "@/components/button-file";
import { ChatButton } from "@/components/chat-button";
import { Fallback } from "@/components/fallback";
import { MicrophoneButton } from "@/components/microphone-button";
import { ScrollButton } from "@/components/scroll-button";
import { SelectGallery } from "@/components/select-gallery";
import { SelectModel } from "@/components/select-model";
import { SendButton } from "@/components/send-button";
import { ShareButton } from "@/components/share-button";
import { Sidebar } from "@/components/sidebar";
import { StopButton } from "@/components/stop-button";
import { Tooltip } from "@/components/tooltip";
import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UsageLink } from "@/components/usage-link";
import { UsageBadge } from "@/components/usage/badge";
import { UsageDialog } from "@/components/usage/dialog";
import { VoiceRecorder } from "@/components/voice-recorder";
import { Welcome } from "@/components/welcome";
import { useChatId } from "@/hooks/useChatId";
import { useKeyPress } from "@/hooks/useKeyPress";
import { useMenuState } from "@/hooks/useMenuState";
import { useMobile } from "@/hooks/useMobile";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useRecorder } from "@/hooks/useRecording";
import { useSharedText } from "@/hooks/useSharedText";
import { modelSupportsImages } from "@/lib/modelSupportsImages";
import { createChatTitle, useOpenAI } from "@/lib/openai";
import { cn, createChatMessage } from "@/lib/utils";
import { useCurrentChatId } from "@/store/current_chat_id-store";
import { useFileSelect } from "@/store/file_select-store";
import { useHistoryChat } from "@/store/history-store";
import { shouldCreateTitle, useInstruction } from "@/store/instructions-store";
import { useModel } from "@/store/models-store";
import { useSettings } from "@/store/settings-store";
import { useShare } from "@/store/share-store";
import { useNavigate } from "@tanstack/react-router";
import { Menu, Share } from "lucide-react";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import {
  FC,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import { useSwipeable } from "react-swipeable";
import TextareaAutosize from "react-textarea-autosize";
import { useShallow } from "zustand/react/shallow";

const MessageItem = lazy(() => import("@/components/message-item/index.tsx"));

export const ChatPage: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { model } = useModel();

  const chatId = useChatId();

  const isMobile = useMobile();

  const { open, setOpen, toggleMenu } = useMenuState();

  const [message, setMessage] = useState("");

  const sharedText = useSharedText();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const clearFileRef = useRef<FileHandler | undefined>();

  const { toggle, cancel, transcript, isRecording, isLoading } = useRecorder();

  const chatModel = useHistoryChat((store) => store.chats[chatId]?.model);

  const modelSupportImages = modelSupportsImages(chatModel ?? model);

  const { send, response, controller, isStreamLoading } = useOpenAI();

  const scrollWhenResponding = useSettings((s) => s.scrollWhenResponding);

  const [imagesLoading, setImagesLoading] = useState(false);

  const openShareDialog = useShare((s) => s.openShareDialog);

  const hasFiles = useFileSelect(useShallow((s) => s.files.length > 0));

  const { currentChatId, setCurrentChatId } = useCurrentChatId();
  const [
    messages,
    tokenCount,
    addMessage,
    addItem,
    updateMessage,
    setTitle,
    popMessage,
  ] = useHistoryChat((s) => [
    s.chats[chatId]?.messages ?? [],
    s.chats[chatId]?.tokenCount,
    s.addMessage,
    s.addItem,
    s.updateMessage,
    s.setTitle,
    s.popMessage,
  ]);

  const { ref: scrollButtonRef, inView } = useInView({
    threshold: 0.5,
    delay: 200,
  });

  const handlers = useSwipeable({
    onSwipedRight: () => setOpen(true),
    onSwipedLeft: () => setOpen(false),
    swipeDuration: 500,
    trackMouse: true,
    delta: 80,
  });

  useEffect(() => {
    if (sharedText) {
      setMessage(sharedText);
    }
  }, [sharedText]);

  useEffect(() => {
    isMobile && setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, isMobile]);

  useEffect(() => {
    setMessage(transcript);
    textareaRef.current?.focus();
  }, [transcript]);

  useEffect(() => {
    if (response) {
      updateMessage(response, currentChatId);

      if (scrollWhenResponding && chatId === currentChatId) {
        scrollToBottom(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendRef.current?.click();
    }
  };

  const includeForNewChat = useInstruction((s) => s.includeForNewChat);
  const placeholder = t("chat.placeholder") + (includeForNewChat ? " 🌟" : "");

  const sendMessage = () => {
    if (!chatId) setCurrentChatId(addItem(model));
    else setCurrentChatId(chatId);

    const { currentChatId } = useCurrentChatId.getState();

    const content = createChatMessage(modelSupportImages, message);

    addMessage({ role: "user", content }, currentChatId);
    addMessage({ role: "assistant", content: "" }, currentChatId);

    scrollToBottom();

    const { chats } = useHistoryChat.getState();
    const messages = chats[currentChatId].messages.slice(0, -1);
    const currentChatModel = chats[currentChatId].model;

    if (shouldCreateTitle()) {
      createChatTitle(message).then((title) => setTitle(title, currentChatId));
    }

    setMessage("");
    clearFileRef?.current?.clearFile();

    send({ messages, model: currentChatModel });
    navigate({ to: "/chat/$chatId", params: { chatId: currentChatId } });
  };

  const retry = useCallback(() => {
    popMessage(chatId);

    setCurrentChatId(chatId);

    const { currentChatId } = useCurrentChatId.getState();

    const { chats } = useHistoryChat.getState();
    const messages = chats[currentChatId].messages.slice(0, -1);
    const model = chats[currentChatId].model;

    send({ messages, model });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  const edit = useCallback(
    (message: ChatCompletionMessageParam["content"], index: number) => {
      updateMessage(message, chatId, index);
      retry();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chatId],
  );

  const scrollToBottom = (behavior = true) => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: behavior ? "smooth" : undefined,
        });
      }
    });
  };

  useKeyPress("KeyE", toggleMenu, ["shift", "meta", "prevent"]);
  useKeyPress("Escape", () => textareaRef?.current?.focus?.(), [
    "shift",
    "prevent",
  ]);
  useKeyPress("Period", () => navigate({ to: "/settings" }), [
    "meta",
    "prevent",
  ]);

  useKeyPress(
    "KeyO",
    () => {
      navigate({ to: "/chat/" });
      textareaRef.current?.focus();
    },
    ["shift", "meta", "prevent"],
  );

  useKeyPress("KeyR", toggle, ["alt", "prevent"]);

  const isOffline = useNetworkStatus() === "offline";

  const sendButtonDisabled =
    !(message || hasFiles) || isLoading || isOffline || imagesLoading;

  const selectModelDisabled = !!messages.length || isLoading;
  const textareaDisabled = isLoading || isStreamLoading || isOffline;

  const buttonFileDisabled = isLoading || isOffline;

  const tabIndex = isMobile && open ? -1 : 0;

  return (
    <>
      <div
        className="relative flex h-dvh-fallback w-full min-w-[320px]"
        {...handlers}
      >
        <Sidebar open={open} onToggle={setOpen} />

        <div
          className={cn("flex h-full w-full flex-col transition-transform", {
            "translate-x-10 scale-95": open && isMobile,
          })}
        >
          <div className="flex max-w-[100vw] flex-row-reverse items-center justify-between gap-2 p-2 md:flex-row md:justify-normal">
            <div className="flex gap-1">
              {false && (
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className="ml-auto md:hidden"
                  onClick={openShareDialog}
                  disabled={!chatId || isOffline}
                >
                  <Share className="h-4 w-4" />
                </Button>
              )}

              <ChatButton
                small
                tabIndex={tabIndex}
                disabled={isStreamLoading}
                className={cn({ hidden: open && !isMobile })}
              />
            </div>

            {false && (
              <SelectModel
                disabled={selectModelDisabled}
                value={chatModel ?? model ?? ""}
                tabIndex={tabIndex}
              />
            )}

            <div className="flex items-center justify-center gap-2">
              <Button
                size={"icon"}
                variant={"ghost"}
                className="md:hidden"
                onClick={toggleMenu}
                tabIndex={tabIndex}
              >
                <Menu />
              </Button>

              <UsageBadge className="md:ml-2" />

              {tokenCount && (
                <Tooltip label={t("chat.chatSize")}>
                  <div className={cn(badgeVariants(), "select-none")}>
                    {tokenCount}
                  </div>
                </Tooltip>
              )}
            </div>

            <UsageLink />

            {false && (
              <ShareButton
                onClick={openShareDialog}
                disabled={!chatId || isOffline}
              />
            )}
          </div>

          {!messages.length ? (
            <Welcome />
          ) : (
            <div
              className="flex grow flex-col items-center gap-2 overflow-auto"
              ref={scrollRef}
            >
              <div className="gap-2f flex w-[98%] flex-1 flex-col sm:w-[90%] xl:w-[65%]">
                <Suspense fallback={<Fallback />}>
                  {messages.map((message, i) => (
                    <MessageItem
                      key={i}
                      index={i}
                      disabled={isStreamLoading}
                      role={message.role}
                      content={message.content || ""}
                      onRetry={retry}
                      onEdit={edit}
                      retryable={
                        message.role === "assistant" &&
                        messages.length === i + 1
                      }
                      editable={
                        message.role === "user" && messages.length - 2 === i
                      }
                    />
                  ))}
                </Suspense>

                <div
                  className="visibility-hidden h-0 w-0 -translate-y-4 opacity-0"
                  ref={scrollButtonRef}
                />
              </div>
            </div>
          )}

          <div className="relative mt-auto flex w-full items-center justify-center bg-inherit">
            <ScrollButton
              hidden={inView || messages.length === 0}
              onClick={scrollToBottom}
            />

            <form
              className="relative z-10 flex w-full bg-background md:w-[75%] xl:w-[60%]"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="relative h-full min-h-16 w-full">
                <SelectGallery />
                <ButtonFile
                  disabled={buttonFileDisabled}
                  onChangeLoaded={setImagesLoading}
                />
                <Textarea
                  autoFocus
                  value={message}
                  ref={textareaRef}
                  tabIndex={tabIndex}
                  as={TextareaAutosize}
                  onKeyDown={handleKeyDown}
                  disabled={textareaDisabled}
                  placeholder={placeholder}
                  onChange={(e) => setMessage(e.target.value.trimStart())}
                  maxRows={+import.meta.env.VITE_MAX_TEXTAREA_ROWS}
                  className={cn(
                    "resize-none border-none bg-sidebar p-4 px-14 text-lg !ring-0 focus-visible:ring-gray-700 md:rounded-[2rem]",
                    { "pt-24": hasFiles },
                  )}
                />

                {isStreamLoading ? (
                  <StopButton
                    tabIndex={tabIndex}
                    onClick={() => controller.current?.abort?.()}
                  />
                ) : message.length || hasFiles ? (
                  <SendButton
                    ref={sendRef}
                    tabIndex={tabIndex}
                    disabled={sendButtonDisabled}
                  />
                ) : (
                  <MicrophoneButton
                    onClick={toggle}
                    tabIndex={tabIndex}
                    isLoading={isLoading}
                    disabled={textareaDisabled}
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <UsageDialog />
      {isRecording && <VoiceRecorder onStop={toggle} onCancel={cancel} />}
    </>
  );
};
