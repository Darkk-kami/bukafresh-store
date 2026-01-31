import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/shared/ui/buttons";
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from "lucide-react";
import { useAuth } from "@/auth/api/AuthProvider";
import { showSuccessAlert, showErrorAlert, showInfoAlert } from "@/shared/customAlert";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail, resendVerificationEmail } = useAuth();
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");
  const emailFromUrl = searchParams.get("email");

  const [status, setStatus] = useState("loading"); // loading | success | error | expired
  const [errorMessage, setErrorMessage] = useState("");
  const [resendSuccess, setResendSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState(emailFromUrl || "");
  const [isResending, setIsResending] = useState(false);
  const verificationAttempted = useRef(false);

  useEffect(() => {
    // Prevent re-verification if already attempted or no token
    if (verificationAttempted.current || !token) {
      if (!token) {
        setStatus("expired");
        setErrorMessage("Please enter your email to receive a verification link");
      }
      return;
    }

    if (!userId) {
      setStatus("error");
      setErrorMessage("Invalid verification link - missing user ID");
      showErrorAlert("Invalid Link", "This verification link is not valid");
      return;
    }

    const verifyToken = async () => {
      try {
        verificationAttempted.current = true; // Mark as attempted immediately
        showInfoAlert("Verifying", "Checking your email verification...");
        const response = await verifyEmail({ token, userId });
        setStatus("success");
        
        // If verification returns a token, redirect to dashboard after a short delay
        if (response.data?.token) {
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        }
      } catch (error) {
        const errorMsg = error?.message || "We couldn't verify your email";
        
        if (errorMsg.includes("expired")) {
          setStatus("expired");
          setErrorMessage("This verification link has expired. Please request a new one below.");
        } else if (errorMsg.includes("already verified")) {
          setStatus("success");
          showSuccessAlert("Already Verified!", "Your email is already verified. You can start shopping!");
          // Redirect to dashboard for already verified users too
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else if (errorMsg.includes("not valid") || errorMsg.includes("invalid")) {
          setStatus("error");
          setErrorMessage("This verification link is not valid. Please check your email for the correct link or request a new one below.");
        } else if (errorMsg.includes("internet connection")) {
          setStatus("error");
          setErrorMessage("Please check your internet connection and try again.");
        } else {
          setStatus("error");
          setErrorMessage(errorMsg);
        }
      }
    };

    verifyToken();
  }, [token, userId]); 

  const handleResendEmail = async () => {
    if (!userEmail) {
      showErrorAlert("Email Required", "Please enter your email address to resend verification");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      showErrorAlert("Invalid Email", "Please enter a valid email address");
      return;
    }

    try {
      setIsResending(true);
      await resendVerificationEmail(userEmail);
      setResendSuccess(true);
      showSuccessAlert("Email Sent!", "We've sent a new verification email to your inbox. Please check your email (and spam folder) for the verification link.");
    } catch (error) {
      const errorMsg = error?.message || "We couldn't send your verification email. Please try again.";
      setErrorMessage(errorMsg);
      showErrorAlert("Send Failed", errorMsg);
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Verifying your email...
            </h2>
            <p className="text-muted-foreground">
              Please wait while we verify your email address
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Email Verified! 🎉
            </h2>
            <p className="text-muted-foreground mb-6">
              Your email has been successfully verified. You can now access all
              features of your account and start ordering fresh groceries!
            </p>
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => navigate("/dashboard")} 
              className="gap-2"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        );

      case "expired":
        return (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
              <Mail className="h-8 w-8 text-accent" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Link Expired
            </h2>
            <p className="text-muted-foreground mb-6">
              This verification link has expired. Please enter your email below to get a new one.
            </p>

            {resendSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 mb-4">
                <CheckCircle className="h-5 w-5 inline mr-2" />
                A new verification email has been sent. Please check your inbox.
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  variant="hero"
                  onClick={handleResendEmail}
                  disabled={isResending || !userEmail}
                  className="w-full gap-2"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Send New Verification Email
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        );

      case "error":
      default:
        return (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Verification Failed
            </h2>
            <p className="text-muted-foreground mb-6">
              {errorMessage ||
                "We couldn't verify your email. This might happen if the link is invalid, expired, or already used. Please enter your email below to get a new verification link."}
            </p>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email address"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={handleResendEmail}
                  disabled={isResending || !userEmail}
                >
                  {isResending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    "Resend Verification Email"
                  )}
                </Button>

                <Button asChild>
                  <Link to="/">Back to Homepage</Link>
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-card flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-elevated p-8">
        <div className="flex justify-center mb-6">
          <Link
            to="/"
            className="text-2xl font-display font-bold text-foreground"
          >
            Buka<span className="text-primary">Fresh</span>
          </Link>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
