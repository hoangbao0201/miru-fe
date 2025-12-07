import { GetNotificationsProps } from "@/services/comment.services";

const CountNotification = ({
    comments,
}: {
    comments: GetNotificationsProps[];
}) => {
    const countReadItems = comments.filter(
        (obj) => obj.isRead === false
    ).length;

    return (
        <>
            {countReadItems !== 0 ? (
                <div>
                    <span className="text-sm font-semibold leading-none bg-red-500 text-white py-[2px] min-w-[15px] text-center rounded-sm absolute bottom-0 right-0">
                        {countReadItems}
                    </span>
                </div>
            ) : (
                <span></span>
            )}
        </>
    );
};

export default CountNotification;