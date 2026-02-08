import { atom } from "nanostores";

export const viewMode = atom<"public" | "private">("public"); // Default to public
