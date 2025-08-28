import { CONFIG } from "@/config";

export const Auth = {
  isAuthed(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(CONFIG.storage.authFlag) === "1";
  },
  login(password: string): boolean {
    if (typeof window === "undefined") return false;
    if (password === CONFIG.demo.adminPassword) {
      localStorage.setItem(CONFIG.storage.authFlag, "1");
      return true;
    }
    return false;
  },
  logout() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CONFIG.storage.authFlag);
  },
};
