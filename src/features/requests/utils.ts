import { RequestKind } from "@/types/request";

export function deadlineRequirementDays(k: RequestKind | ""): number {
  switch (k) {
    case "event":
      return 1; // 24h
    case "video_editing":
      return 3;
    case "video_filming_editing":
      return 5;
    case "design_flyer":
      return 1;
    case "design_special":
      return 2;
    case "equipment":
      return 0; // no deadline restriction
    default:
      return 0;
  }
}
