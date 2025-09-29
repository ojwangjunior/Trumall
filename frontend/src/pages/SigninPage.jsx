import React, { useState, useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext"; // Import useToast

import SigninHeader from "../components/auth/SigninHeader";
import SigninForm from "../components/auth/SigninForm";
import AuthFooter from "../components/auth/AuthFooter";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSignin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/");
      showToast("Login successful", "success", "top-center");
      console.log("Login successful");
    } catch (error) {
      showToast(
        error.message || "Invalid email or password. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-md">
        {/* Background decorative elements */}
        <div className="relative">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-100 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute top-32 -left-16 w-24 h-24 bg-blue-100 rounded-full opacity-20 animate-pulse delay-1000"></div>

          <div className="bg-white backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 relative overflow-hidden">
            {/* Top gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>

            <SigninHeader />

            <SigninForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              isLoading={isLoading}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              handleSignin={handleSignin}
            />

            <AuthFooter page="signin" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
