import { AuthSessionProvider } from "@/components/providers/session-provider";

export default function BaskanRootLayout({ children }: { children: React.ReactNode }) {
  return <AuthSessionProvider>{children}</AuthSessionProvider>;
}
