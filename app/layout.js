'use client';

import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import SocketProvider from "@/components/SocketProvider";
import NotificationToast from "@/components/NotificationToast";
import ConnectionStatus from "@/components/ConnectionStatus";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <SocketProvider>
            {children}
            <NotificationToast />
            <ConnectionStatus />
          </SocketProvider>
        </Provider>
      </body>
    </html>
  );
}
