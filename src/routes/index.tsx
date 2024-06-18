import { LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleAPIError } from "@/lib/openai";
import { cn } from "@/lib/utils";
import { useAPIKey } from "@/store/key-store";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import OpenAI from "openai";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const { apiKey } = useAPIKey.getState();
    if (apiKey.length)
      throw redirect({
        to: "/chat/",
      });
  },
  component: Component,
});

function Component() {
  const { t } = useTranslation();
  const [key, setKey] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setApiKey } = useAPIKey.getState();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(!key.length);

    if (key.length) {
      setLoading(true);
      new OpenAI({
        apiKey: key,
        dangerouslyAllowBrowser: true,
      }).chat.completions
        .create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: "This is a test" }],
          max_tokens: 1,
        })
        .then(() => {
          setApiKey(key);
          navigate({ to: "/chat/" });
        })
        .catch((e) => {
          console.log(Object.entries(e));

          handleAPIError(e);
          setError(true);
        })
        .finally(() => setLoading(false));
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setKey(value);
    setError(!value.length);
  };

  return (
    <div className="flex h-dvh-fallback w-full justify-center md:items-center">
      <form
        className="flex w-11/12 translate-y-1/3 flex-col gap-2 sm:w-[45%] sm:min-w-[500px] md:translate-y-0"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-0">
          <div className="flex flex-col gap-2 md:flex-row">
            <Input
              value={key}
              placeholder={t("index.placeholder")}
              onChange={handleInput}
              className={cn("p-6 placeholder:text-sm  xs:placeholder:text-lg", {
                "border-red-500 focus-visible:ring-0": error,
              })}
            />
            <LoadingButton
              loading={loading}
              className="p-6"
              variant={"outline"}
            >
              {t("index.next")}
            </LoadingButton>
          </div>
        </div>
      </form>
    </div>
  );
}
