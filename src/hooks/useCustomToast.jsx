import {
  CancellationIcon,
  CircleCheckIcon,
  IssueIcon,
} from "@/components/icons";
import { Toast as ToastPrimitive } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

const ToastMessage = ({ title, message, variant = "default" }) => {
  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CircleCheckIcon size={"2.4rem"} className="text-green-500" />;
      case "error":
        return <CancellationIcon size={"2.4rem"} className="text-red-500" />;
      case "warning":
        return <IssueIcon size={"2.4rem"} className="text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-2 p-0">
      {getIcon()}
      <div>
        {title && <p className="font-semibold text-base">{title}</p>}
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
};

export const useCustomToast = () => {
  const { toast } = useToast();

  const showToast = ({
    title,
    message,
    variant = "default",
    duration = 5000,
  }) => {
    toast({
      title: <ToastMessage title={title} message={message} variant={variant} />,
      variant: variant,
      duration,
    });
  };

  return {
    showToast,
    toastSuccess: ({ title, message, duration }) =>
      showToast({ title, message, variant: "success", duration }),
    toastError: ({ title, message, duration }) =>
      showToast({ title, message, variant: "error", duration }),
    toastWarning: ({ title, message, duration }) =>
      showToast({ title, message, variant: "warning", duration }),
  };
};
