import { createRoot } from "react-dom/client";
import { injectSpeedInsights } from "@vercel/speed-insights";
import App from "./App.tsx";
import "./index.css";

// Initialize Vercel Speed Insights
injectSpeedInsights();

// Register service worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    let refreshing = false;

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    try {
      const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      // Try to pull the latest SW immediately
      reg.update().catch(() => {});
    } catch (err) {
      console.log("SW registration failed:", err);
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
