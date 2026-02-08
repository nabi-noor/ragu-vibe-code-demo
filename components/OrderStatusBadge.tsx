import {
  Clock,
  CookingPot,
  PackageCheck,
  CheckCircle2,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

interface StatusConfig {
  label: string;
  bg: string;
  text: string;
  icon: LucideIcon;
}

const statusConfig: Record<OrderStatus, StatusConfig> = {
  Pending: {
    label: "Pending",
    bg: "bg-amber-100",
    text: "text-amber-800",
    icon: Clock,
  },
  Preparing: {
    label: "Preparing",
    bg: "bg-blue-100",
    text: "text-blue-800",
    icon: CookingPot,
  },
  Ready: {
    label: "Ready",
    bg: "bg-green-100",
    text: "text-green-800",
    icon: PackageCheck,
  },
  Completed: {
    label: "Completed",
    bg: "bg-warm-200",
    text: "text-warm-700",
    icon: CheckCircle2,
  },
  Cancelled: {
    label: "Cancelled",
    bg: "bg-red-100",
    text: "text-red-800",
    icon: XCircle,
  },
};

const sizeClasses = {
  sm: { pill: "px-2 py-0.5 text-xs gap-1", icon: "h-3 w-3" },
  md: { pill: "px-2.5 py-1 text-sm gap-1.5", icon: "h-3.5 w-3.5" },
  lg: { pill: "px-3 py-1.5 text-sm gap-1.5", icon: "h-4 w-4" },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export default function OrderStatusBadge({
  status,
  size = "md",
  showIcon = true,
  className,
}: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  if (!config) return null;

  const sz = sizeClasses[size];
  const Icon = config.icon;

  return (
    <span
      role="status"
      aria-label={`Order status: ${config.label}`}
      className={cn(
        "inline-flex items-center rounded-full font-semibold",
        config.bg,
        config.text,
        sz.pill,
        className
      )}
    >
      {showIcon && <Icon className={sz.icon} />}
      {config.label}
    </span>
  );
}
