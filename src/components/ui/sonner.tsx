import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />, // Already set, but you can customize color if needed
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      className="items-end"
      position="bottom-right"
      toastOptions={{
        unstyled: true,
        classNames: {
          title: "text-sm",
          toast:
            "text-sm toast-item flex items-center gap-2 py-3 px-4 backdrop-blur-sm text-dark shadow-lg rounded-lg overflow-hidden",
          description: "text-xs",
          actionButton: "",
          cancelButton: "",
          error: "bg-danger/90 backdrop-blur-sm",
          success: "bg-success/90 backdrop-blur-sm",
          warning: "bg-red-500 ring-2 ring-red-400 backdrop-blur-sm text-white",
          info: "bg-info/90 backdrop-blur-sm",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
