import React, { useState } from "react";
import axios from "axios";
const API_PROJECT = import.meta.env.VITE_HOST;
function SignUp({ handleToggle }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    gender: "MALE",
    phoneNumber: "",
    major: "Logistics",
    role: "STUDENT",
    term: 1,
    skills: ["None"],
    hobbies: ["None"],
    projects: ["None"],
    profilePicture: `${API_PROJECT}/imagedefault.jpg`,
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.username ||
      !formData.password ||
      !formData.email ||
      !formData.fullName
    ) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return false;
    }
    if (formData.password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long",
      });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return false;
    }
    // Validate phone number format
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      setMessage({ type: "error", text: "Phone number must be 10 digits" });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    // Remove role from the request data as it's not in the DTO
    const signupData = formData;

    console.log(
      "Sending registration data:",
      JSON.stringify(signupData, null, 2)
    );

    try {
      const response = await axios.post(
        `${API_PROJECT}/api/auth/signup`,
        signupData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response status:", response.status);
      console.log("Response data:", JSON.stringify(response.data, null, 2));

      setMessage({
        type: "success",
        text: "Registration successful! You can now sign in.",
      });
      setTimeout(() => {
        handleToggle();
      }, 2000);
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      let errorMessage = "Registration failed. ";

      if (error.response) {
        const errorData = error.response.data;
        console.log("Server error response:", errorData);

        // Check for specific database errors
        if (errorData.error && errorData.error.includes("Duplicate entry")) {
          if (errorData.error.includes("phoneNumber")) {
            errorMessage =
              "This phone number is already registered. Please use a different number.";
          } else if (errorData.error.includes("email")) {
            errorMessage =
              "This email is already registered. Please use a different email.";
          } else if (errorData.error.includes("username")) {
            errorMessage =
              "This username is already taken. Please choose a different username.";
          } else {
            errorMessage =
              "This information is already registered. Please check your details.";
          }
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (error.response.status === 400) {
          errorMessage = "Invalid data provided. Please check your input.";
        } else {
          errorMessage = "Server error occurred. Please try again.";
        }
      } else if (error.request) {
        errorMessage =
          "No response from server. Please check if backend is running.";
      } else {
        errorMessage = error.message;
      }

      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold mt-9 text-gray-900">Sign up</h2>
      <p className="text-gray-500 mb-6">Create an account to get started.</p>

      {message.text && (
        <div
          className={`p-3 mb-4 rounded-md ${
            message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <input
        type="text"
        name="username"
        placeholder="Username *"
        value={formData.username}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded-md text-gray-600"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password * (min 6 characters)"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded-md text-gray-600"
        required
        minLength={6}
      />
      <input
        type="email"
        name="email"
        placeholder="Email *"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded-md text-gray-600"
        required
      />
      <input
        type="text"
        name="fullName"
        placeholder="Full name *"
        value={formData.fullName}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded-md text-gray-600"
        required
      />
      <input
        type="tel"
        name="phoneNumber"
        placeholder="Phone Number (10 digits)"
        value={formData.phoneNumber}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded-md text-gray-600"
        pattern="[0-9]{10}"
      />

      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded-md text-gray-600"
      >
        <option value="MALE">MALE</option>
        <option value="FEMALE">FEMALE</option>
      </select>

      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded-md text-gray-600"
      >
        <option value="STUDENT">STUDENT</option>
        <option value="LECTURER">LECTURER</option>
      </select>

      <select
        name="major"
        value={formData.major}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded-md text-gray-600"
      >
        <option value="Logistics">Logistics</option>
        <option value="Information Technology">Information Technology</option>
        <option value="Marketing">Marketing</option>
        <option value="Media">Media</option>
      </select>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className={`w-full ${
          isLoading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
        } text-white p-2 rounded-md font-semibold cursor-pointer mb-4 transition duration-200`}
      >
        {isLoading ? "Signing up..." : "Sign Up"}
      </button>

      <p className="text-sm text-gray-600 text-center">
        Already have an account?{" "}
        <button
          onClick={handleToggle}
          className="text-blue-500 hover:text-blue-600 cursor-pointer"
        >
          Sign in
        </button>
      </p>
    </>
  );
}

export default SignUp;
