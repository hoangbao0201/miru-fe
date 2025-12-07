"use client";

import adminService, { AdminGetUsersProps } from "@/services/admin.services";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Tooltip,
    PointElement,
    LineElement,
    Legend,
    BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import Image from "next/image";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SkeletonAdminItemUser from "../../Skeleton/SkeletonAdminItemUser";
import { UserRole } from "@/services/user.services";
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Legend
);

interface AdminDashboarchTemplateProps {
    page?: number;
}
const AdminDashboarchTemplate = ({}: AdminDashboarchTemplateProps) => {
    const { data: session, status } = useSession();
    const [dataDashboard, setDataDashboard] = useState<{
        total_user_count: number;
        total_book_count: number;
        total_book_active: number;
        total_book_deleted: number;
        total_chapter_count: number;
        total_chapter_active: number;
        total_comment_count: number;
        top_users: {
            userId: number;
            name: string;
            username: string;
            email: string;
            rank: number;
            item: null | number;
            avatarUrl: string;
        }[];
        total_views: number;
        weekly_signups: {
            date: Date;
            user_count: number;
        }[];
    } | null>(null);

    const eventGetViews = async () => {
        if (
            status !== "authenticated" ||
            session?.user.role !== UserRole.ADMIN
        ) {
            return;
        }
        try {
            const dataDashboardRes = await adminService.getDataDashboard({
                token: session?.backendTokens.accessToken,
            });

            if (dataDashboardRes?.success) {
                console.log(dataDashboardRes?.data);
                setDataDashboard(dataDashboardRes?.data);
            }
        } catch (error) {}
    };

    useEffect(() => {
        eventGetViews();
    }, [status]);

    const labels =
        dataDashboard?.weekly_signups.map((item) =>
            new Date(item.date).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
            })
        ) || [];
    const userCounts =
        dataDashboard?.weekly_signups.map((item) => item.user_count) || [];

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: "Số người dùng đăng ký",
                data: userCounts,
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderColor: "rgba(59, 130, 246, 1)",
                borderWidth: 2,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "top" as const,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    const bookStatsData = {
        labels: ["Sách hoạt động", "Sách đã xóa"],
        datasets: [
            {
                label: "Số lượng sách",
                data: [
                    dataDashboard?.total_book_active || 0,
                    dataDashboard?.total_book_deleted || 0,
                ],
                backgroundColor: [
                    "rgba(34, 197, 94, 0.8)",
                    "rgba(239, 68, 68, 0.8)",
                ],
                borderColor: ["rgba(34, 197, 94, 1)", "rgba(239, 68, 68, 1)"],
                borderWidth: 2,
            },
        ],
    };

    const formatNumber = (num: number | undefined) => {
        if (num === undefined || num === null) return "0";
        return new Intl.NumberFormat("vi-VN").format(num);
    };

    const StatCard = ({
        title,
        value,
        icon,
        color = "blue",
    }: {
        title: string;
        value: number | undefined;
        icon: React.ReactNode;
        color?: "blue" | "green" | "purple" | "red" | "yellow" | "indigo";
    }) => {
        const colorClasses = {
            blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
            green: "bg-green-500/10 border-green-500/20 text-green-400",
            purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
            red: "bg-red-500/10 border-red-500/20 text-red-400",
            yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
            indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
        };

        return (
            <div
                className={`${colorClasses[color]} border rounded-lg p-4 backdrop-blur-sm`}
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium opacity-80">
                        {title}
                    </div>
                    <div className="opacity-60">{icon}</div>
                </div>
                <div className="text-2xl font-bold">
                    {value !== undefined ? (
                        formatNumber(value)
                    ) : (
                        <span className="w-20 h-7 block rounded-md bg-gray-200/20 animate-pulse"></span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Tổng người dùng"
                    value={dataDashboard?.total_user_count}
                    color="blue"
                    icon={
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                    }
                />
                <StatCard
                    title="Tổng lượt xem"
                    value={dataDashboard?.total_views}
                    color="green"
                    icon={
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                        </svg>
                    }
                />
                <StatCard
                    title="Tổng số sách"
                    value={dataDashboard?.total_book_count}
                    color="purple"
                    icon={
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                    }
                />
                <StatCard
                    title="Sách đang hoạt động"
                    value={dataDashboard?.total_book_active}
                    color="green"
                    icon={
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    }
                />
                <StatCard
                    title="Sách đã xóa"
                    value={dataDashboard?.total_book_deleted}
                    color="red"
                    icon={
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    }
                />
                <StatCard
                    title="Tổng số chương"
                    value={dataDashboard?.total_chapter_count}
                    color="indigo"
                    icon={
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    }
                />
                <StatCard
                    title="Chương đang hoạt động"
                    value={dataDashboard?.total_chapter_active}
                    color="green"
                    icon={
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    }
                />
                <StatCard
                    title="Tổng số bình luận"
                    value={dataDashboard?.total_comment_count}
                    color="yellow"
                    icon={
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                    }
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Signups Chart */}
                <div className="bg-slate-800/50 backdrop-blur-sm px-4 py-5 rounded-lg border border-slate-700/50">
                    <h3 className="font-semibold text-lg mb-4 text-white">
                        Biểu đồ đăng ký người dùng (7 ngày gần đây)
                    </h3>
                    <div className="h-64">
                        {dataDashboard?.weekly_signups ? (
                            <Line data={chartData} options={chartOptions} />
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <div className="w-full h-48 rounded-md bg-gray-200/10 animate-pulse"></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Book Stats Chart */}
                <div className="bg-slate-800/50 backdrop-blur-sm px-4 py-5 rounded-lg border border-slate-700/50">
                    <h3 className="font-semibold text-lg mb-4 text-white">
                        Thống kê sách
                    </h3>
                    <div className="h-64">
                        {dataDashboard ? (
                            <Bar data={bookStatsData} options={chartOptions} />
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <div className="w-full h-48 rounded-md bg-gray-200/10 animate-pulse"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Users Table */}
            <div className="bg-slate-800/50 backdrop-blur-sm px-4 py-5 rounded-lg border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-white">
                        Top thành viên
                    </h3>
                    <div className="text-sm text-gray-400">
                        Tổng:{" "}
                        <span className="font-semibold text-white">
                            {formatNumber(dataDashboard?.total_user_count)}
                        </span>{" "}
                        thành viên
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full">
                        <thead className="text-gray-300 bg-slate-700/50">
                            <tr className="whitespace-nowrap [&>th]:px-4 [&>th]:py-3 [&>th]:font-semibold [&>th]:text-left">
                                <th className="rounded-tl-md">#</th>
                                <th>Người dùng</th>
                                <th>Email</th>
                                <th className="text-center">Rank</th>
                                <th className="rounded-tr-md text-center">
                                    Số chương đọc
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50 text-sm">
                            {status === "authenticated" &&
                                (dataDashboard?.top_users ? (
                                    dataDashboard?.top_users?.map(
                                        (user, index) => {
                                            return (
                                                <tr
                                                    key={user?.userId}
                                                    className="hover:bg-slate-700/30 transition-colors [&>td]:px-4 [&>td]:py-3"
                                                >
                                                    <td className="text-gray-400 font-medium">
                                                        {index + 1}
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center space-x-3">
                                                            {user?.avatarUrl ? (
                                                                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                                                    <Image
                                                                        src={
                                                                            `https://cloudkk.art/${user.avatarUrl}`
                                                                        }
                                                                        alt={
                                                                            user.name || "Avatar"
                                                                        }
                                                                        fill
                                                                        unoptimized
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                                                    {user?.name
                                                                        ?.charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase() ||
                                                                        "U"}
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className="font-medium text-white">
                                                                    {user?.name ||
                                                                        "N/A"}
                                                                </div>
                                                                <div className="text-xs text-gray-400">
                                                                    @
                                                                    {user?.username ||
                                                                        "N/A"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-gray-300">
                                                        {user?.email || "N/A"}
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                                                            #{user?.rank || 0}
                                                        </span>
                                                    </td>
                                                    <td className="text-center text-gray-300 font-medium">
                                                        {formatNumber(
                                                            user?.rank || 0
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )
                                ) : (
                                    <SkeletonAdminItemUser count={5} />
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboarchTemplate;
