import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/charts/styles.css";
import "./globals.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { theme } from "./theme";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata = {
  title: "HR контур",
  description: "Современная система управления персоналом",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body suppressHydrationWarning>
        <MantineProvider theme={theme}>
          <Notifications position="top-right" />
          <AuthProvider>
            {children}
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
