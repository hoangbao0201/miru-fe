import SkeletionItemComment from "./SkeletionItemComment";

const SkeletonFormComment = () => {
  return (
    <div className="px-3">
      <div className="dark:bg-[rgb(var(--accent-20))] rounded-md animate-pulse">
        <div className="rounded-md animate-pulse h-[188px] mb-4 bg-gray-200 dark:bg-[rgb(var(--accent-20))]"></div>
        <div className="p-3"><SkeletionItemComment count={2}/></div>
      </div>
    </div>
  );
};

export default SkeletonFormComment;
