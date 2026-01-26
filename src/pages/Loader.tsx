import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import logo from "@/assets/logo.jpg";

export default function Loader() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1500);

    const navigateTimer = setTimeout(() => {
      navigate(isAuthenticated ? "/dashboard" : "/login");
    }, 1800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navigateTimer);
    };
  }, [navigate, isAuthenticated]);

  return (
    <div
      className={`fixed inset-0 bg-card flex flex-col items-center justify-center transition-opacity duration-300 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex-1 flex items-center justify-center">
        <img
          src={logo}
          alt="HOD Logo"
          className="w-32 h-32 object-contain animate-fade-in"
        />
      </div>
      <div className="pb-16">
        <p className="text-muted-foreground text-lg font-medium animate-fade-in">
          Built for Worship
        </p>
      </div>
    </div>
  );
}
