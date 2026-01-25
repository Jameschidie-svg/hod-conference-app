import { useState } from "react";
import { Search, ScanLine } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { BottomNav } from "@/components/BottomNav";
import { AttendeeCard } from "@/components/AttendeeCard";
import { toast } from "@/hooks/use-toast";
import attendeesData from "@/data/attendees.json";

export default function CheckIn() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredAttendees = attendeesData.filter(
    (attendee) =>
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQRScan = () => {
    toast({
      title: "QR Scanner",
      description: "QR code scanner would open here.",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title="All Attendees"
        rightElement={
          <button
            onClick={handleQRScan}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ScanLine className="w-5 h-5 text-foreground" />
          </button>
        }
      />

      <div className="px-4 py-4 max-w-lg mx-auto">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search attendees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-3">
          {filteredAttendees.map((attendee) => (
            <AttendeeCard
              key={attendee.id}
              id={attendee.id}
              name={attendee.name}
              role={attendee.role}
            />
          ))}
          
          {filteredAttendees.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No attendees found</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
