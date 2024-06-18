import { memo, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { pricing } from "./tabs/price/pricing";
import { useTokenUsage } from "@/store/token-usage-store";
import { useTranslation } from "react-i18next";
import { calculateUsageCost, formatTime } from "@/lib/utils";

interface Item {
  tts: number;
  "tts-hd": number;
  tokens: number;
  whisper: number;
}

interface TotalTableProps {
  data: Item;
}

const whisperPrice = pricing.whisper.input / 60;
const ttsPrice = pricing.tts.output / 1_000_000;
const ttsHdPrice = pricing["tts-hd"].output / 1_000_000;

export const TotalTable = memo<TotalTableProps>(({ data }) => {
  const tokens = useTokenUsage((s) => s.items);
  const tokensCost = useMemo(
    () =>
      Object.values(tokens).reduce(
        (acc, { usage, titleUsage, model }) =>
          acc + calculateUsageCost(usage, titleUsage, model),
        0,
      ),
    [tokens],
  );

  const whisperCost = data.whisper * whisperPrice;
  const ttsCost = data.tts * ttsPrice;
  const ttsHdCost = data["tts-hd"] * ttsHdPrice;

  const { t } = useTranslation();

  return (
    <Table className="mt-auto sm:max-w-72">
      <TableHeader className="border-y">
        <TableRow>
          <TableHead colSpan={3} className="w-full text-center">
            {t("usage.costOfUse")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Tokens</TableCell>
          <TableCell className="text-right">{data.tokens} t</TableCell>
          <TableCell className="text-right">
            {tokensCost.toFixed(3)} $
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Whisper</TableCell>
          <TableCell className="text-right">
            {formatTime(Math.round(data.whisper))}
          </TableCell>
          <TableCell className="text-right">
            {whisperCost.toFixed(3)} $
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>TTS</TableCell>
          <TableCell className="text-right">{data.tts} c</TableCell>
          <TableCell className="text-right">{ttsCost.toFixed(3)} $</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>TTS HD</TableCell>
          <TableCell className="text-right">{data["tts-hd"]} c</TableCell>
          <TableCell className="text-right">{ttsHdCost.toFixed(3)} $</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
});
