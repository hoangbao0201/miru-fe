"use client";

import { useState, useEffect, Dispatch, SetStateAction, Fragment } from "react";

import { useRouter } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";

interface PopAdsProps {
  isShowAds: boolean;
  setIsShowAds: Dispatch<SetStateAction<boolean>>;
}
const PopAds = ({ isShowAds, setIsShowAds }: PopAdsProps) => {
  const router = useRouter();
  const [showAds, setShowAds] = useState(
    localStorage.getItem("bannerPop") ? false : true
  );

  useEffect(() => {
    const bannerPop = localStorage.getItem("bannerPop");
    if (bannerPop) {
      const lastCloseTime = new Date(bannerPop).getTime();
      const currentTime = new Date().getTime();
      const hoursDiff = (currentTime - lastCloseTime) / (1000 * 60);
      if (hoursDiff < 15) {
        setShowAds(false);
      } else {
        setShowAds(true);
      }
    }
  }, []);

  const handleSetLocal = () => {
    const currentDate = new Date();
    const dateString = currentDate.toISOString();
    localStorage.setItem("bannerPop", dateString);
    setShowAds(false);
    setIsShowAds(false);
  };

  return (
    <>
      <Transition appear show={showAds} as={Fragment}>
        <Dialog as="div" className="relative z-[5000]" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 layout-ads" />
          </Transition.Child>

          <div className="fixed inset-0 p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={
                  "relative px-6 pt-6 pb-4 mx-auto rounded-[18px] bg-white max-w-[380px]"
                }
              >
                <div>
                  <Link
                    rel="nofollow"
                    href={`https://f8bet.ink/4frD6MO`}
                    target="_blank"
                    className="outline-none"
                  >
                    <Image
                      unoptimized
                      width={400}
                      height={300}
                      alt="Ảnh nhà cái"
                      src={`https://phinf.pstatic.net/memo/20240718_250/1721306785345gHbF1_GIF/400x300.gif`}
                      className="w-full block object-cover"
                    />
                  </Link>
                </div>
                <div>
                  <Link
                    rel="nofollow"
                    href={`https://103.45.232.52/vip0091.html`}
                    target="_blank"
                    className="outline-none"
                  >
                    <Image
                      unoptimized
                      width={400}
                      height={300}
                      alt="Ảnh nhà cái"
                      src={`https://phinf.pstatic.net/memo/20240723_218/17217296857507dRJP_PNG/400x300.png`}
                      className="w-full block object-cover"
                    />
                  </Link>
                </div>

                <div className="flex mt-3">
                  <button
                    title="Nút thoát quảng cáo"
                    onClick={handleSetLocal}
                    className="outline-none font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full w-full text-lg h-[45px] leading-[45px]"
                  >
                    Thoát
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default PopAds;
