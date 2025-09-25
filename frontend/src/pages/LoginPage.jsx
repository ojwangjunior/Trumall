import React, { useState } from "react";

const LoginPage = () => {
  const [pin, setPin] = useState("");

  const handleLogin = () => {
    // Handle login logic here
    console.log("Logging in with PIN:", pin);
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <div className="mb-4">
          <label htmlFor="pin" className="block text-gray-700 font-bold mb-2">
            PIN
          </label>
          <input
            type="password"
            id="pin"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
        </div>
        <button
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
