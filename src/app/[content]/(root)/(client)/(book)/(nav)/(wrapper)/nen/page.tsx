import userService from "@/services/user.services";
import RankBackgroudTemplate from "@/components/Modules/RankBackgroudTemplate";


type Props = {
    params: {
        username: string;
    };
};
export default async function RankBackgroudPage({ params, searchParams }: Props & { searchParams: any }) {
    const { username } = params;
    
    const { user } = await userService.findOne({
        username: username,
        revalidate: 5*60
    });

    return (
        <>
            <RankBackgroudTemplate />
        </>
    );
}
