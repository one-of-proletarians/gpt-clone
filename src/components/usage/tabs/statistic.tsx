import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { useHistoryChat } from "@/store/history-store";
import { useTokenUsage } from "@/store/token-usage-store";
import { TabsContentProps } from "@radix-ui/react-tabs";
import { Link } from "@tanstack/react-router";
import { Column, ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, SquareArrowOutUpRight } from "lucide-react";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useBadgeDialogState } from "../state";
import { DataTable } from "../table";
import { useWhisperUsage } from "@/store/whisper-usage-store";
import { TotalTable } from "../total-table";
import { cn } from "@/lib/utils";

interface TableItem {
  name: string;
  uid: string;
  title: number;
  prompt: number;
  response: number;
  total: number;
  whisper: number;
  tts: number;
  ttsHD: number;
}

function filteredHeader<T>(title: string, column: Column<T>) {
  return (
    <div
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="flex cursor-pointer select-none items-center justify-end whitespace-nowrap transition-colors hover:text-white"
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </div>
  );
}

const cell = (row: Row<TableItem>, value: keyof TableItem) => (
  <div className="flex justify-end">{row.getValue(value)}</div>
);

export const StatisticTab = memo<TabsContentProps>((props) => {
  const { open, setOpen } = useBadgeDialogState();
  const { t } = useTranslation();

  const data = useMemo(
    () => {
      const chats = useHistoryChat.getState().chats;
      const entries = Object.entries(useTokenUsage.getState().items);
      const a = useWhisperUsage.getState().extractDataWithChatId();

      return entries
        .map(([uid, { usage, titleUsage, tts = 0, ttsHD = 0 }]) => {
          const whisper = a[uid]?.duration ?? 0;

          return {
            uid,
            name: chats[uid]?.title ?? "(removed)",
            title: titleUsage?.total_tokens ?? 0,
            prompt: usage?.prompt_tokens ?? 0,
            response: usage?.completion_tokens ?? 0,
            total: (usage?.total_tokens ?? 0) + (titleUsage?.total_tokens ?? 0),
            whisper,
            tts,
            ttsHD,
          };
        })
        .reverse();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open],
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const columns: ColumnDef<TableItem>[] = useMemo(
    () => {
      const columnsDefinition: ColumnDef<TableItem>[] = [
        {
          accessorKey: "name",
          header: t("usage.table.name"),
          cell: ({ row }) => {
            const name = row.getValue<string>("name");
            return (
              <div
                className={cn(
                  "max-w-52 overflow-hidden text-ellipsis whitespace-nowrap",
                  {
                    "text-red-500": name === "(removed)",
                  },
                )}
              >
                {name}
              </div>
            );
          },
        },
        {
          accessorKey: "uid",
          header: "",
          cell: ({ row }) => {
            const name = row.getValue<string>("name");

            return (
              <Button
                // asChild
                size={"xs"}
                variant={"ghost"}
                onClick={() => setOpen(false)}
                disabled={name === "(removed)"}
              >
                <Link
                  to="/chat/$chatId"
                  params={{ chatId: row.getValue<string>("uid") }}
                >
                  <SquareArrowOutUpRight className="h-4 w-4" />
                </Link>
              </Button>
            );
          },
        },
        {
          accessorKey: "title",
          header: ({ column }) =>
            filteredHeader(t("usage.table.title"), column),
          cell: ({ row }) => cell(row, "title"),
        },
        {
          accessorKey: "prompt",
          header: ({ column }) =>
            filteredHeader(t("usage.table.prompt"), column),
          cell: ({ row }) => cell(row, "prompt"),
        },
        {
          accessorKey: "response",
          header: ({ column }) =>
            filteredHeader(t("usage.table.response"), column),
          cell: ({ row }) => cell(row, "response"),
        },
        {
          accessorKey: "total",
          header: ({ column }) =>
            filteredHeader(t("usage.table.total"), column),
          cell: ({ row }) => cell(row, "total"),
        },
      ];

      const audioColumns: ColumnDef<
        Pick<TableItem, "whisper" | "tts" | "ttsHD">
      >[] = [
        {
          accessorKey: "whisper",
          id: "whisper",
          header: ({ column }) => filteredHeader("whisper", column),
          cell: ({ row }) => (
            <div className="flex justify-end">
              {row.getValue<number>("whisper").toFixed(1)} s
            </div>
          ),
        },
        {
          accessorKey: "tts",
          id: "tts",
          header: ({ column }) => filteredHeader("tts", column),
          cell: ({ row }) => (
            <div className="flex justify-end">
              {row.getValue<number>("tts")} ch
            </div>
          ),
        },
        {
          accessorKey: "ttsHD",
          id: "ttsHD",
          header: ({ column }) => filteredHeader("tts-hd", column),
          cell: ({ row }) => (
            <div className="flex justify-end whitespace-nowrap">
              {row.getValue<number>("ttsHD")} ch
            </div>
          ),
        },
      ];

      return [
        ...columnsDefinition,
        ...audioColumns.filter((col) => {
          if (col.id) {
            const index = col.id as "whisper" | "tts" | "ttsHD";
            return !!data.reduce((acc, item) => acc + item[index], 0);
          }

          return true;
        }),
      ];
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open],
  );

  const total = useMemo(() => {
    const tts = data.reduce((acc, item) => acc + item.tts, 0);
    const ttsHD = data.reduce((acc, item) => acc + item.ttsHD, 0);
    const tokens = data.reduce((acc, item) => acc + item.total, 0);
    const whisper = useWhisperUsage.getState().getTotalDuration();

    return {
      tts,
      "tts-hd": ttsHD,
      tokens,
      whisper,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <TabsContent {...props}>
      <DataTable columns={columns} data={data} />
      <div className="mt-auto"></div>
      <TotalTable data={total} />
    </TabsContent>
  );
});

export default StatisticTab;
