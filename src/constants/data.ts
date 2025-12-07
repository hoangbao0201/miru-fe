import { ContentPageEnum } from "@/common/data.types";
import { StrengthMappingEnum } from "@/services/user.services";

export const PAGE_SIZE_SEO = 10000;

export const StrengthMappingData: { [key in StrengthMappingEnum]: string[] } = {
    TUTIEN: [
        "Tầm Thường", // Cấp độ 1
        "Hậu Thiên", // Cấp độ 2
        "Tiên Thiên", // Cấp độ 3
        "Nhất Lưu", // Cấp độ 4
        "Tông Sư", // Cấp độ 5
        "Đại Tông Sư", // Cấp độ 6
        "Luyện Khí", // Cấp độ 7
        "Trúc Cơ", // Cấp độ 8
        "Kim Đan", // Cấp độ 9
        "Nguyên Anh", // Cấp độ 10
        "Hóa Thần", // Cấp độ 11
        "Luyện Hư", // Cấp độ 12
        "Hợp Thể", // Cấp độ 13
        "Đại Thừa", // Cấp độ 14
        "Độ Kiếp", // Cấp độ 15
        "Phi Thăng", // Cấp độ 16
        "Hạ Tiên", // Cấp độ 17
        "Trung Tiên", // Cấp độ 18
        "Thượng Tiên", // Cấp độ 19
        "Kim Tiên", // Cấp độ 20
        "Đại La", // Cấp độ 21
    ],
    CAP: [
        "Cấp 1",
        "Cấp 2",
        "Cấp 3",
        "Cấp 4",
        "Cấp 5",
        "Cấp 6",
        "Cấp 7",
        "Cấp 8",
        "Cấp 9",
        "Cấp 10",
        "Cấp 11",
        "Cấp 12",
        "Cấp 13",
        "Cấp 14",
        "Cấp 15",
        "Cấp 16",
        "Cấp 17",
        "Cấp 18",
        "Cấp 19",
        "Cấp 20",
        "Cấp 21",
    ],
};

export const dencryptionKeyMapImageChapter: { [key: number]: number[] } = {
    1: [7, 9, 3, 0, 6, 11, 8, 2, 10, 5, 4, 1],
    2: [9, 11, 5, 3, 7, 10, 0, 2, 8, 4, 1, 6],
    3: [5, 0, 8, 11, 6, 2, 9, 10, 4, 3, 1, 7],
    4: [2, 8, 0, 9, 3, 7, 11, 6, 1, 5, 10, 4],
    5: [7, 11, 9, 2, 0, 6, 5, 8, 10, 1, 4, 3],
};

export const encryptionKeyMapImageChapter: { [key: number]: number[] } = {
    1: [3, 11, 7, 2, 10, 9, 4, 0, 6, 1, 8, 5],
    2: [6, 10, 7, 3, 9, 2, 11, 4, 8, 0, 5, 1],
    3: [1, 10, 5, 9, 8, 0, 4, 11, 2, 6, 7, 3],
    4: [2, 8, 0, 4, 11, 9, 7, 5, 1, 3, 10, 6],
    5: [4, 9, 3, 11, 10, 6, 5, 0, 7, 2, 8, 1],
};

export const listTagSeo: Record<ContentPageEnum, string[]> = {
    [ContentPageEnum.comics]: [
        "raw",
        "manga",
        "comics",
        "anime",
        "donghua",
    ],
    [ContentPageEnum.manga]: [
    ],
}

