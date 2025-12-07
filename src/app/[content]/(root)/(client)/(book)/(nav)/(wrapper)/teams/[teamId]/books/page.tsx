import { ContentPageEnum } from "@/common/data.types";
import TeamDetailTemplate from "@/components/Modules/TeamDetailTeamplate";

interface ParamsProps {
    params: {
        teamId: number;
        content: ContentPageEnum;
    };
}

export default async function GenreBookPage({
    params,
    searchParams,
}: SearchParamProps & ParamsProps) {
    const teamId = Number(params.teamId);
    const {
        page: page = "1",
    } = searchParams;
    const content = params?.content as ContentPageEnum || ContentPageEnum.comics;

    // JSON‑LD cho BreadcrumbList giúp trình bày cấu trúc trang trong kết quả tìm kiếm
    // const breadcrumbJsonLd = JsonLd<BreadcrumbList>({
    //     "@context": "https://schema.org",
    //     "@type": "BreadcrumbList",
    //     itemListElement: [
    //         {
    //             "@type": "ListItem",
    //             position: 1,
    //             name: "Trang chủ",
    //             item: appUrl,
    //         },
    //         {
    //             "@type": "ListItem",
    //             position: 2,
    //             name: "Truyện thể loại " + (?.[content]?.[id] ?? id),
    //             item: `${appUrl}/tags/${id}`,
    //         },
    //     ],
    // });

    return (
        <>
            {/* JSON‑LD cho BreadcrumbList */}
            {/* <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
            /> */}
            <TeamDetailTemplate
                teamId={teamId}
                content={content}
                title={`Chi tiết nhóm dịch`}
                options={{
                    page: page ? parseInt(page as string) : 1,
                }}
            />
        </>
    );
}
