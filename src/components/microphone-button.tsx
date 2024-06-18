import { LoaderCircle, Mic } from "lucide-react";
import { FC } from "react";
import { Button } from "./ui/button";

interface MicrophoneButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  disabled?: boolean;
}
export const MicrophoneButton: FC<MicrophoneButtonProps> = ({
  isLoading,
  ...rest
}) => {
  return (
    <>
      <Button
        type="button"
        size={"icon"}
        className="absolute bottom-[16px] right-3 rounded-full"
        {...rest}
      >
        {isLoading ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>
    </>
  );
};
