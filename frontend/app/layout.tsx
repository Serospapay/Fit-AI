import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import RequireAuth from "./components/RequireAuth";
import ErrorBoundary from "./components/ErrorBoundary";
import ToastProvider from "./components/ToastProvider";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Кишеньковий тренер - Персональний фітнес-помічник",
  description: "Персональний фітнес-сервіс: відстеження тренувань, харчування, статистика та AI-рекомендації для здорового способу життя",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={`${inter.variable}`}>
        <ErrorBoundary>
          <RequireAuth>{children}</RequireAuth>
        </ErrorBoundary>
        <ToastProvider />
      </body>
    </html>
  );
}
