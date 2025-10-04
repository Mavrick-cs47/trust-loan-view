import { useState } from "react";
import { Shield, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"mobile" | "otp">("mobile");

  const handleSendOTP = () => {
    // Simulate OTP sending
    if (mobileNumber.length === 10) {
      setStep("otp");
    }
  };

  const handleVerifyOTP = () => {
    // Simulate OTP verification
    console.log("Verifying OTP:", otp);
    // Navigate to dashboard based on user role
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="flex w-full flex-col items-center justify-center p-4">
        {/* Logo and Title */}
        <div className="mb-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <Shield className="h-10 w-10 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">loanMitra</h1>
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Your Trusted Loan Companion
          </p>
          <p className="text-sm text-muted-foreground">
            Secure Login with Mobile Number Authentication
          </p>
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-md border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">
              {step === "mobile" ? "Enter Mobile Number" : "Verify OTP"}
            </CardTitle>
            <CardDescription className="text-center">
              {step === "mobile"
                ? "We'll send you a one-time password to verify your identity"
                : `Enter the OTP sent to +91 ${mobileNumber}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === "mobile" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <div className="flex gap-2">
                    <div className="flex h-10 w-16 items-center justify-center rounded-md border border-input bg-muted px-3 text-sm">
                      +91
                    </div>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="9876543210"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      maxLength={10}
                      className="flex-1"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSendOTP}
                  className="w-full"
                  disabled={mobileNumber.length !== 10}
                >
                  Send OTP
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp">One-Time Password</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button onClick={handleVerifyOTP} className="w-full" disabled={otp.length !== 6}>
                    Verify & Login
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setStep("mobile")}
                    className="w-full"
                  >
                    Change Mobile Number
                  </Button>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Didn't receive OTP?{" "}
                  <button
                    onClick={handleSendOTP}
                    className="font-medium text-primary hover:underline"
                  >
                    Resend
                  </button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="mt-6 flex items-start gap-2 rounded-lg bg-info/10 p-4 text-sm text-info-foreground">
          <Phone className="h-5 w-5 flex-shrink-0" />
          <p>
            Your mobile number is used for secure authentication. We never share your personal
            information with third parties.
          </p>
        </div>

        {/* Back to Home */}
        <Link to="/" className="mt-4">
          <Button variant="link">← Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
