import type { Metadata } from "next";
const metadata: Metadata = {
  title: "Kaotika",
  description: "Kaotika dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-cover bg-center" style={{ backgroundImage: 'url(/images/background.jpg)'}}>{children}</body>
    </html>
  );
}
