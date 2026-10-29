import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";
import "./styles/global.css";
import App from "./App.tsx";
import { loadConfig } from "./api/config";

const queryClient = new QueryClient();
const root = createRoot(document.getElementById("root")!);

loadConfig()
  .then(() =>
    root.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </StrictMode>,
    ),
  )
  .catch((err: unknown) => {
    root.render(
      <pre className="p-4 text-error">
        [ error ] {err instanceof Error ? err.message : String(err)}
      </pre>,
    );
  });
