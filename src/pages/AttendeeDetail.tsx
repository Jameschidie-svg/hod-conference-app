import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { CheckInModal } from "@/components/CheckInModal";
import { toast } from "@/hooks/use-toast";
import attendeesData from "@/data/attendees.json";

export default function AttendeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const attendee = attendeesData.find((a) => a.id === id);

  if (!attendee) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Attendee not found</p>
      </div>
    );
  }

  const handleCheckIn = () => {
    setIsCheckedIn(true);
  };

  const checkedInStatus = attendee.checkedIn || isCheckedIn;

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Attendee Details" showBack />

      <div className="px-4 py-6 max-w-lg mx-auto">
        {/* Avatar and Name */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center mb-4">
            <User className="w-16 h-16 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{attendee.name}</h2>
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
              <span className="text-foreground font-medium">{attendee.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Membership Status</span>
              <span className="text-foreground font-medium">{attendee.membershipStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mode of Attendance</span>
              <span className="text-foreground font-medium">{attendee.modeOfAttendance}</span>
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <div className="bg-card rounded-xl p-5 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Attendance History (Last 5 Visits)
          </h3>
          {attendee.attendanceHistory.length > 0 ? (
            <div className="space-y-4">
              {attendee.attendanceHistory.slice(0, 5).map((visit, index) => (
                <div key={index} className="border-l-2 border-primary pl-4 py-1">
                  <p className="font-semibold text-foreground">{visit.date}</p>
                  <p className="text-sm text-muted-foreground">Service Attended</p>
                  <p className="text-foreground">{visit.service}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No attendance history</p>
          )}
        </div>

        {/* Check In Button */}
        <Button
          onClick={() => {
            if (checkedInStatus) {
              toast({
                title: "Already checked in",
                description: `${attendee.name} is already checked in.`,
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
      </div>

      <CheckInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        attendeeName={attendee.name}
        onConfirm={handleCheckIn}
      />
    </div>
  );
}
