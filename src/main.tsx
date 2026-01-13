import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register service worker (enables installability + offline support)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // silent fail (install prompt will still show instructions)
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
