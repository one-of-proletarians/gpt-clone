import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { TabsContentProps } from "@radix-ui/react-tabs";
import { ColumnDef } from "@tanstack/react-table";
import { X } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useBadgeDialogState } from "../../state";
import { DataTable } from "../../table";
import { pricing } from "./pricing";
import { useMobile } from "@/hooks/useMobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Pricing {
  model: string;
  input: string;
  output: string;
}

export const PricingTabs = memo<TabsContentProps>((props) => {
  const open = useBadgeDialogState((s) => s.open);
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  const isMobile = useMobile();

  const columns: ColumnDef<Pricing>[] = useMemo(
    () => [
      {
        accessorKey: "model",
        header: t("usage.price.table.model"),
        cell: ({ row }) => {
          const value = row.getValue<string>("model");

          return !search.length ? (
            <span className="whitespace-nowrap">{value}</span>
          ) : (
            <span
              className="whitespace-nowrap"
              dangerouslySetInnerHTML={{
                __html: value.replace(
                  search,
                  (match) => `<mark class="rounded">${match}</mark>`,
                ),
              }}
            />
          );
          //
        },
      },
      { accessorKey: "input", header: t("usage.price.table.input") },
      { accessorKey: "output", header: t("usage.price.table.output") },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open, search],
  );

  const data = useMemo(() => {
    const entries = Object.entries(pricing);

    return entries
      .map(([model, { input, output }]) => {
        switch (model) {
          case "whisper":
            return {
              model,
              input: `${input}$ / minute`,
              output: "",
            };

          case "tts":
          case "tts-hd":
            return {
              model,
              output: `${output.toFixed(2)}$ / 1M characters`,
              input: "",
            };
        }

        return {
          model,
          input: `${input?.toFixed(2)}$${!isMobile ? " / 1M tokens" : ""}`,
          output: `${output?.toFixed(2)}$${!isMobile ? " / 1M tokens" : ""}`,
        };
      })
      .filter((d) => d.model.toLowerCase().includes(search.toLowerCase()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, search, isMobile]);
  return (
    <TabsContent {...props} className="m-0 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-1">
        <div className="relative flex w-full pt-0.5 sm:w-auto">
          <Input
            placeholder="Search"
            className="w-full pr-9 sm:w-80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() => setSearch("")}
            className="absolute right-0 text-muted-foreground transition-colors hover:text-inherit"
          >
            <X />
          </Button>
        </div>
      </div>

      <ScrollArea className="mt-3 h-screen w-full">
        <DataTable columns={columns} data={data} isPagination={false} />
      </ScrollArea>
    </TabsContent>
  );
});

export default PricingTabs;
