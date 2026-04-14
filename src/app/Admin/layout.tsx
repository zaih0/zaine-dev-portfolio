import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Zaine Dev",
  description: "Admin panel for managing portfolio projects.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
