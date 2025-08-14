// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <GoogleOAuthProvider clientId="977507536994-ungrdck8msncddhueo3bcp5qcqcfig44.apps.googleusercontent.com">
        {children}
      </GoogleOAuthProvider>
    </SessionProvider>
  );
}
