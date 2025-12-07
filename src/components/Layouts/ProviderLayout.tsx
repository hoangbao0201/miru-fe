"use client";

import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import React, { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";

import { Env } from "@/config/Env";
import { store } from "@/store/store";
import { init } from "@/utils/devtool-detect";
import ActionProvider from "./ActionProvider";
import ButtonOnTop from "@/components/Share/ButtonOnTop";
import persistStore from "redux-persist/es/persistStore";
import { PersistGate } from "redux-persist/integration/react";

const { NODE_ENV, NEXT_PUBLIC_FACEBOOK_URL_SEO } = Env;

const ChatBox = dynamic(() => import("@/components/Share/ChatBox"), {
    ssr: false,
});

const persistor = persistStore(store);

export default function ProviderLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <>
            <SessionProvider>
                <Toaster position="top-right" richColors />
                <Provider store={store}>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme-mino">
                        <PersistGate loading={null} persistor={persistor}>
                            <NextTopLoader
                                color="#2563ebcc"
                                initialPosition={0.08}
                                crawlSpeed={200}
                                height={3}
                                crawl={true}
                                showSpinner={false}
                                easing="ease"
                                speed={200}
                            />

                            <div className="transition-all duration-1000 ease-linear fixed right-3 bottom-[52px] z-[99] flex flex-col space-y-2">
                                <ButtonOnTop />
                                <ChatBox />
                            </div>

                            {/* <Maintenance /> */}

                            {children}

                            {/* <PopunderAds>{children}</PopunderAds> */}

                            <ActionProvider />
                        </PersistGate>
                    </ThemeProvider>
                </Provider>
            </SessionProvider>
        </>
    );
}
