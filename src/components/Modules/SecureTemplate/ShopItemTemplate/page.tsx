"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";

import { toast } from "sonner";

import Breadcrumbs from "@/components/Share/BreadCrumbs";
import {
    IGetItems,
    getItemsShopService,
    postBuyItemsService,
    postEquilItemsService,
} from "@/services/item.service";
import Modal from "@/components/Share/Modal";
import LoadingSpinner from "@/components/Share/LoadingSpinner";
import { CategoryItemEnum } from "@/services/user.services";

interface ShopItemsTemplateProps {
    category: CategoryItemEnum;
}
const ShopItemsTemplate = ({ category }: ShopItemsTemplateProps) => {
    const { data: session, status, update } = useSession();

    const [listItems, setListItems] = useState<IGetItems[] | null>(null);
    const [isShowModalDetail, setIsShowModalDetail] =
        useState<IGetItems | null>(null);
    const [isLoading, setIsLoading] = useState("");

    const handleGetDataItems = async () => {
        if (status !== "authenticated") {
            return;
        }
        try {
            const itemsRes = await getItemsShopService({
                query: `?category=${category}&take=200&order=asc`,
                cache: "no-store",
                token: session.backendTokens.accessToken,
            });
            if (itemsRes?.success) {
                setListItems(itemsRes?.result);
            }
        } catch (error) {}
    };

    const handleBuyItem = async () => {
        if (status !== "authenticated") {
            return;
        }
        if (!isShowModalDetail) {
            return;
        }

        setIsLoading("loading-buy-item");
        try {
            const buyItemRes = await postBuyItemsService({
                itemId: isShowModalDetail?.itemId,
                token: session?.backendTokens.accessToken,
            });
            if (buyItemRes?.success) {
                const indexItem = listItems?.findIndex(
                    (it) => it.itemId === isShowModalDetail.itemId
                );
                if (indexItem && listItems) {
                    const newItem = listItems;
                    newItem[indexItem].isOwned = true;

                    setListItems(newItem);
                    setIsShowModalDetail({
                        ...isShowModalDetail,
                        isOwned: true,
                    });
                    toast.success("Mua thành công vật phẩm!", {
                        duration: 1500,
                        position: "top-center",
                    });
                }
            } else {
                toast.error(buyItemRes?.message || "Mua vật phẩm thất bại!", {
                    duration: 1500,
                    position: "top-center",
                });
            }
        } catch (error) {
        } finally {
            setIsLoading("");
        }
    };

    const handleEquippedItem = async () => {
        if (status !== "authenticated") {
            return;
        }
        if (!isShowModalDetail) {
            return;
        }

        setIsLoading("loading-equipped-item");
        try {
            const buyItemRes = await postEquilItemsService({
                itemId: isShowModalDetail?.itemId,
                token: session?.backendTokens.accessToken,
            });
            if (buyItemRes?.success) {
                const indexItem = listItems?.findIndex(
                    (it) => it.itemId === isShowModalDetail.itemId
                );
                const indexItemEquiqqed = listItems?.findIndex(
                    (it) => it.equippedItem
                );
                if (indexItem && indexItem !== -1 && listItems) {
                    const newItem = listItems;

                    await update();

                    newItem[indexItem].equippedItem = true;
                    if (indexItemEquiqqed && indexItemEquiqqed !== -1) {
                        newItem[indexItemEquiqqed].equippedItem = false;
                    }

                    setListItems(newItem);
                    setIsShowModalDetail({
                        ...isShowModalDetail,
                        equippedItem: true,
                    });
                    toast.success("Trang bị vật phẩm thành công!", {
                        duration: 1500,
                        position: "top-center",
                    });
                }
            } else {
                toast.error(
                    buyItemRes?.message || "Trang bị vật phẩm thất bại!",
                    {
                        duration: 1500,
                        position: "top-center",
                    }
                );
            }
        } catch (error) {
        } finally {
            setIsLoading("");
        }
    };

    useEffect(() => {
        handleGetDataItems();
    }, [status]);

    return (
        <div className="py-2">
            <div className="xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md mx-auto md:rounded-md">
                <div className="py-4">
                    <Breadcrumbs
                        listBreadcrumbs={[
                            {
                                title: "Shop vật phẩm",
                                slug: `/secure/shop-items`,
                            },
                        ]}
                        className="mx-3 mb-3 pb-3"
                    />

                    <div className="px-4">
                        <div className="grid sm:grid-cols-3 grid-cols-2 gap-3 pb-4">
                            {listItems &&
                                listItems.map((item) => {
                                    return (
                                        <div
                                            className="cursor-pointer relative"
                                            key={item?.itemId}
                                            onClick={() =>
                                                setIsShowModalDetail(item)
                                            }
                                        >
                                            <div className="border my-[2px]">
                                                {item?.isOwned ? (
                                                    <div className="text-center text-red-600 font-semibold border-b bg-red-500/10">
                                                        Sở hữu
                                                    </div>
                                                ) : (
                                                    <div className="text-center border-b bg-white/10">
                                                        ID: {item?.itemId}
                                                    </div>
                                                )}
                                                <Image
                                                    unoptimized
                                                    width={200}
                                                    height={100}
                                                    alt="Item 1"
                                                    loading="lazy"
                                                    src={`${item?.imagePreview}`}
                                                    className="w-24 h-24 py-2 mx-auto flex-shrink-0 object-contain"
                                                />
                                            </div>
                                            <div className="py-2 text-center border bg-white/10">
                                                {item?.price}{" "}
                                                <span className="font-extrabold text-sky-400">
                                                    MN
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    {isShowModalDetail && (
                        <Modal
                            size="medium"
                            title="Vật phẩm"
                            isOpen={!!isShowModalDetail}
                            setIsOpen={() => setIsShowModalDetail(null)}
                        >
                            <div>
                                <div className="mb-5">
                                    <Image
                                        unoptimized
                                        width={200}
                                        height={100}
                                        alt="Item 1"
                                        loading="lazy"
                                        src={`${isShowModalDetail.imageOriginalUrl}`}
                                        className="w-80 h-40 mx-auto flex-shrink-0 object-contain"
                                    />
                                </div>
                                <div>
                                    {isShowModalDetail?.isOwned ? (
                                        <div>
                                            <div className="mb-3 select-none pointer-events-none text-white bg-red-500 rounded-md text-center w-full py-2">
                                                Sở hữu
                                            </div>
                                            <div>
                                                {isShowModalDetail?.equippedItem ? (
                                                    <div className="select-none pointer-events-none text-white bg-red-500 rounded-md text-center w-full py-2">
                                                        Đang trang bị
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={
                                                            handleEquippedItem
                                                        }
                                                        disabled={
                                                            isLoading ===
                                                            "loading-equipped-item"
                                                        }
                                                        className="text-white bg-blue-500 rounded-md text-center w-full py-2"
                                                    >
                                                        {isLoading ===
                                                        "loading-equipped-item" ? (
                                                            <LoadingSpinner />
                                                        ) : (
                                                            "Trang bị ngay"
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            disabled={
                                                isLoading === "loading-buy-item"
                                            }
                                            onClick={handleBuyItem}
                                            className="text-white bg-blue-500 rounded-md text-center w-full py-2"
                                        >
                                            {isLoading ===
                                            "loading-buy-item" ? (
                                                <LoadingSpinner />
                                            ) : (
                                                "Mua ngay"
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Modal>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShopItemsTemplate;