export const ListIconComment = {
    trollface: [
        "https://4.bp.blogspot.com/-slisLqTvF6A/WtuC0aownPI/AAAAAAABiEc/HE_BH0aQLgYeT9QrNLE5B_QoyIYwcJ_swCKgBGAs/h120/01-kyghe.gif",
        "https://3.bp.blogspot.com/-uTp2kw7VMfM/WtuC0ccNKwI/AAAAAAABiEc/6cCUK3cCpEsF-1hMh-fdr1gzLJ0HaOuxgCKgBGAs/h120/02-ahihi.gif",
        "https://3.bp.blogspot.com/-6klqRMX3feI/WtuC0Z8HaOI/AAAAAAABiEc/RvsxMZLHAOovUSl05MOS1uT8frEH_w2uwCKgBGAs/h120/03-trollgif.gif",
        "https://2.bp.blogspot.com/-pcYH7hC7Ftg/WtuC0QdUFXI/AAAAAAABiEc/Ar8xlsOTNKA13600G6gTKGUTHbe_fqQzQCKgBGAs/h120/04-lolol.gif",
        "https://1.bp.blogspot.com/-_Y4X2y1k_2Y/WtuC0a4gxKI/AAAAAAABiEc/QeFXBuxebe4x65_u0o6UaqzUBNkpAnYtwCKgBGAs/h120/05-lolol2.gif",
        "https://2.bp.blogspot.com/-tOZj0cwh1Yk/WtuC0TOnBoI/AAAAAAABiEc/zWrJB0lyb6oqwdSMIG5DLdJjWTXoElNcACKgBGAs/h120/05-lolol3.gif",
        "https://3.bp.blogspot.com/-1Kzidf5jke8/WtuC0e5CkgI/AAAAAAABiEc/amjJCh85Cu8pwvvjkhJx1Wqnw7gkAf_VQCKgBGAs/h120/06-BlackGuyBeaten.gif",
        "https://4.bp.blogspot.com/-1k0KGCGSxkk/WtuC0S1wVFI/AAAAAAABiEc/4fMqhG1zBrED82kSPmzS65DLzPT1KOnGwCKgBGAs/h120/07-ahaha.gif",
        "https://4.bp.blogspot.com/-uH4aeFnSxFA/WtuC0WUtuXI/AAAAAAABiEc/bTjpu-ObsOwxYnoDuH5JUn3E53KZUh-wQCKgBGAs/h120/08-Pfftch.gif",
        "https://3.bp.blogspot.com/-h2lg24wL2oQ/WtuC0RDtvpI/AAAAAAABiEc/FdDrVlNsTCQSazibHcX-_xqghDXFgr19wCKgBGAs/h120/09-dapban.gif",
        "https://4.bp.blogspot.com/-l1OKv-XNKJ0/WtuC0XbCSmI/AAAAAAABiEc/WveGVvknLDszIN6hhjEopa1Ol0s5bok2gCKgBGAs/h120/10-trolldance.gif",
        "https://2.bp.blogspot.com/-S3LfYBVHeGg/WtuC0VxTD-I/AAAAAAABiEc/HcmnXUmtnKkkyiKm8e48vVTerBpVk5VAwCKgBGAs/h120/11-Devil.gif",
        "https://3.bp.blogspot.com/-u07nf_GIRJo/WtuC0YeRc5I/AAAAAAABiEc/cw88uWB44XYXGt_YHK3pCUBWXXwSqPwowCKgBGAs/h120/12-ExcitedTroll.gif",
        "https://3.bp.blogspot.com/-WNUKKK5YeKk/WtuC0WAoksI/AAAAAAABiEc/TevdvRXqUDgJzdR0dqBTKwYr9XUH276CwCKgBGAs/h120/13-Gay.gif",
        "https://2.bp.blogspot.com/-ydGmRnPYvQM/WtuC0VL7NFI/AAAAAAABiEc/QzLrgmdmJvYIhYHxaqAd9A4cz0VcygaJQCKgBGAs/h120/13-slap.gif",
        "https://3.bp.blogspot.com/-Su2mydtLs8s/WtuC0dw04oI/AAAAAAABiEc/igqB7svHe68bFSGl_xyj9GFWtk2_kswlQCKgBGAs/h120/13-troll-typing.gif",
        "https://4.bp.blogspot.com/-cTjPiMh5EiA/WtuC0cWzn9I/AAAAAAABiEc/bWgMjW_snlstdCqJ4T1YBNq8eJ_aO3ojQCKgBGAs/h120/13-u-mad-troll.gif",
        "https://1.bp.blogspot.com/-DFdQ1q2SaUs/WtuC0Utob9I/AAAAAAABiEc/rRQ9PtVAFVwNPT5zcebGqOzsr_jXV8hwACKgBGAs/h120/14-yaoming.gif",
        "https://4.bp.blogspot.com/-Ls8yHAyXA54/WtuC0cdgTLI/AAAAAAABiEc/7SQEwH8YH8wPVRXd6flHCm0zd-6xh6SdQCKgBGAs/h120/15-pff.gif",
        "https://1.bp.blogspot.com/-Scb7BYOitzI/WtuC0VjGy-I/AAAAAAABiEc/t0MkgL_0PYUWQ2yiIw_zCf1qC4jui5LvACKgBGAs/h120/16-yao_ming_heck_no.gif",
        "https://2.bp.blogspot.com/-19eZG3Qy3Tg/WtuC0f3cz2I/AAAAAAABiEc/PkmQyakcvRsrWYfndHp-ANAa_954TTliACKgBGAs/h120/18-hichic.gif",
        "https://1.bp.blogspot.com/-MC3KPEyOyIU/WtuC0SmvQJI/AAAAAAABiEc/ODw43MsOSYkkKyHK6Q7OSzmg8WV82NHfACKgBGAs/h120/19-hichic2.gif",
        "https://1.bp.blogspot.com/-2xE174g_lE0/WtuC0T5ZEkI/AAAAAAABiEc/iGmcPQJy-8cSRjGU0kG0i6Z34cD2WwaXQCKgBGAs/h120/20-hichic3.gif",
    ],
    bafu: [
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZDP5AajWkI/AAAAAAAABWs/A_cw_EaFzcE/w1600/01",
        "https://3.bp.blogspot.com/_1Jw2fzSntT0/TZDP64ovD7I/AAAAAAAABXQ/nbqvb3dnhr4/w1600/10",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZDP7DpQOxI/AAAAAAAABXU/Bh1PSOTn3gc/w1600/11",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZDP7cYQCpI/AAAAAAAABXY/9Eo6H5Iq5Xs/w1600/12",
        "https://3.bp.blogspot.com/_1Jw2fzSntT0/TZDP7ugQx6I/AAAAAAAABXg/LlRyQdE58RU/w1600/14",
        "https://3.bp.blogspot.com/_1Jw2fzSntT0/TZDP79xjPuI/AAAAAAAABXw/yCQwPQVDdg8/w1600/15",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZDP8Kf7HdI/AAAAAAAABXk/oY-M8TOrw3U/w1600/16",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZDP8INlD6I/AAAAAAAABXo/n8TkYIA0B7E/w1600/17",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZDP8XA_y-I/AAAAAAAABXs/lnK0IlXFM0I/w1600/18",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZDP8lkPLiI/AAAAAAAABX0/hz6aW-1_zLc/w1600/19",
        "https://3.bp.blogspot.com/_1Jw2fzSntT0/TZDP5RwpOhI/AAAAAAAABWw/wdnneTqiwQY/w1600/02",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZDP87YB_KI/AAAAAAAABX4/4gI90mKIqwo/w1600/20",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZDP9M3swRI/AAAAAAAABX8/i6EmT8a5cUA/w1600/21",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZDP9QD62sI/AAAAAAAABYA/ODjve-zEpnw/w1600/22",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZDP9rdPNLI/AAAAAAAABYE/lbvxA_QWUAM/w1600/23",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZDP-PWsoeI/AAAAAAAABYQ/sz2Z1M5S16E/w1600/25",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZDP5kDJ0EI/AAAAAAAABW0/fkqtTcAsHjg/w1600/03",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZDP_XOuz2I/AAAAAAAABYg/zsxq6jZatOU/w1600/31",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZDP_mXqI6I/AAAAAAAABYk/1zXO1MgCsd8/w1600/32",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZDP_q76u9I/AAAAAAAABYo/pOQFezig9f8/w1600/33",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZDP_xeNwcI/AAAAAAAABYs/nO1ki2-YKjg/w1600/34",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZDQAAfJYAI/AAAAAAAABYw/sTxNGTEDRVU/w1600/35",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZDQAHoV-dI/AAAAAAAABY0/WQU36tUnJeo/w1600/36",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZDQAoU9i-I/AAAAAAAABY4/pcXGtCrZQq8/w1600/37",
    ],
    rabit: [
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZC7pj3PEEI/AAAAAAAABJU/Kv_h-jA_rHQ/w1600/001.gif",
        "https://3.bp.blogspot.com/_1Jw2fzSntT0/TZC7ru18PqI/AAAAAAAABJ4/S2YLDYNYuTI/w1600/010.gif",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZC798Z5hcI/AAAAAAAABPg/h2GTdnvdIa0/w1600/100.gif",
        "https://3.bp.blogspot.com/_1Jw2fzSntT0/TZC7rznjhkI/AAAAAAAABJ8/lX0E7b0xi-k/w1600/011.gif",
        "https://3.bp.blogspot.com/_1Jw2fzSntT0/TZC7r6PrCzI/AAAAAAAABKA/xqlaZeqjU9s/w1600/012.gif",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZC7sKugqUI/AAAAAAAABKE/DaNDTHG2yso/w1600/013.gif",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZC7scnYSyI/AAAAAAAABKI/IkhkfVjheJE/w1600/014.gif",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZC7siYrpYI/AAAAAAAABKM/6O5hXUuhcOg/w1600/015.gif",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZC7s17WpSI/AAAAAAAABKQ/S7X8YawDvYs/w1600/016.gif",
        "https://3.bp.blogspot.com/_1Jw2fzSntT0/TZC7s8EfHkI/AAAAAAAABKU/84xus_0xEP0/w1600/017.gif",
        "https://3.bp.blogspot.com/_1Jw2fzSntT0/TZC7tLAeqTI/AAAAAAAABKY/UrkLn3zlvhY/w1600/018.gif",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZC7tXfb1iI/AAAAAAAABKc/Ai5TQJJmGig/w1600/019.gif",
        "https://3.bp.blogspot.com/_1Jw2fzSntT0/TZC7p-ZTGwI/AAAAAAAABJY/LeaO7_dNbxk/w1600/002.gif",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZC7trfKk6I/AAAAAAAABKg/yK_I6NhU6EA/w1600/020.gif",
        "https://3.bp.blogspot.com/_1Jw2fzSntT0/TZC7tjAU8BI/AAAAAAAABKk/yzdGqicuzuA/w1600/021.gif",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZC7t-vF4NI/AAAAAAAABKo/ZX-5i_cKk-c/w1600/022.gif",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZC7uHQ7tWI/AAAAAAAABKs/dyVYUI8a-Ms/w1600/023.gif",
        "https://3.bp.blogspot.com/_1Jw2fzSntT0/TZC7uV6dUzI/AAAAAAAABKw/xWjGZLLoIxQ/w1600/024.gif",
        "https://3.bp.blogspot.com/_1Jw2fzSntT0/TZC7usgwWvI/AAAAAAAABK0/V1XriyO8Pjc/w1600/025.gif",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZC7uitnhUI/AAAAAAAABK4/Ed87mb-pRzg/w1600/026.gif",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZC71dhYooI/AAAAAAAABNE/1O5ZImMU73g/w1600/062.gif",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZC7vOWjJtI/AAAAAAAABLA/Atx21cZkSmM/w1600/028.gif",
        "https://3.bp.blogspot.com/_1Jw2fzSntT0/TZC7vbxd5_I/AAAAAAAABLE/ZHlyGEyodOM/w1600/029.gif",
        "https://4.bp.blogspot.com/_1Jw2fzSntT0/TZC7qAozCCI/AAAAAAAABJc/Rih9yuJMKco/w1600/003.gif",
    ],
};
