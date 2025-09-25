import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import SignupHeader from "../components/auth/SignupHeader";
import AuthErrorDisplay from "../components/auth/AuthErrorDisplay";
import SignupForm from "../components/auth/SignupForm";
import AuthFooter from "../components/auth/AuthFooter";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password, role);
      navigate("/");
      console.log("Registration successful");
    } catch (error) {
      setError(error.message || "Error creating account. Please try again.");
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

            <AuthErrorDisplay error={error} />

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
