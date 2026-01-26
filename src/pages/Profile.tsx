import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useGetProfile } from "@/hooks/api/useAuth";
import { useGetUserHistory } from "@/hooks/api/useUsers";
import { useAuthStore } from "@/stores/authStore";
import { format } from "date-fns";

export default function Profile() {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuthStore();
  const { data: profile, isLoading } = useGetProfile();
  const { data: history } = useGetUserHistory(profile?.id || null, 5);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been signed out successfully.",
    });
    navigate("/login", { replace: true });
  };

  const displayUser = profile || authUser;
  const userName = displayUser?.name || "Unknown";
  const userEmail = displayUser?.email || "";
  const userPicture = displayUser?.picture || null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Profile" />

      <div className="px-4 py-8 max-w-lg mx-auto flex flex-col min-h-[calc(100vh-180px)]">
        {/* User Info */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-4 overflow-hidden">
            {userPicture ? (
              <img
                src={userPicture}
                alt={userName}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-primary-foreground" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-foreground">{userName}</h2>
          <p className="text-muted-foreground">{userEmail}</p>
          {profile?.phone && (
            <p className="text-sm text-muted-foreground mt-1">{profile.phone}</p>
          )}
        </div>

        {/* Attendance History */}
        {history && history.visits.length > 0 && (
          <div className="bg-card rounded-xl p-5 mb-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Recent Attendance History
            </h3>
            <div className="space-y-3">
              {history.visits.slice(0, 5).map((visit) => (
                <div key={visit.date} className="border-l-2 border-primary pl-4 py-1">
                  <p className="font-semibold text-foreground">{visit.event}</p>
                  <p className="text-sm text-muted-foreground">
                    Day {visit.dayNumber} - {format(new Date(visit.date), "MMM d, yyyy")}
                  </p>
                  {visit.servicesAttended.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {visit.servicesAttended.map((service, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-md text-xs bg-muted text-foreground"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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
