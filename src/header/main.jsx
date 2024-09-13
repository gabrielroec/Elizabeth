import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Header from "./header";

createRoot(document.getElementById("header")).render(
  <StrictMode>
    <Header />
  </StrictMode>
);
