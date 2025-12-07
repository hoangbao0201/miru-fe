import Image from "next/image";

const LoadingChangePage = () => {
  return (
    <div className="fixed z-20 top-1/2 -translate-y-1/2 bottom-0 left-1/2 -translate-x-1/2">
      <div className="text-foreground bg-background pl-2 pr-4 py-1 rounded-lg flex items-center">
        <Image
          alt="loading"
          src={"/static/images/chapter_load.gif"}
          width={30}
          height={30}
          className=""
        />
        Đang tải
      </div>
    </div>
  );
};

export default LoadingChangePage;
