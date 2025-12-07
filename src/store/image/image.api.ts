import { instanceAxios } from "@/config/axios";
import { Env } from "@/config/Env";

export const uploadImageApi = ({
    file,
    onProgress,
}: {
    file: FormData;
    onProgress?: (percent: number) => void;
}) => {
    let lastReportedPercent = -1;
    return instanceAxios.post(
        `${Env.NEXT_PUBLIC_API_URL}/api/upload/chapter/images/cloud-cache`,
        file,
        {
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );

                    if (percent % 10 === 0 && percent !== lastReportedPercent) {
                        lastReportedPercent = percent;
                        onProgress(percent);
                    }
                }
            },
        }
    );
};
