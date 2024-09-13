import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WelcomeBar from "./WelcomeBar";

const welcomeElement = document.getElementById("welcome-bar");
const welcomeText = welcomeElement.getAttribute("data-welcome-text");
const backgroundColor = welcomeElement.getAttribute("data-background-color");

createRoot(document.getElementById("welcome-bar")).render(
  <StrictMode>
    <WelcomeBar text={welcomeText} backgroundColor={backgroundColor} />
  </StrictMode>
);
