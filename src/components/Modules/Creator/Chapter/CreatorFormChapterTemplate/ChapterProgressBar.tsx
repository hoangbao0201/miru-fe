// components/ChapterProgressBar.tsx
import IconCircleCheck from "@/components/Modules/Icons/IconCircleCheck";
import IconSpinner from "@/components/Modules/Icons/IconSpinner";
// import { motion } from "framer-motion";

const steps = [
    "Bắt đầu",
    "Tối ưu ảnh",
    "Mã hóa ảnh",
    "Đăng ảnh",
    "Tạo chương",
    "Kết thúc",
];

type Props = {
    currentStep: number; // 0 -> 5
};

export default function ChapterProgressBar({ currentStep }: Props) {
    return (
        <div className="w-full px-4 py-6">
            <div className="flex items-center justify-between flex-wrap gap-x-3 gap-y-5 relative">
                {steps.map((step, index) => {
                    const isActive = index === currentStep;
                    const isDone = index < currentStep;
                    const isLast = index === steps.length - 1;


                    return (
                        <div
                            key={step}
                            className="flex flex-col items-center justify-center flex-1 min-w-[100px]"
                        >
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                    isDone
                                        ? "bg-green-500 border-green-500 text-white"
                                        : isActive
                                        ? "bg-blue-600 border-blue-600 text-white animate-pulse"
                                        : "bg-gray-100 border-gray-300 text-gray-800"
                                }`}
                            >
                                {isDone ? (
                                    <IconCircleCheck
                                        size={20}
                                        className="fill-white"
                                    />
                                ) : isActive ? (
                                    <IconSpinner
                                        size={20}
                                        className="animate-spin fill-white"
                                    />
                                ) : (
                                    <span className="font-semibold">
                                        {index + 1}
                                    </span>
                                )}
                            </div>
                            <div
                                className={`mt-2 text-sm font-medium text-center ${
                                    isDone
                                        ? "text-green-600"
                                        : isActive
                                        ? "text-blue-600"
                                        : "text-gray-500"
                                }`}
                            >
                                {step}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
