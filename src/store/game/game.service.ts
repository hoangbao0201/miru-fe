import { Env } from "@/config/Env";
import { OptionsFetch } from "@/constants/type";

export interface IParamsGetListItemLuckyWheelType extends OptionsFetch {}
export interface IItemLuckyWheelType {
    name: string;
    content: number;
    imageUrl: string;
    type: "ITEM" | "COIN";
}
export interface IGetListItemLuckyWheelType {
    success: boolean;
    data: {
        content: IItemLuckyWheelType[];
    };
}
export const getListItemLuckyWheelApi = async (
    data: IParamsGetListItemLuckyWheelType
): Promise<IGetListItemLuckyWheelType> => {
    const url = "api/games/wheel/items";
    const dataRes = await fetch(`${Env.NEXT_PUBLIC_API_URL}/${url}`, {
        cache: data?.options?.cache,
        next: { revalidate: data?.options.revalidate },
    });

    return await dataRes.json();
};
