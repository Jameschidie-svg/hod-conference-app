import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import userData from "@/data/user.json";

export default function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast({
      title: "Logging out...",
      description: "You are being signed out.",
    });
    
    setTimeout(() => {
      toast({
        title: "Logged out",
        description: "You have been signed out successfully.",
      });
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Profile" />

      <div className="px-4 py-8 max-w-lg mx-auto flex flex-col h-[calc(100vh-180px)]">
        {/* User Info */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">{userData.name}</h2>
          <p className="text-muted-foreground">{userData.email}</p>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full h-14 text-base font-semibold rounded-xl"
        >
          Logout
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
