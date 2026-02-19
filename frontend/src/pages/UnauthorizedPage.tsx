import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center p-10 rounded-2xl shadow-xl border bg-card max-w-md w-full">

        {/* 403 Code */}
        <h1 className="text-6xl font-bold text-red-500 mb-4">
          403
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-3">
          Access Denied
        </h2>

        {/* Message */}
        <p className="text-muted-foreground mb-6">
          You do not have permission to view this page.
          Please contact the administrator if you believe this is a mistake.
        </p>

        {/* Button */}
        <Button
          className="w-full"
          onClick={() => navigate("/")}
        >
          Go Back to Home
        </Button>

      </div>
    </div>
  );
}

export default UnauthorizedPage;