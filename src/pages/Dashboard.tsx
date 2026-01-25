import { useNavigate } from "react-router-dom";
import { Users, User, CalendarDays } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import reportData from "@/data/reports.json";

export default function Dashboard() {
  const navigate = useNavigate();
  const stats = reportData.dashboardStats;
  
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-6 max-w-lg mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Conference check-in</h1>
          <p className="text-muted-foreground">{today}</p>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatCard
            icon={Users}
            value={stats.registeredAttendees}
            label="Registered attendees"
            variant="blue"
          />
          <StatCard
            icon={User}
            value={stats.currentAttendees}
            label="Current Attendees"
            variant="green"
          />
          <StatCard
            icon={Users}
            value={stats.workersPresent}
            label="Workers present"
            variant="yellow"
          />
          <StatCard
            icon={CalendarDays}
            value={stats.firstTimersPresent}
            label="First timers present"
            variant="pink"
          />
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => navigate("/checkin")}
            className="w-full h-16 text-lg font-semibold rounded-2xl"
          >
            Check-In
          </Button>
          <Button
            onClick={() => navigate("/report")}
            variant="outline"
            className="w-full h-16 text-lg font-semibold rounded-2xl border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            View All Report
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
