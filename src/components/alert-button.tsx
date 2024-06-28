import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, ButtonProps } from "@/components/ui/button";
import { FC, PropsWithChildren } from "react";

interface AlertProps extends PropsWithChildren {
  description?: string;
  title: string;
  cancelText?: string;
  okText?: string;
  onOk?: () => void;
  onCancel?: () => void;
  variant?: ButtonProps["variant"];
}

export const AlertButton: FC<AlertProps> = (props) => {
  const {
    title,
    description,
    cancelText = "Cancel",
    okText = "OK",
    children,
    variant,
  } = props;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={variant}>{children}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>

          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={props.onCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={props.onOk}>{okText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
