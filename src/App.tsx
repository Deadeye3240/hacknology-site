import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/routes/AppRoutes";
import { AuthProvider } from "@/context/AuthContext";
import { ExternalLinkProvider } from "@/context/ExternalLinkContext";
import { LabProgressProvider } from "@/context/LabProgressContext";

export default function App() {
  return (
    <AuthProvider>
      <ExternalLinkProvider>
        <LabProgressProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </LabProgressProvider>
      </ExternalLinkProvider>
    </AuthProvider>
  );
}
