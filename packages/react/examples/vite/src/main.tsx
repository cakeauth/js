import { CakeAuthProvider } from "@cakeauth/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CakeAuthProvider
      config={{
        publicKey: import.meta.env.VITE_CAKEAUTH_PUBLIC_KEY!,
      }}
    >
      <App />
    </CakeAuthProvider>
  </StrictMode>,
);
