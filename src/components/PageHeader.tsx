import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export function PageHeader({ title, showBack = false, rightElement }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 bg-card border-b border-border px-4 py-3 z-40">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-1 -ml-1 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
        {rightElement && <div>{rightElement}</div>}
      </div>
    </header>
  );
}
