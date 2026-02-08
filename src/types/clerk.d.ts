import "@clerk/types";

declare module "@clerk/types" {
  interface JwtPublicMetadata {
    role?: "admin" | "standard";
  }
}
