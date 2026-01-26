import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AttendeeCardProps {
  id: string;
  name: string;
  role: string;
  status?: "PENDING" | "CHECKED_IN";
}

export function AttendeeCard({ id, name, role, status }: AttendeeCardProps) {
  const navigate = useNavigate();
  const initial = name.charAt(0).toUpperCase();
  const isCheckedIn = status === "CHECKED_IN";

  return (
    <button
      onClick={() => navigate(`/checkin/${id}`)}
      className="w-full bg-card rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
        <span className="text-lg font-semibold text-primary-foreground">{initial}</span>
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-foreground">{name}</p>
          {isCheckedIn && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-success-bg text-success">
              Checked In
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </button>
  );
}
