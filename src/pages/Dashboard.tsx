import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, User, CalendarDays } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { useGetEvents } from "@/hooks/api/useEvents";
import { useGetAttendeesCount } from "@/hooks/api/useAttendees";
import { useGetCheckInsCount } from "@/hooks/api/useCheckIns";
import { useEventStore } from "@/stores/eventStore";
import { toast } from "@/hooks/use-toast";

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentEvent, setCurrentEvent } = useEventStore();
  const { data: events, isLoading: eventsLoading } = useGetEvents();

  // Get attendees count
  const { data: registeredCount } = useGetAttendeesCount(currentEvent?.id || null);
  const { data: checkedInCount } = useGetAttendeesCount(currentEvent?.id || null, {
    status: "CHECKED_IN",
  });
  const { data: workersCount } = useGetAttendeesCount(currentEvent?.id || null, {
    userType: "Worker",
  });
  const { data: checkInsCountData } = useGetCheckInsCount();

  // Auto-select first event if none selected
  useEffect(() => {
    if (!currentEvent && events && events.length > 0) {
      setCurrentEvent(events[0]);
    } else if (!currentEvent && events && events.length === 0) {
      toast({
        title: "No events found",
        description: "Please create an event first.",
        variant: "destructive",
      });
    }
  }, [events, currentEvent, setCurrentEvent]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (eventsLoading) {
    return (
      <div className="min-h-screen bg-background pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div className="min-h-screen bg-background pb-24 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-muted-foreground mb-4">No event selected</p>
          <Button onClick={() => navigate("/dashboard")}>Refresh</Button>
        </div>
      </div>
    );
  }

  const stats = {
    registeredAttendees: registeredCount?.count || 0,
    currentAttendees: checkedInCount?.count || 0,
    workersPresent: workersCount?.count || 0,
    firstTimersPresent: 0, // This would need to be calculated from user history
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-6 max-w-lg mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Conference check-in</h1>
          <p className="text-muted-foreground">{today}</p>
          {currentEvent && (
            <p className="text-sm text-muted-foreground mt-1">{currentEvent.name}</p>
          )}
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
