import axios from "axios";

const TRANSLATE_API_URL = process.env.NEXT_PUBLIC_TRANSLATE_API_URL || "http://127.0.0.1:5000";

export interface SelectTextResponse {
    boxes: Array<{
        id: number;
        text_bbox: [number, number, number, number];
    }>;
}

export interface TranslateImageResponse {
    inpainted_image?: string; // Base64 image
    blocks: Array<{
        text: string;
        translation: string;
        text_bbox: [number, number, number, number] | null;
        bubble_bbox: [number, number, number, number] | null;
        inpaint_bboxes: Array<[number, number, number, number]>;
        text_class: string;
    }>;
    source_lang: string;
    target_lang: string;
    source_lng_cd: string;
    target_lng_cd: string;
}

export interface RenderEditedImageResponse {
    rendered_image: string;
}

class TranslateService {
    /**
     * Dịch toàn bộ ảnh - trả về ảnh đã dịch
     */
    async translateImageFull({
        imageFile,
        source_lng_cd,
        target_lng_cd,
    }: {
        imageFile: File;
        source_lng_cd: string;
        target_lng_cd: string;
    }): Promise<Blob> {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("source_lng_cd", source_lng_cd);
        formData.append("target_lng_cd", target_lng_cd);

        const response = await axios.post(
            `${TRANSLATE_API_URL}/api/translate/images`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                timeout: 120000,
                responseType: "blob",
            }
        );

        return response.data;
    }

    /**
     * Bước 1: Detect và OCR, trả về tọa độ các text boxes
     */
    async selectText({
        imageFile,
        source_lng_cd,
    }: {
        imageFile: File;
        source_lng_cd: string;
    }): Promise<SelectTextResponse> {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("source_lng_cd", source_lng_cd);

        const response = await axios.post(
            `${TRANSLATE_API_URL}/api/translate/images/select/text`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                timeout: 120000,
            }
        );

        return response.data;
    }

    /**
     * Bước 2: Dịch với selected boxes - trả về ảnh đã xóa text và thông tin chi tiết
     */
    async translateImageDetail({
        imageFile,
        source_lng_cd,
        target_lng_cd,
        selectedBoxes,
    }: {
        imageFile: File;
        source_lng_cd: string;
        target_lng_cd: string;
        selectedBoxes: Array<[number, number, number, number]>;
    }): Promise<TranslateImageResponse> {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("source_lng_cd", source_lng_cd);
        formData.append("target_lng_cd", target_lng_cd);
        formData.append("selected_boxes", JSON.stringify(selectedBoxes));

        const response = await axios.post(
            `${TRANSLATE_API_URL}/api/translate/images/detail`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                timeout: 120000,
            }
        );

        return response.data;
    }

    /**
     * Bước 3: Nhận ảnh đã xóa text + translation đã chỉnh sửa, trả về ảnh cuối.
     */
    async applyEditedText({
        cleanImageFile,
        blocks,
    }: {
        cleanImageFile: File;
        blocks: TranslateImageResponse["blocks"];
    }): Promise<RenderEditedImageResponse> {
        const formData = new FormData();
        formData.append("image", cleanImageFile);
        formData.append("blocks", JSON.stringify(blocks));

        const response = await axios.post(
            `${TRANSLATE_API_URL}/api/translate/images/render`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                timeout: 120000,
            }
        );

        return response.data;
    }
}

const translateService = new TranslateService();

export default translateService;

