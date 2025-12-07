
import { useSession } from "next-auth/react";
import { reportChapterService } from "@/services/report.services";

interface ButtonReportProps {
    bookId: number;
    chapterNumber: number;
}
const ButtonReport = ({ bookId, chapterNumber }: ButtonReportProps) => {
    const { status, data: session } = useSession();

    const handleReport = async () => {
        if(status !== "authenticated") {
            alert("Đăng nhập tài khoản mới có thể báo cáo!")
            return;
        }
        try {
            const reportKey = `report-${bookId}-${chapterNumber}`;
            const savedReportTime = localStorage.getItem(reportKey);

            const currentTime = new Date();

            if (!savedReportTime) {
                localStorage.setItem(reportKey, currentTime.toISOString());
                await reportChapterService({
                    bookId,
                    chapterNumber,
                    token: session?.backendTokens.accessToken,
                })
                alert("Báo cáo thành công! Cảm ơn bạn đã phản hồi. Chúng tôi sẽ xem xét trong thời gian ngắn nhất.");
            } else {
                const savedTime = new Date(savedReportTime);
                const timeDifference = (currentTime.getTime() - savedTime.getTime()) / 1000 / 60;
                
                if (timeDifference > 30) {
                    localStorage.setItem(reportKey, currentTime.toISOString());
                    alert("Báo cáo thành công! Cảm ơn bạn đã phản hồi. Chúng tôi sẽ xem xét trong thời gian ngắn nhất.");
                    await reportChapterService({
                        bookId,
                        chapterNumber,
                        token: session?.backendTokens.accessToken,
                    })
                } else {
                    alert("Báo cáo thành công! Cảm ơn bạn đã phản hồi. Chúng tôi sẽ xem xét trong thời gian ngắn nhất.");
                }
            }
        } catch (error) {
            
        }
    }

    if(status !== "authenticated") {
        return null;
    }

    return (
        <div>
            <button
                title={`Báo lỗi`}
                onClick={handleReport}
                className="bg-yellow-500 hover:bg-[#f0ad4e] border-[#eea236] uppercase text-sm font-semibold px-2 min-w-[150px] text-center h-10 leading-10 rounded-lg text-white"
            >
                Báo lỗi
            </button>
        </div>
    )
}

export default ButtonReport;