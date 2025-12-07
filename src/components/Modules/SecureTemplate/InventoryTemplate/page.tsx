"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";

import { toast } from "sonner";

import Breadcrumbs from "@/components/Share/BreadCrumbs";
import {
    IGetUserItems,
    getItemsUserService,
    postBuyItemsService,
    postEquilItemsService,
} from "@/services/item.service";
import Modal from "@/components/Share/Modal";
import LoadingSpinner from "@/components/Share/LoadingSpinner";

interface InventoryTemplateProps {
    // countItemsACCESSORY?: number;
    // countItemsAVATAR_OUTLINE?: number;
    // itemsACCESSORY?: IGetItems[];
    // itemsAVATAR_OUTLINE?: IGetItems[];
}
const InventoryTemplate = ({}: InventoryTemplateProps) => {
    const { data: session, status, update } = useSession();

    const [listItems, setListItems] = useState<IGetUserItems[] | null>(null);
    const [isShowModalDetail, setIsShowModalDetail] =
        useState<IGetUserItems | null>(null);
    const [isLoading, setIsLoading] = useState("");

    const handleGetDataItems = async () => {
        if (status !== "authenticated") {
            return;
        }
        try {
            const itemsRes = await getItemsUserService({
                query: "?take=200&order=asc",
                cache: "no-store",
                token: session.backendTokens.accessToken,
            });
            if (itemsRes?.success) {
                setListItems(itemsRes?.result);
            }
        } catch (error) {}
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
            <div className="xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md mx-auto shadow dark:shadow-none md:rounded-md">
                <div className="py-4">
                    <Breadcrumbs
                        listBreadcrumbs={[
                            {
                                title: "Trang bị",
                                slug: `/secure/inventory`,
                            },
                        ]}
                        className="mx-3 mb-3 pb-3"
                    />

                    <div className="px-4">
                        <div className="grid sm:grid-cols-3 grid-cols-2 gap-3 pb-4">
                            {listItems &&
                                (listItems.length > 0 ? (
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
                                                    {item?.equippedItem ? (
                                                        <div className="text-center text-red-600 font-semibold border-b bg-red-500/10">
                                                            Đang trang bị
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
                                                        src={`${item?.item.imagePreview}`}
                                                        className="w-24 h-24 py-2 mx-auto flex-shrink-0 object-contain"
                                                    />
                                                </div>
                                                <div className="py-2 text-center border bg-white/10">
                                                    {item?.item.price}{" "}
                                                    <span className="font-extrabold text-sky-400">
                                                        MN
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-3">Bạn chưa sở hữu vật phẩm nào!</div>
                                ))}
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
                                        src={`${isShowModalDetail.item.imageOriginalUrl}`}
                                        className="w-80 h-40 mx-auto flex-shrink-0 object-contain"
                                    />
                                </div>
                                <div>
                                    <div>
                                        {isShowModalDetail?.equippedItem ? (
                                            <div className="select-none pointer-events-none text-white bg-red-500 rounded-md text-center w-full py-2">
                                                Đang trang bị
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleEquippedItem}
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
                            </div>
                        </Modal>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InventoryTemplate;
