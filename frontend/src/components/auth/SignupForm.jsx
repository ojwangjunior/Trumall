import React from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShoppingCart,
  Store,
} from "lucide-react";
import AccountTypeDropdown from "./AccountTypeDropdown";

const SignupForm = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  role,
  setRole,
  isLoading,
  acceptTerms,
  setAcceptTerms,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isDropdownOpen,
  setIsDropdownOpen,
  handleSignup,
}) => {
  const accountTypes = [
    {
      value: "buyer",
      label: "Buyer - I want to shop",
      icon: ShoppingCart,
      description: "Browse and purchase products",
    },
    {
      value: "seller",
      label: "Seller - I want to sell products",
      icon: Store,
      description: "List and sell your products",
    },
  ];

  const selectedAccountType = accountTypes.find((type) => type.value === role);

  return (
    <form onSubmit={handleSignup}>
      <div className="space-y-6">
        {/* Full Name */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Account Type Dropdown */}
        <AccountTypeDropdown
          role={role}
          setRole={setRole}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          accountTypes={accountTypes}
          selectedAccountType={selectedAccountType}
        />

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-3">
          <div className="relative mt-1">
            <input
              id="accept-terms"
              type="checkbox"
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              required
            />
          </div>
          <label
            htmlFor="accept-terms"
            className="text-sm text-gray-600 leading-relaxed"
          >
            I agree to the{" "}
            <Link
              to="/terms"
              className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
            >
              Privacy Policy
            </Link>
          </label>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSignup}
          className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white hover:shadow-lg"
          }`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
              Creating Account...
            </div>
          ) : (
            "Create Account"
          )}
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
