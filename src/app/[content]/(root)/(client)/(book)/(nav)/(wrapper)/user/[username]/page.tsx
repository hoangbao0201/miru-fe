import userService from "@/services/user.services";
import UserDetailTemplate from "@/components/Modules/UserDetailTemplate";


type Props = {
    params: {
        username: string;
    };
};
export default async function UserPage({ params, searchParams }: Props & { searchParams: any }) {
    const { username } = params;
    
    const { user } = await userService.getUserDetail({
        username: username,
        cache: 'no-store'
    });

    return (
        <>
            <UserDetailTemplate user={user}/>
        </>
    );
}
