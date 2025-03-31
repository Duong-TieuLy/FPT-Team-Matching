import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import { GroupProvider } from "./context/GroupContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <GroupProvider>
        <BrowserRouter>
          <div className="bg-gray-100 ">
            <App />
          </div>
        </BrowserRouter>
      </GroupProvider>
    </AuthProvider>
  </StrictMode>
);
