"use client"

import Link from "next/link";
import { useParams } from "next/navigation";

import { Env } from "@/config/Env";
import IconAnglesRight from "../Modules/Icons/IconAnglesRight";

interface BreadcrumbsProps {
    className?: string;
    listBreadcrumbs: { id?: number; title: string; slug: string }[];
}

const Breadcrumbs = ({ className, listBreadcrumbs }: BreadcrumbsProps) => {
    const { NEXT_PUBLIC_TITLE_SEO } = Env
    
    const params = useParams();
    const { content } = params;

    return (
        <nav aria-label="Breadcrumb" className={className}>
            <ul
                itemScope
                itemType="http://schema.org/BreadcrumbList"
                className="flex items-center custom-scroll overflow-x-auto gap-1"
            >
                <li
                    itemProp="itemListElement"
                    itemScope
                    itemType="http://schema.org/ListItem"
                    className="flex items-center"
                >
                    <Link
                        prefetch={false}
                        aria-label={"Trang chủ " + NEXT_PUBLIC_TITLE_SEO}
                        itemType="http://schema.org/Thing"
                        itemProp="item"
                        title={'Trang chủ ' + NEXT_PUBLIC_TITLE_SEO}
                        href={`/${content}`}
                        className="text-sm font-medium text-foreground transition-colors duration-200 px-2 py-1 rounded-md hover:bg-accent-10"
                    >
                        <span itemProp="name" className="whitespace-nowrap">
                            {NEXT_PUBLIC_TITLE_SEO}
                        </span>
                    </Link>
                    <meta itemProp="position" content="1" />
                </li>
                {listBreadcrumbs.map((item, index) => (
                    <li
                        key={item.id || index}
                        itemProp="itemListElement"
                        itemScope
                        itemType="http://schema.org/ListItem"
                        className="flex items-center"
                    >
                        <IconAnglesRight 
                            size={12} 
                            className="mx-1 text-muted-foreground fill-muted-foreground flex-shrink-0" 
                        />
                        <Link
                            prefetch={false}
                            aria-label={item.title}
                            itemType="http://schema.org/Thing"
                            itemProp="item"
                            title={item.title}
                            href={item.slug}
                            className="text-sm font-medium text-foreground transition-colors duration-200 px-2 py-1 rounded-md hover:bg-accent-10"
                        >
                            <span itemProp="name" className="whitespace-nowrap">
                                {item.title}
                            </span>
                        </Link>
                        <meta
                            itemProp="position"
                            content={`${index + 2}`}
                        />
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Breadcrumbs;
