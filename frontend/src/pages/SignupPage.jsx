import React, { useState, useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext"; // Import useToast

import SignupHeader from "../components/auth/SignupHeader";
import SignupForm from "../components/auth/SignupForm";
import AuthFooter from "../components/auth/AuthFooter";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showToast } = useToast(); // Initialize useToast

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validation
    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error"); // Use showToast
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters long", "error"); // Use showToast
      return;
    }

    if (!acceptTerms) {
      showToast("Please accept the terms and conditions", "error"); // Use showToast
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password, role);
      navigate("/");
      showToast("Registration successful", "success"); // Use showToast for success
      console.log("Registration successful");
    } catch (error) {
      showToast(error.message || "Error creating account. Please try again.", "error"); // Use showToast for error
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

            <SignupHeader />

            <SignupForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              role={role}
              setRole={setRole}
              isLoading={isLoading}
              acceptTerms={acceptTerms}
              setAcceptTerms={setAcceptTerms}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              handleSignup={handleSignup}
            />

            <AuthFooter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
