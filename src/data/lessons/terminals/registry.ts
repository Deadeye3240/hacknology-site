import type { LessonTerminalLab } from "@/types/lessonTerminal";
import { fundamentalsTerminals } from "./paths/fundamentals";
import { forensicsTerminals } from "./paths/forensics";
import { linuxTerminals } from "./paths/linux";
import { networkingTerminals } from "./paths/networking";
import { nmapTerminals } from "./paths/nmap";
import { osintTerminals } from "./paths/osint";
import { socTerminals } from "./paths/soc";
import { webSecurityTerminals } from "./paths/web-security";
import { windowsTerminals } from "./paths/windows";

/** Intentionally authored terminal labs for the Hacknology curriculum. */
export const lessonTerminalRegistry: Record<string, LessonTerminalLab> = {
  ...fundamentalsTerminals,
  ...linuxTerminals,
  ...networkingTerminals,
  ...nmapTerminals,
  ...webSecurityTerminals,
  ...windowsTerminals,
  ...osintTerminals,
  ...socTerminals,
  ...forensicsTerminals,
};
