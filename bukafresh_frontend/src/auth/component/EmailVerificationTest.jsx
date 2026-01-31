import { useState } from "react";
import { Button } from "@/shared/ui/buttons";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useAuth } from "@/auth/api/AuthProvider";

export default function EmailVerificationTest() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const { verifyEmail, resendVerificationEmail, loading } = useAuth();

  const handleVerify = async () => {
    try {
      await verifyEmail({ token, userId });
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  const handleResend = async () => {
    try {
      await resendVerificationEmail(email);
    } catch (error) {
      console.error("Resend failed:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-card">
      <h2 className="text-xl font-bold mb-4">Email Verification Test</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="test@example.com"
          />
        </div>

        <div>
          <Label htmlFor="token">Token</Label>
          <Input
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="verification-token"
          />
        </div>

        <div>
          <Label htmlFor="userId">User ID</Label>
          <Input
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="user-id"
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleVerify} 
            disabled={loading || !token || !userId}
          >
            Verify Email
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleResend} 
            disabled={loading || !email}
          >
            Resend Email
          </Button>
        </div>
      </div>
    </div>
  );
}