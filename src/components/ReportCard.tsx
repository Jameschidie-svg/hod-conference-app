interface ReportCardProps {
  label: string;
  value: number | string;
  variant: "blue" | "green" | "yellow" | "pink" | "neutral";
  showPercentage?: boolean;
  percentage?: number;
}

const variantClasses = {
  blue: "stat-card-blue text-chart-blue",
  green: "stat-card-green text-chart-green",
  yellow: "stat-card-yellow text-chart-orange",
  pink: "stat-card-pink text-chart-pink",
  neutral: "bg-card text-foreground",
};

export function ReportCard({ label, value, variant, showPercentage, percentage }: ReportCardProps) {
  return (
    <div className={`rounded-xl p-4 ${variantClasses[variant]}`}>
      <p className="text-sm mb-2 opacity-80">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
      {showPercentage && percentage !== undefined && (
        <p className="text-sm mt-1 opacity-80">{percentage}%</p>
      )}
    </div>
  );
}
