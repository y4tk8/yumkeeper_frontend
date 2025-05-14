"use client"

import { useTheme } from "next-themes"
import { CheckCircle, XCircle } from "lucide-react"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

// NOTE: カスタム済み
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: "group flex items-start gap-4 p-4 border rounded-2xl shadow-lg max-w-3xl w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white",
          description: "text-sm text-zinc-700 dark:text-zinc-300",
          actionButton: "bg-primary text-white rounded-md px-3 py-1",
          cancelButton: "bg-muted text-muted-foreground rounded-md px-3 py-1",
        },
      }}
      {...props}
    />
  )
}

// `成功` のトースト表示関数
export const showSuccessToast = (message: string) => {
  toast.success(message, {
    icon: <CheckCircle className="text-emerald-500 w-5 h-5" />,
  });
};

// `失敗` のトースト表示関数
export const showErrorToast = (message: string) => {
  toast.error(message, {
    icon: <XCircle className="text-red-500 w-5 h-5" />,
  });
};

export { Toaster }
