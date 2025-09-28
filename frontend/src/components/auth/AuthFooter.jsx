import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AuthFooter = ({ page }) => {
  return (
    <>
      {/* Sign In / Sign Up Link */}
      <div className="text-center mt-6 pt-6 border-t border-gray-100">
        <p className="text-gray-600">
          {page === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link
            to={page === "signin" ? "/signup" : "/signin"}
            className="text-orange-600 hover:text-orange-700 font-semibold hover:underline"
          >
            {page === "signin" ? "Sign up here" : "Sign in here"}
          </Link>
        </p>
      </div>

      {/* Back to Home */}
      <div className="text-center mt-4">
        <Link
          to="/"
          className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
      </div>
    </>
  );
};

export default AuthFooter;
