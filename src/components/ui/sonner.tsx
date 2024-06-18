import { useTheme } from "next-themes";
import { ExternalToast, Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

const errorStyle: ExternalToast = {
  closeButton: true,
  position: "top-right",
  duration: 10000,
  style: { color: "#EF5350" },
};

const successStyle: ExternalToast = {
  closeButton: true,
  position: "top-right",
  duration: 10000,
  style: { color: "#66BB6A" },
};

export { Toaster, errorStyle, successStyle };
