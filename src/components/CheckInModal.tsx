import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendeeName: string;
  onConfirm: () => void;
}

const services = [
  { id: "all", label: "Select All Services" },
  { id: "morning", label: "Morning Service" },
  { id: "afternoon", label: "Afternoon Service" },
  { id: "evening", label: "Evening Service" },
];

export function CheckInModal({ isOpen, onClose, attendeeName, onConfirm }: CheckInModalProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedServices(services.map(s => s.id));
    } else {
      setSelectedServices([]);
    }
  };

  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    if (serviceId === "all") {
      handleSelectAll(checked);
      return;
    }

    let newSelection: string[];
    if (checked) {
      newSelection = [...selectedServices.filter(s => s !== "all"), serviceId];
      // If all individual services are selected, add "all"
      const individualServices = services.filter(s => s.id !== "all").map(s => s.id);
      if (individualServices.every(s => newSelection.includes(s))) {
        newSelection = [...newSelection, "all"];
      }
    } else {
      newSelection = selectedServices.filter(s => s !== serviceId && s !== "all");
    }
    setSelectedServices(newSelection);
  };

  const handleConfirm = () => {
    if (selectedServices.filter(s => s !== "all").length === 0) {
      toast({
        title: "No service selected",
        description: "Please select at least one service to check in.",
        variant: "destructive",
      });
      return;
    }
    
    onConfirm();
    toast({
      title: "Check-in successful",
      description: `${attendeeName} has been checked in successfully.`,
    });
    setSelectedServices([]);
    onClose();
  };

  const handleClose = () => {
    setSelectedServices([]);
    onClose();
  };

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
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                index === 0 ? "bg-muted" : ""
              }`}
            >
              <Checkbox
                id={service.id}
                checked={selectedServices.includes(service.id)}
                onCheckedChange={(checked) => handleServiceToggle(service.id, checked as boolean)}
              />
              <label
                htmlFor={service.id}
                className={`cursor-pointer ${
                  index === 0 ? "font-semibold text-foreground" : "text-foreground"
                }`}
              >
                {service.label}
              </label>
            </div>
          ))}
        </div>

        <Button
          onClick={handleConfirm}
          className="w-full h-14 text-base font-semibold rounded-xl"
        >
          Confirm Check-in
        </Button>
      </div>
    </div>
  );
}
