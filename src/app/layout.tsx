import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Habib Hasibuan — Personal Portfolio",
  description: "Kenalan lebih dekat dengan Habib Hasibuan, hal-hal yang disukai, dan perjalanan singkatnya.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id" suppressHydrationWarning><body>{children}</body></html>;
}