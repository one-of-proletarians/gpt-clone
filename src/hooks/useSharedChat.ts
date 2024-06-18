import { HistoryItem } from "@/store/history-store";
import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const useSharedChat = () => {
  const [chat, setChat] = useState<HistoryItem | null>(null);
  const [isError, setIsError] = useState(false);

  const id = useParams({
    from: "/share/$id",
    select: (params: { id: string }) => params.id,
  });

  useEffect(() => {
    fetch("/api/share?id=" + id)
      .then((r) => r.json())
      .then(setChat)
      .catch(() => setIsError(true));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { chat, isError };
};
