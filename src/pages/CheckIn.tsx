import { useState, useEffect, useRef } from "react";
import { Search, ScanLine } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { PageHeader } from "@/components/PageHeader";
import { BottomNav } from "@/components/BottomNav";
import { AttendeeCard } from "@/components/AttendeeCard";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import attendeesData from "@/data/attendees.json";

export default function CheckIn() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  
  const filteredAttendees = attendeesData.filter(
    (attendee) =>
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isScannerOpen && scannerContainerRef.current) {
      const startScanner = async () => {
        try {
          const html5QrCode = new Html5Qrcode("qr-reader");
          scannerRef.current = html5QrCode;

          await html5QrCode.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText) => {
              // QR code scanned successfully
              toast({
                title: "QR Code Scanned",
                description: `Scanned: ${decodedText}`,
              });
              stopScanner();
              setIsScannerOpen(false);
            },
            (errorMessage) => {
              // Ignore errors - they're expected during scanning
            }
          );
        } catch (err) {
          toast({
            title: "Camera Error",
            description: "Failed to start camera. Please check permissions.",
            variant: "destructive",
          });
          setIsScannerOpen(false);
        }
      };

      startScanner();
    }

    return () => {
      if (scannerRef.current) {
        stopScanner();
      }
    };
  }, [isScannerOpen]);

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

  const handleQRScan = () => {
    setIsScannerOpen(true);
  };

  const handleCloseScanner = async () => {
    await stopScanner();
    setIsScannerOpen(false);
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
