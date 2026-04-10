import React from "react";
import { createRoot } from "react-dom/client";

import { AppProviders } from "@/app/providers";
import App from "@/App";
import "./index.css";

const root = document.getElementById("root");
createRoot(root).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
