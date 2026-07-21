import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/routes/AppRoutes";
import { AuthProvider } from "@/context/AuthContext";
import { ExternalLinkProvider } from "@/context/ExternalLinkContext";
import { LabProgressProvider } from "@/context/LabProgressContext";
import { LessonProgressProvider } from "@/context/LessonProgressContext";
import { VulnerableLabProvider } from "@/context/VulnerableLabContext";
import { ScanMeProvider } from "@/context/ScanMeContext";

export default function App() {
  return (
    <AuthProvider>
      <ExternalLinkProvider>
        <LabProgressProvider>
          <LessonProgressProvider>
            <VulnerableLabProvider>
              <ScanMeProvider>
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </ScanMeProvider>
            </VulnerableLabProvider>
          </LessonProgressProvider>
        </LabProgressProvider>
      </ExternalLinkProvider>
    </AuthProvider>
  );
}
