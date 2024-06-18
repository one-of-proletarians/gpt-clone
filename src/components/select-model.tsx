import { memo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModel } from "@/store/models-store";

interface SelectModelProps {
  tabIndex?: number;
  disabled?: boolean;
  value?: string;
}

export const SelectModel = memo<SelectModelProps>(
  ({ disabled, value, tabIndex }) => {
    const { models, setModel } = useModel();
    return (
      <Select
        disabled={disabled || !models.length}
        value={value}
        onValueChange={(model) => setModel(model)}
      >
        <SelectTrigger
          className="w-[250px] overflow-hidden text-ellipsis whitespace-nowrap"
          tabIndex={tabIndex}
        >
          <SelectValue placeholder="Model" />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model} value={model} className="hovering">
              {model}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  },
);
