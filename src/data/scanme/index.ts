export { scanMeLevels, getScanMeLevel } from "./levels";
export { scanMeMissions, getScanMeMission, getNextMission, getMissionsForLevel } from "./missions";
export { scanOutputs, SCANME_TARGET_IP } from "./outputs";
export type { ScanMeHint, ScanMeLevel, ScanMeMission } from "./types";

/** @deprecated Use SCANME_TARGET_IP — kept for any legacy references */
export const SCANME_TARGET_HOST = "10.10.10.25";
