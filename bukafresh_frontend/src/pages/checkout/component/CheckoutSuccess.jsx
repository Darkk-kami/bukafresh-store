import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Home, Mail } from "lucide-react";
import { Button } from "@/shared/ui/buttons";

export const CheckoutSuccess = ({ userEmail, successMessage }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to homepage after 15 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 15000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-card flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-display font-bold text-foreground mb-4">
          Welcome to BukaFresh!
        </h1>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 justify-center mb-2">
            <Mail className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">Success!</span>
          </div>
          <p className="text-green-700 text-sm">
            {successMessage ||
              "Your account has been created! Please check your email to get started."}
          </p>
        </div>

        <p className="text-muted-foreground mb-6">
          We've sent an email to{" "}
          <strong className="text-foreground">{userEmail}</strong>. Click the
          link in that email to activate your account and start ordering fresh
          groceries!
        </p>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-2">
            What happens next?
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1 text-left">
            <li>• Check your email inbox (and spam folder just in case)</li>
            <li>• Click the "Activate Account" link in the email</li>
            <li>• Sign in and place your first grocery order</li>
            <li>• Enjoy fresh groceries delivered to your door!</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={() => navigate("/")}
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Homepage
          </Button>
          <p className="text-xs text-muted-foreground">
            Redirecting automatically in 15 seconds...
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            <strong>Don't see the email?</strong> Check your spam folder, or
            contact us at hello@bukafresh.ng - we're here to help!
          </p>
        </div>
      </div>
    </div>
  );
};
