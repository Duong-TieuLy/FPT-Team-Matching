import React from "react";

function SignIn({ handleToggle }) {
  return (
    <>
      <h2 className="text-2xl font-semibold mt-20 text-gray-900">Sign in</h2>
      <p className="text-gray-500 mb-6">
        Enter your email and password to continue.
      </p>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 mb-4 border rounded-md text-gray-600"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 mb-4 border rounded-md text-gray-600"
      />

      <button className="w-full bg-blue-500 text-white p-2 rounded-md font-semibold cursor-pointer mb-4">
        Sign in
      </button>

      <p className="text-sm text-gray-600 text-center">
        Don't have an account?{" "}
        <button onClick={handleToggle} className="text-blue-500 cursor-pointer">
          Sign up
        </button>
      </p>
    </>
  );
}

export default SignIn;
