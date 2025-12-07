import { Env } from "@/config/Env";
import axios from "axios";

const { NEXT_PUBLIC_API_URL } = Env

export interface GetImagesProps {
    imageId: number,
    thumbnailUrl: string,
    createdAt: Date,
    postedBy: {
        name: string,
        userId: number,
        username: string,
        avatarUrl: null | string
    }
}

class ImageServices {
    async findOne({
        id,
        cache,
        revalidate
    }: {
        id: string
        cache?: RequestCache
        revalidate?: number
    }): Promise<any> {
        try {
            const imageRes = await fetch(`${NEXT_PUBLIC_API_URL}/api/images/${id}`, {
                method: "GET",
                cache: cache,
                next: {
                    revalidate: revalidate,
                },
            });
            const image = await imageRes.json();
            return image;
        } catch (error) {
            return {
                success: false,
                message: "Error",
                error: error,
            };
        }
    }

    async findAll({
        cache,
        revalidate
    }: {
        cache?: RequestCache
        revalidate?: number
    }): Promise<any> {
        try {
            const imagesRes = await fetch(`${NEXT_PUBLIC_API_URL}/api/images`, {
                method: "GET",
                cache: cache,
                next: {
                    revalidate: revalidate,
                },
            });
            const images = await imagesRes.json();
            return images;
        } catch (error) {
            return {
                success: false,
                message: "Error",
                error: error,
            };
        }
    }

    async downloadImage({ id, token }: { id: number, token: string }): Promise<any> {
        try {
            const imageArtworks = await fetch(`${NEXT_PUBLIC_API_URL}/api/images/artworks/download/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });
            const image = await imageArtworks.json();
            return image;
        } catch (error) {
            return {
                success: false,
                message: "error image successful",
                error: error,
            };
        }
    }

    async uploadArtworksURL({ url, token, type }: { url: string, token: string, type: string }): Promise<any> {
        try {
            const imageArtworks = await fetch(`${NEXT_PUBLIC_API_URL}/api/images/artworks/url?type=${type}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ url: url })
            });
            const image = await imageArtworks.json();
            return image;
        } catch (error) {
            return {
                success: false,
                message: "error image successful",
                error: error,
            };
        }
    }

    async uploadArtworksFile({ file, token }: { file: FormData, token: string }): Promise<any> {
        try {
            const imageArtworks = await axios.post(`${NEXT_PUBLIC_API_URL}/api/images/cache`, file, {
                headers: {
                    "Content-Type": "image/jpeg",
                    Authorization: `Bearer ${token}`
                }
            });
            const image = imageArtworks.data;
            return image;
        } catch (error) {
            return {
                success: false,
                message: "error image successful",
                error: error,
            };
        }
    }

    async uploadAvatar({ file, token }: { file: FormData, token: string }): Promise<any> {
        try {
            const imageRes = await fetch(`${NEXT_PUBLIC_API_URL}/api/users/upload-avatar`, {
                method: "POST",
                body: file,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            const image = await imageRes.json();
            return image;
        } catch (error) {
            return {
                success: false,
                message: "error image successful",
                error: error,
            };
        }
    }
}

const imageService = new ImageServices();

export default imageService;
