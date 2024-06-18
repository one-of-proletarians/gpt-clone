import { FC, Suspense, lazy, memo } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useKeyPress } from "@/hooks/useKeyPress";

import { useTranslation } from "react-i18next";
import { useBadgeDialogState } from "./state";
import { Fallback } from "../fallback.tsx";

const StatisticTab = lazy(() => import("./tabs/statistic.tsx"));
const PricingTabs = lazy(() => import("./tabs/price/index.tsx"));

export const UsageDialog: FC = memo(() => {
  const { open, setOpen } = useBadgeDialogState();
  const { t } = useTranslation();

  useKeyPress("KeyP", () => setOpen(true), ["shift", "meta", "prevent"]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="flex h-[calc(100%-50px)] min-w-full flex-col gap-0 p-3 pb-0 outline-none lg:min-w-[calc(90%-50px)]"
        asChild
      >
        <Tabs>
          <DialogHeader className="mb-3 flex flex-row items-center justify-center">
            <TabsList className="mx-auto grid grid-cols-2 md:w-1/3">
              <TabsTrigger value="usage" className="!ring-0" autoFocus>
                {t("usage.shortTitle")}
              </TabsTrigger>
              <TabsTrigger value="price" className="!ring-0">
                {t("usage.price.title")}
              </TabsTrigger>
            </TabsList>

            <DialogClose className="absolute right-5" />
          </DialogHeader>

          <Suspense fallback={<Fallback />}>
            <StatisticTab
              value="usage"
              className="m-0 flex flex-1 flex-col overflow-auto"
              tabIndex={-1}
            />
          </Suspense>

          <Suspense>
            <PricingTabs value="price" tabIndex={-1} />
          </Suspense>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
});
