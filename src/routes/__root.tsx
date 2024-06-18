import { Player } from "@/components/player";
import { ShareDialog } from "@/components/share-dialog";
import { Title } from "@/components/title";
import { errorStyle, successStyle, Toaster } from "@/components/ui/sonner";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import {
  createRootRoute,
  Link,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const Route = createRootRoute({
  component: Component,
  notFoundComponent: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { t } = useTranslation();
    return (
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1 className="mb-3 text-3xl">404 | Page not found</h1>
        <Link className="hover:underline" to="/chat/">
          {t("common.chat")}
        </Link>
      </div>
    );
  },
});

function Component() {
  const { t } = useTranslation();
  useNetworkStatus({
    offline: () => toast.warning(t("errors.networkError"), errorStyle),
    online: () => toast.warning(t("common.online"), successStyle),
  });

  return (
    <>
      <Title>{t("common.title")}</Title>
      <Outlet />
      <Toaster />
      <Player />
      <ShareDialog />

      <ScrollRestoration getKey={(location) => location.pathname} />
    </>
  );
}
