// "use client";

// import {
//     createContext,
//     useContext,
//     useEffect,
//     useState,
//     ReactNode,
// } from "react";
// import { Session, SessionStatus } from "@/types/session";

// interface SessionContextType {
//     data: Session | null;
//     status: SessionStatus;
//     update: () => Promise<void>;
// }

// const SessionContext = createContext<SessionContextType | undefined>(undefined);

// interface SessionProviderProps {
//     children: ReactNode;
//     session?: Session | null; // Initial session từ server
// }

// // export function useSession(): SessionContextType {
// //     const context = useContext(SessionContext);
// //     if (!context) {
// //         throw new Error("useSession must be used within SessionProvider");
// //     }
// //     return context;
// // }

// export function SessionProvider({
//     children,
//     session: initialSession,
// }: SessionProviderProps) {
//     const [session, setSession] = useState<Session | null>(
//         initialSession || null
//     );
//     const [status, setStatus] = useState<SessionStatus>(
//         initialSession ? "authenticated" : "loading"
//     );

//     const fetchSession = async () => {
//         try {
//             const response = await fetch("/api/auth/session", {
//                 credentials: "include",
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.session) {
//                     setSession(data.session);
//                     setStatus("authenticated");
//                 } else {
//                     setSession(null);
//                     setStatus("unauthenticated");
//                 }
//             } else {
//                 setSession(null);
//                 setStatus("unauthenticated");
//             }
//         } catch (error) {
//             console.error("Fetch session error:", error);
//             setSession(null);
//             setStatus("unauthenticated");
//         }
//     };

//     // Load session lần đầu nếu không có initialSession
//     useEffect(() => {
//         if (!initialSession) {
//             fetchSession();
//         }
//     }, []);

//     // Refresh session mỗi 5 phút
//     useEffect(() => {
//         const interval = setInterval(() => {
//             if (status === "authenticated") {
//                 fetchSession();
//             }
//         }, 5 * 60 * 1000); // 5 phút

//         return () => clearInterval(interval);
//     }, [status]);

//     // Refresh khi tab được focus lại
//     useEffect(() => {
//         const handleVisibilityChange = () => {
//             if (!document.hidden && status === "authenticated") {
//                 fetchSession();
//             }
//         };

//         document.addEventListener("visibilitychange", handleVisibilityChange);
//         return () =>
//             document.removeEventListener(
//                 "visibilitychange",
//                 handleVisibilityChange
//             );
//     }, [status]);

//     const update = async () => {
//         await fetchSession();
//     };

//     return (
//         <SessionContext.Provider value={{ data: session, status, update }}>
//             {children}
//         </SessionContext.Provider>
//     );
// }