import Image from "next/image";
import { Fragment } from "react";
import Breadcrumbs from "@/components/Share/BreadCrumbs";
import { IGetItems } from "@/services/item.service";
import { CategoryItemEnum } from "@/services/user.services";

interface ShopItemsTemplateProps {
    countItemsACCESSORY?: number;
    countItemsAVATAR_OUTLINE?: number;
    itemsACCESSORY?: IGetItems[];
    itemsAVATAR_OUTLINE?: IGetItems[];
}
const ShopItemsTemplate = ({
    itemsACCESSORY,
    countItemsACCESSORY,
    itemsAVATAR_OUTLINE,
    countItemsAVATAR_OUTLINE,
}: ShopItemsTemplateProps) => {
    return (
        <div className="py-2">
            <div className="xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md mx-auto shadow dark:shadow-none bg-white dark:bg-slate-800 md:rounded-md">
                <div className="py-4">
                    <Breadcrumbs
                        listBreadcrumbs={[
                            {
                                title: "Shop sảng phẩm",
                                slug: `/shop`,
                            },
                        ]}
                        className="mx-3 mb-3 pb-3"
                    />

                    <div className="px-4">
                        <div className="flex justify-center flex-wrap gap-3 pb-4">
                            {itemsACCESSORY &&
                                itemsACCESSORY.map((item) => {
                                    return (
                                        <Fragment key={item?.itemId}>
                                            <BoxItem
                                                price={item?.price}
                                                itemId={item?.itemId}
                                                category={item?.category}
                                                imageUrl={item?.imageOriginalUrl}
                                            />
                                        </Fragment>
                                    );
                                })}
                        </div>

                        <div className="flex justify-center flex-wrap gap-3 pb-4">
                            {itemsAVATAR_OUTLINE &&
                                itemsAVATAR_OUTLINE.map((item) => {
                                    return (
                                        <Fragment key={item?.itemId}>
                                            <BoxItem
                                                price={item?.price}
                                                itemId={item?.itemId}
                                                category={item?.category}
                                                imageUrl={item?.imageOriginalUrl}
                                            />
                                        </Fragment>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopItemsTemplate;

const BoxItem = ({
    price,
    itemId,
    imageUrl,
    category,
}: {
    itemId: number;
    price: number;
    imageUrl: string;
    category: CategoryItemEnum;
}) => {
    return (
        <div className="">
            <div className="text-center border border-b-0 border-dashed">
                {itemId}
            </div>
            <div className="border">
                <Image
                    width={80}
                    height={80}
                    alt="Item 1"
                    loading="lazy"
                    className="w-20 h-20 flex-shrink-0 object-cover"
                    src={`/static/images/${category}/${imageUrl}`}
                />
            </div>
            <div className="text-center border border-t-0 border-dashed">
                {price}
            </div>
        </div>
    );
};