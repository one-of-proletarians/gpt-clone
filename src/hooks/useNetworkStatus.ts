import { useEffect, useState } from "react";

type NetworkStatusArgs = {
  online?: () => void;
  offline?: () => void;
};

export const useNetworkStatus = (handles?: NetworkStatusArgs) => {
  const [status, setStatus] = useState<"online" | "offline">(
    navigator.onLine ? "online" : "offline",
  );

  useEffect(() => {
    const handleOnline = () => {
      handles?.online?.();
      setStatus("online");
    };
    const handleOffline = () => {
      handles?.offline?.();
      setStatus("offline");
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [handles]);

  return status;
};
