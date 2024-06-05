import "~/styles/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "~/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "soldrive",
  description: "soldrive",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`font-sans ${inter.variable} min-h-screen bg-background`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
