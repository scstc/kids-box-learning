import React from "react";
import ReactDOM from "react-dom/client";
import LearnerApp from "./LearnerApp";
import { ScreenRecordingProvider } from "./hooks/useScreenRecording";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ScreenRecordingProvider><LearnerApp /></ScreenRecordingProvider>
  </React.StrictMode>,
);
