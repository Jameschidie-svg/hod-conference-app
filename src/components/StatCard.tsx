import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  variant: "blue" | "green" | "yellow" | "pink";
}

const variantClasses = {
  blue: {
    bg: "stat-card-blue",
    icon: "stat-icon-blue",
  },
  green: {
    bg: "stat-card-green",
    icon: "stat-icon-green",
  },
  yellow: {
    bg: "stat-card-yellow",
    icon: "stat-icon-yellow",
  },
  pink: {
    bg: "stat-card-pink",
    icon: "stat-icon-pink",
  },
};

export function StatCard({ icon: Icon, value, label, variant }: StatCardProps) {
  const classes = variantClasses[variant];

  return (
    <div className="bg-card rounded-xl p-4 shadow-sm">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${classes.icon}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
