import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { User } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { CheckInModal } from "@/components/CheckInModal";
import { toast } from "@/hooks/use-toast";
import { useGetAttendee } from "@/hooks/api/useAttendees";
import { useGetCheckInsByAttendee } from "@/hooks/api/useCheckIns";
import { useGetDaysByEvent } from "@/hooks/api/useEvents";
import { useEventStore } from "@/stores/eventStore";
import { format } from "date-fns";

export default function AttendeeDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentEvent } = useEventStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: attendee, isLoading } = useGetAttendee(id || null);
  const { data: checkIns = [] } = useGetCheckInsByAttendee(id || null);
  const { data: days = [] } = useGetDaysByEvent(currentEvent?.id || null);

  // Get current day (today's date within event range)
  const currentDay = useMemo(() => {
    if (!currentEvent || days.length === 0) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find day that matches today's date
    return days.find((day) => {
      const dayDate = new Date(day.date);
      dayDate.setHours(0, 0, 0, 0);
      return dayDate.getTime() === today.getTime();
    }) || days[0]; // Fallback to first day if today not found
  }, [days, currentEvent]);

  // Check if already checked in for current day
  const isCheckedInForToday = useMemo(() => {
    if (!currentDay || !id) return false;
    return checkIns.some((checkIn) => checkIn.dayId === currentDay.id);
  }, [checkIns, currentDay, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!attendee) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Attendee not found</p>
      </div>
    );
  }

  const attendeeName = attendee.user?.name || "Unknown";
  const checkedInStatus = attendee.status === "CHECKED_IN" || isCheckedInForToday;

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Attendee Details" showBack />

      <div className="px-4 py-6 max-w-lg mx-auto">
        {/* Avatar and Name */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center mb-4">
            {attendee.user?.picture ? (
              <img
                src={attendee.user.picture}
                alt={attendeeName}
                className="w-28 h-28 rounded-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-muted-foreground" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{attendeeName}</h2>
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              checkedInStatus
                ? "bg-success-bg text-success"
                : "bg-pending-bg text-pending"
            }`}
          >
            {checkedInStatus ? "Checked In" : "Pending Check-In"}
          </span>
        </div>

        {/* Basic Information */}
        <div className="bg-card rounded-xl p-5 mb-4 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Basic Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Full Name</span>
              <span className="text-foreground font-medium">{attendeeName}</span>
            </div>
            {attendee.user?.email && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="text-foreground font-medium">{attendee.user.email}</span>
              </div>
            )}
            {attendee.user?.phone && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="text-foreground font-medium">{attendee.user.phone}</span>
              </div>
            )}
            {attendee.userType && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="text-foreground font-medium">{attendee.userType}</span>
              </div>
            )}
          </div>
        </div>

        {/* Attendance History */}
        <div className="bg-card rounded-xl p-5 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Attendance History (Last 5 Visits)
          </h3>
          {checkIns.length > 0 ? (
            <div className="space-y-4">
              {checkIns.slice(0, 5).map((checkIn) => (
                <div key={checkIn.id} className="border-l-2 border-primary pl-4 py-1">
                  <p className="font-semibold text-foreground">
                    {checkIn.day?.date ? format(new Date(checkIn.day.date), "MMMM d, yyyy") : "Unknown date"}
                  </p>
                  <p className="text-sm text-muted-foreground">Services Attended</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {checkIn.servicesAttended.map((service, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-md text-xs bg-muted text-foreground"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Checked in: {format(new Date(checkIn.checkedInAt), "h:mm a")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No attendance history</p>
          )}
        </div>

        {/* Check In Button */}
        {!currentDay ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No active day found for check-in</p>
          </div>
        ) : (
          <Button
            onClick={() => {
              if (checkedInStatus) {
                toast({
                  title: "Already checked in",
                  description: `${attendeeName} is already checked in for today.`,
                });
              } else {
                setIsModalOpen(true);
              }
            }}
            className="w-full h-14 text-base font-semibold rounded-xl"
            disabled={checkedInStatus}
          >
            {checkedInStatus ? "Already Checked In" : "Check In Attendee"}
          </Button>
        )}
      </div>

      {currentDay && (
        <CheckInModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          attendeeId={id!}
          attendeeName={attendeeName}
          dayId={currentDay.id}
          services={currentDay.services}
        />
      )}
    </div>
  );
}
