// "use client";

// import {
//     createContext,
//     useContext,
//     useEffect,
//     useState,
//     ReactNode,
// } from "react";
// import { useRouter } from "next/navigation";
// import { tokenStorage } from "@/lib/token-storage";
// import { authService, User } from "@/lib/auth.service";

// interface AuthContextType {
//     user: User | null;
//     loading: boolean;
//     login: (email: string, password: string) => Promise<void>;
//     register: (email: string, password: string, name: string) => Promise<void>;
//     logout: () => Promise<void>;
//     refreshSession: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//     const [user, setUser] = useState<User | null>(null);
//     const [loading, setLoading] = useState(true);
//     const router = useRouter();

//     // Load session khi mount
//     useEffect(() => {
//         loadSession();
//     }, []);

//     const loadSession = async () => {
//         try {
//             const accessToken = tokenStorage.getAccessToken();

//             if (!accessToken) {
//                 setLoading(false);
//                 return;
//             }

//             const userData = await authService.getProfile(accessToken);
//             setUser(userData);
//         } catch (error) {
//             console.error("Load session error:", error);
//             tokenStorage.clearTokens();
//         } finally {
//             setLoading(false);
//         }
//     };

//     const login = async (email: string, password: string) => {
//         const response = await authService.login(email, password);

//         tokenStorage.setTokens(response.accessToken, response.refreshToken);
//         setUser(response.user);

//         router.push("/dashboard");
//     };

//     const register = async (email: string, password: string, name: string) => {
//         const response = await authService.register(email, password, name);

//         tokenStorage.setTokens(response.accessToken, response.refreshToken);
//         setUser(response.user);

//         router.push("/dashboard");
//     };

//     const logout = async () => {
//         try {
//             const accessToken = tokenStorage.getAccessToken();
//             if (accessToken) {
//                 await authService.logout(accessToken);
//             }
//         } catch (error) {
//             console.error("Logout error:", error);
//         } finally {
//             tokenStorage.clearTokens();
//             setUser(null);
//             router.push("/login");
//         }
//     };

//     const refreshSession = async () => {
//         await loadSession();
//     };

//     return (
//         <AuthContext.Provider
//             value={{ user, loading, login, register, logout, refreshSession }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// }

// export function useAuth() {
//     const context = useContext(AuthContext);
//     if (context === undefined) {
//         throw new Error("useAuth must be used within an AuthProvider");
//     }
//     return context;
// }
