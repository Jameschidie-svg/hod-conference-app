import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ScanLine } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { PageHeader } from "@/components/PageHeader";
import { BottomNav } from "@/components/BottomNav";
import { AttendeeCard } from "@/components/AttendeeCard";
import { toast } from "@/hooks/use-toast";
import { useGetAttendees } from "@/hooks/api/useAttendees";
import { useEventStore } from "@/stores/eventStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function CheckIn() {
  const navigate = useNavigate();
  const { currentEvent } = useEventStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  // Fetch attendees from API
  const { data: attendees = [], isLoading } = useGetAttendees({
    eventId: currentEvent?.id || "",
  });

  // Filter attendees by search query
  const filteredAttendees = attendees.filter(
    (attendee) =>
      attendee.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.userType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      } catch (err) {
        // Ignore errors when stopping
      }
    }
  };

  const handleCloseScanner = async () => {
    await stopScanner();
    setIsScannerOpen(false);
  };

  const handleQRScan = () => {
    setIsScannerOpen(true);
  };

  useEffect(() => {
    if (!isScannerOpen) {
      return;
    }

    // Wait for dialog to be fully rendered before starting scanner
    const timer = setTimeout(() => {
      const element = document.getElementById("qr-reader");
      if (!element) {
        toast({
          title: "Scanner Error",
          description: "Scanner container not found. Please try again.",
          variant: "destructive",
        });
        setIsScannerOpen(false);
        return;
      }

      const startScanner = async () => {
        try {
          // Check if scanner already exists
          if (scannerRef.current) {
            await stopScanner();
          }

          const html5QrCode = new Html5Qrcode("qr-reader");
          scannerRef.current = html5QrCode;

          await html5QrCode.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0,
            },
            async (decodedText) => {
              // QR code scanned successfully
              handleCloseScanner();

              // Try to parse the QR code - could be attendee ID directly or JSON
              let attendeeId: string | null = null;

              try {
                // Try parsing as JSON first
                const parsed = JSON.parse(decodedText);
                attendeeId = parsed.attendeeId || parsed.id || decodedText;
              } catch {
                // If not JSON, assume it's the attendee ID directly
                attendeeId = decodedText;
              }

              // Find attendee by ID from current attendees list
              const attendee = attendees.find((a) => a.id === attendeeId || a.userId === attendeeId);

              if (attendee) {
                navigate(`/checkin/${attendee.id}`);
              } else {
                // If not found in current list, try navigating directly with the ID
                // The AttendeeDetail page will handle fetching if it exists
                toast({
                  title: "Navigating to attendee...",
                  description: "Loading attendee details.",
                });
                navigate(`/checkin/${attendeeId}`);
              }
            },
            (errorMessage) => {
              // Ignore errors - they're expected during scanning
              // Only log if it's not a "NotFoundException" (which is normal)
              if (!errorMessage.includes("NotFoundException")) {
                console.debug("QR scan error:", errorMessage);
              }
            }
          );
        } catch (err: any) {
          console.error("Scanner error:", err);
          let errorMessage = "Failed to start camera. Please check permissions.";

          if (err?.message) {
            if (err.message.includes("Permission denied") || err.message.includes("NotAllowedError")) {
              errorMessage = "Camera permission denied. Please allow camera access in your browser settings.";
            } else if (err.message.includes("NotFoundError") || err.message.includes("No camera")) {
              errorMessage = "No camera found. Please connect a camera device.";
            } else {
              errorMessage = err.message;
            }
          }

          toast({
            title: "Camera Error",
            description: errorMessage,
            variant: "destructive",
          });
          setIsScannerOpen(false);
        }
      };

      startScanner();
    }, 300); // Small delay to ensure dialog is fully rendered

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        stopScanner();
      }
    };
  }, [isScannerOpen, attendees, navigate]);

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
        {!currentEvent ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No event selected</p>
          </div>
        ) : (
          <>
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

            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading attendees...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAttendees.map((attendee) => (
                  <AttendeeCard
                    key={attendee.id}
                    id={attendee.id}
                    name={attendee.user?.name || "Unknown"}
                    role={attendee.userType || "Attendee"}
                    status={attendee.status}
                  />
                ))}

                {filteredAttendees.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      {searchQuery ? "No attendees found matching your search" : "No attendees found"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />

      <Dialog open={isScannerOpen} onOpenChange={handleCloseScanner}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
            <DialogDescription>
              Position the QR code within the frame to scan
            </DialogDescription>
          </DialogHeader>
          <div className="w-full">
            <div
              id="qr-reader"
              ref={scannerContainerRef}
              className="w-full rounded-lg overflow-hidden min-h-[300px]"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
