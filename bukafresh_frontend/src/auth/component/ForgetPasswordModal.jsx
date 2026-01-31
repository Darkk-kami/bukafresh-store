import React, { useState } from "react";
import { Mail, ArrowRight, X } from "lucide-react";
import { useAuth } from "@/auth/api/AuthProvider";
import OtpModal from "./OtpModal";
import ResetOTPModal from "./ResetOTPModal";
import { showSuccessAlert, showErrorAlert } from "@/shared/customAlert";

const ForgetPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const { setTempData, requestOtp } = useAuth();

  if (!isOpen) return null;

  const validateEmail = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsLoading(true);

    try {
      const response = await requestOtp(email);
      if (response) {
        showSuccessAlert("Please check your email for the OTP.");
        setTempData((prev) => ({ ...prev, email: email }));
        setShowOtpModal(true);
      }
    } catch (error) {
      console.error("Error requesting OTP:", error);
      showErrorAlert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
          <button
            onClick={onClose}
            className="absolute -top-12 left-1/2 -translate-x-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 z-50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>

          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 border border-gray-200 relative z-10 animate-in fade-in zoom-in duration-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Reset Password
                </h2>
                <p className="text-sm text-gray-600">
                  Enter your registered email to receive an OTP
                </p>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-900 mb-3"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-1">
                    <Mail className="h-4 sm:h-5 w-4 sm:w-5 text-gray-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className={`pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 w-full border-2 rounded-xl focus:ring-2 focus:ring-[#058C69] focus:border-[#058C69] transition-all duration-200 bg-white/80 text-sm sm:text-base ${
                      error
                        ? "border-red-400 bg-red-50/80 ring-2 ring-red-400/30"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="Enter your email address"
                    disabled={isLoading}
                  />
                </div>
                {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={!email.trim() || isLoading}
                className="group relative w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 border border-transparent text-sm sm:text-base font-medium rounded-xl text-white bg-[#374151] hover:bg-[hsl(var(--sidebar-primary))]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-xl hover:shadow-2xl cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5" />
                    Send Reset OTP
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* <OtpModal isOpen={showOtpModal} onClose={() => setShowOtpModal(false)} /> */}
      <ResetOTPModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        email={email}
      />
    </>
  );
};

export default ForgetPasswordModal;
