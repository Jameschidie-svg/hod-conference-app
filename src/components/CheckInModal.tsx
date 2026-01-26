import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useCreateCheckIn } from "@/hooks/api/useCheckIns";

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendeeId: string;
  attendeeName: string;
  dayId: string;
  services: string[];
}

export function CheckInModal({
  isOpen,
  onClose,
  attendeeId,
  attendeeName,
  dayId,
  services,
}: CheckInModalProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const createCheckInMutation = useCreateCheckIn();

  // Reset selection when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedServices([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleServiceToggle = (service: string, checked: boolean) => {
    if (checked) {
      setSelectedServices((prev) => [...prev, service]);
    } else {
      setSelectedServices((prev) => prev.filter((s) => s !== service));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedServices([...services]);
    } else {
      setSelectedServices([]);
    }
  };

  const handleConfirm = () => {
    if (selectedServices.length === 0) {
      toast({
        title: "No service selected",
        description: "Please select at least one service to check in.",
        variant: "destructive",
      });
      return;
    }

    createCheckInMutation.mutate(
      {
        attendeeId,
        dayId,
        servicesAttended: selectedServices,
      },
      {
        onSuccess: () => {
          setSelectedServices([]);
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    setSelectedServices([]);
    onClose();
  };

  const allSelected = services.length > 0 && selectedServices.length === services.length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 animate-fade-in">
      <div className="bg-card rounded-t-2xl w-full max-w-lg p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Complete Check-in</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {services.length > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <Checkbox
                id="select-all"
                checked={allSelected}
                onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
              />
              <label htmlFor="select-all" className="cursor-pointer font-semibold text-foreground">
                Select All Services
              </label>
            </div>
          )}
          {services.length > 0 ? (
            services.map((service) => (
              <div key={service} className="flex items-center gap-3 p-3 rounded-lg">
                <Checkbox
                  id={service}
                  checked={selectedServices.includes(service)}
                  onCheckedChange={(checked) => handleServiceToggle(service, checked as boolean)}
                />
                <label htmlFor={service} className="cursor-pointer text-foreground">
                  {service}
                </label>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No services available for this day
            </p>
          )}
        </div>

        <Button
          onClick={handleConfirm}
          className="w-full h-14 text-base font-semibold rounded-xl"
          disabled={createCheckInMutation.isPending || selectedServices.length === 0}
        >
          {createCheckInMutation.isPending ? "Checking in..." : "Confirm Check-in"}
        </Button>
      </div>
    </div>
  );
}
