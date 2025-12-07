// import { Session } from "@/types/session";

// export async function getServerSession(): Promise<Session | null> {
//     try {
//         const sessionRes = await fetch(`/api/auth/session`, {
//             cache: "no-store",
//             credentials: "include",
//         });

//         if (!sessionRes.ok) {
//             // ⚠️ Sửa lại đúng đường dẫn + thêm dấu "/"
//             const refreshTokenRes = await fetch(`/api/auth/refresh-token`, {
//                 method: "POST",
//                 cache: "no-store",
//                 credentials: "include",
//             });

//             if (!refreshTokenRes.ok) {
//                 return null;
//             }

//             const refreshTokenData = (await refreshTokenRes.json()) as {
//                 session: Session;
//             };

//             const now = Date.now();
//             const expireMs = 3600 * 1000;

//             return {
//                 expiresIn: now + expireMs,
//                 accessToken: refreshTokenData?.session?.accessToken,
//                 refreshToken: refreshTokenData?.session?.refreshToken,
//             };
//         }

//         const sessionData = (await sessionRes.json()) as { session: Session };

//         const now = Date.now();
//         const expireMs = 3600 * 1000;

//         return {
//             expiresIn: now + expireMs,
//             accessToken: sessionData?.session?.accessToken,
//             refreshToken: sessionData?.session?.refreshToken,
//         };
//     } catch (error) {
//         console.error("getServerSession error:", error);
//         return null;
//     }
// }
