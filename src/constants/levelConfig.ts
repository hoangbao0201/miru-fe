import { ILevelType, ILevelGroupType } from "./type";

export const LEVEL_TYPES: Record<string, ILevelGroupType> = {
    t1: {
        id: "t1",
        title: "Thấp Võ",
        description: "Cấp độ võ công cơ bản, từ yếu nhất đến mạnh hơn",
    },
    t2: {
        id: "t2",
        title: "Tu Tiên",
        description: "Cấp độ luyện khí, từ yếu nhất đến mạnh nhất",
    },
    t3: {
        id: "t3",
        title: "Thần Giả",
        description: "Cấp bậc siêu việt, từ thần sơ đến thần tối cao",
    },
};

export const LEVELS: Record<number, ILevelType> = {
    1: {
        id: 1,
        type: "t1",
        name: "Phàm Nhân",
        imageUrl: "/static/images/level/3.gif",
        description:
            "Võ công cơ bản, kỹ năng phòng thân và tự vệ, chưa có nội lực rõ rệt.",
        rankRange: [0, 10],
    },
    2: {
        id: 2,
        type: "t1",
        name: "Hậu Thiên",
        imageUrl: "/static/images/level/17.gif",
        description:
            "Võ công cơ bản, có chút nội lực, chiêu thức vẫn đơn giản và mang tính thực chiến.",
        rankRange: [10, 50],
    },
    3: {
        id: 3,
        type: "t1",
        name: "Tiên Thiên",
        imageUrl: "/static/images/level/5.gif",
        description: "Có nội công nhất định, khinh công tương đối cao.",
        rankRange: [50, 120],
    },
    4: {
        id: 4,
        type: "t1",
        name: "Nhất Lưu",
        imageUrl: "/static/images/level/2.gif",
        description:
            "Nội lực vững chắc, có thể tự vệ và giao đấu với nhiều đối thủ.",
        rankRange: [120, 220],
    },
    5: {
        id: 5,
        type: "t1",
        name: "Tông Sư",
        imageUrl: "/static/images/level/4.gif",
        description:
            "Tinh thông nội công và khinh công, sử dụng chiêu thức thượng thừa.",
        rankRange: [220, 500],
    },
    6: {
        id: 6,
        type: "t1",
        name: "Đại Tông Sư",
        imageUrl: "/static/images/level/1.gif",
        description:
            "Thượng thừa về nội công và võ học, có khả năng khai phá sức mạnh bản thân.",
        rankRange: [500, 1000],
    },
    7: {
        id: 7,
        type: "t2",
        name: "Luyện Khí",
        imageUrl: "/static/images/level/14.gif",
        description:
            "Giai đoạn cơ bản nhất của tu tiên, hấp thụ linh khí từ tự nhiên để củng cố thể chất và mở rộng kinh mạch.",
        rankRange: [1000, 2000],
    },
    8: {
        id: 8,
        type: "t2",
        name: "Trúc Cơ",
        imageUrl: "/static/images/level/21.gif",
        description:
            "Củng cố và ổn định căn cơ, tu sĩ đạt đến trình độ cao hơn trong kiểm soát linh lực, có thể sử dụng pháp thuật cơ bản.",
        rankRange: [2000, 2600],
    },
    9: {
        id: 9,
        type: "t2",
        name: "Kim Đan",
        imageUrl: "/static/images/level/13.gif",
        description:
            "Tụ hợp linh khí thành Kim Đan trong cơ thể, tăng cường sức mạnh và tuổi thọ, tu sĩ có khả năng thi triển pháp thuật mạnh mẽ.",
        rankRange: [2600, 3300],
    },
    10: {
        id: 10,
        type: "t2",
        name: "Nguyên Anh",
        imageUrl: "/static/images/level/15.gif",
        description:
            "Kim Đan hóa thành Nguyên Anh, một dạng tiểu nhân thể hiện linh hồn mạnh mẽ, tu sĩ đạt đến khả năng siêu phàm thoát tục.",
        rankRange: [3300, 4100],
    },
    11: {
        id: 11,
        type: "t2",
        name: "Hóa Thần",
        imageUrl: "/static/images/level/18.gif",
        description:
            "Giai đoạn hợp nhất Nguyên Anh và thân xác, giúp tu sĩ đạt cảnh giới cao siêu, có thể linh hoạt sử dụng và kiểm soát nguyên khí.",
        rankRange: [4100, 5000],
    },
    12: {
        id: 12,
        type: "t2",
        name: "Luyện Hư",
        imageUrl: "/static/images/level/24.gif",
        description:
            "Tu luyện ở mức cao hơn, linh hồn và cơ thể hòa hợp, có thể tạo ra các không gian nhỏ và dịch chuyển tức thời.",
        rankRange: [5000, 6000],
    },
    13: {
        id: 13,
        type: "t2",
        name: "Hợp Thể",
        imageUrl: "/static/images/level/27.gif",
        description:
            "Hợp nhất linh khí và ý thức vào một, sức mạnh cực kỳ hùng mạnh, khả năng khống chế và phá hủy một vùng lớn.",
        rankRange: [6000, 7200],
    },
    14: {
        id: 14,
        type: "t2",
        name: "Đại Thừa",
        imageUrl: "/static/images/level/6.gif",
        description:
            "Cảnh giới gần chạm đến đỉnh cao của tu tiên, tu sĩ có thể sống hàng nghìn năm và sức mạnh vượt xa người thường.",
        rankRange: [7200, 8600],
    },
    15: {
        id: 15,
        type: "t2",
        name: "Độ Kiếp",
        imageUrl: "/static/images/level/26.gif",
        description:
            "Giai đoạn tu sĩ đối mặt với thiên kiếp, thử thách vượt qua những kiếp nạn khắc nghiệt để đạt cảnh giới cuối cùng.",
        rankRange: [8600, 10300],
    },
    16: {
        id: 16,
        type: "t2",
        name: "Phi Thăng",
        imageUrl: "/static/images/level/16.gif",
        description:
            "Sau khi vượt qua kiếp nạn, tu sĩ đạt cảnh giới phi thăng, thoát ly thế giới phàm tục để tiến vào tiên giới.",
        rankRange: [10300, 12300],
    },
    17: {
        id: 17,
        type: "t2",
        name: "Hạ Tiên",
        imageUrl: "/static/images/level/30.gif",
        description:
            "Giai đoạn khởi đầu tại tiên giới, có khả năng điều khiển tiên lực và thực hiện các pháp thuật tiên gia cơ bản.",
        rankRange: [12300, 14600],
    },
    18: {
        id: 18,
        type: "t2",
        name: "Trung Tiên",
        imageUrl: "/static/images/level/12.gif",
        description:
            "Cảnh giới cao hơn ở tiên giới, sức mạnh tiên lực lớn và có khả năng thi triển pháp thuật tiên gia phức tạp hơn.",
        rankRange: [14600, 17200],
    },
    19: {
        id: 19,
        type: "t2",
        name: "Thượng Tiên",
        imageUrl: "/static/images/level/19.gif",
        description:
            "Trình độ tiên nhân cao cấp, có thể thay đổi thiên địa, tạo ra các vùng tiên cảnh và pháp bảo siêu phàm.",
        rankRange: [17200, 20200],
    },
    20: {
        id: 20,
        type: "t2",
        name: "Kim Tiên",
        imageUrl: "/static/images/level/32.gif",
        description:
            "Một trong những đẳng cấp cao nhất của tiên giới, với sức mạnh gần như vô hạn và khả năng cai quản một vùng trời đất.",
        rankRange: [20200, 23600],
    },
    21: {
        id: 21,
        type: "t2",
        name: "Đại La",
        imageUrl: "/static/images/level/8.gif",
        description:
            "Cảnh giới cuối cùng của tiên giới, gần với thần linh, có khả năng tạo và hủy diệt thế giới, đạt đến đỉnh cao của tiên đạo.",
        rankRange: [23600, 27400],
    },
    22: {
        id: 22,
        type: "t3",
        name: "Nhập Thần",
        imageUrl: "/static/images/level/11.gif",
        description:
            "Bước vào cõi thần, thân thể và nguyên lực đã vượt lên trên tiên nhân, có thể cảm nhận và tương tác trực tiếp với mạch trời đất.",
        rankRange: [27400, 31600],
    },
    23: {
        id: 23,
        type: "t3",
        name: "Thần Trung",
        imageUrl: "/static/images/level/34.gif",
        description:
            "Thần trung: điều khiển nguyên khí quy mô lớn hơn, thi triển pháp trận có tầm ảnh hưởng khu vực, quyền năng mang tính quyết định trong vùng.",
        rankRange: [31600, 36200],
    },
    24: {
        id: 24,
        type: "t3",
        name: "Thần Thượng",
        imageUrl: "/static/images/level/28.gif",
        description:
            "Thần thượng: nắm bắt nguyên lý tự nhiên nhỏ, khả năng can thiệp vào cấu trúc không-gian, sức mạnh phá hủy và sáng tạo đều vượt trội.",
        rankRange: [36200, 41200],
    },
    25: {
        id: 25,
        type: "t3",
        name: "Thiên Thần",
        imageUrl: "/static/images/level/31.gif",
        description:
            "Thiên thần: quyền năng tương đương ảnh hưởng thiên tượng, có thể gọi động và điều tiết hiện tượng tự nhiên, sinh lực gần bất tử.",
        rankRange: [41200, 46600],
    },
    26: {
        id: 26,
        type: "t3",
        name: "Hóa Thần",
        imageUrl: "/static/images/level/10.gif",
        description:
            "Hóa thần: thân thể được thần hóa, gần như bất tử về tuổi thọ, có khả năng biến chuyển vật chất và năng lượng ở quy mô lớn.",
        rankRange: [46600, 52400],
    },
    27: {
        id: 27,
        type: "t3",
        name: "Đạo Thần",
        imageUrl: "/static/images/level/22.gif",
        description:
            "Đạo thần: thông suốt đạo lý vũ trụ, có thể thiết lập hoặc phá bỏ quy tắc tại một khu vực, pháp thuật mang tính đạo tràng.",
        rankRange: [52400, 58600],
    },
    28: {
        id: 28,
        type: "t3",
        name: "Chỉ Huy Vạn Vật",
        imageUrl: "/static/images/level/29.gif",
        description:
            "Chỉ huy vạn vật: thần cấp cao có quyền ban phước và diệt vong, khả năng tạo lập thực thể, pháp bảo và chiều không gian phụ thuộc vào ý chí.",
        rankRange: [58600, 65200],
    },
    29: {
        id: 29,
        type: "t3",
        name: "Thần Chủ",
        imageUrl: "/static/images/level/23.gif",
        description:
            "Thần chủ cục bộ: cai quản một vùng trời, có thể lập ra luật riêng cho địa giới đó, áp chế các thế lực khác trong cùng khu vực.",
        rankRange: [65200, 72200],
    },
    30: {
        id: 30,
        type: "t3",
        name: "Huyền Thần",
        imageUrl: "/static/images/level/20.gif",
        description:
            "Huyền thần: đứng trước cảnh giới tối thượng của thần đạo, có thể tương tác với mạch thời – dẫn dắt vận mệnh, xuyên suốt các cõi.",
        rankRange: [72200, 79600],
    },
    31: {
        id: 31,
        type: "t3",
        name: "Tối Thượng",
        imageUrl: "/static/images/level/33.gif",
        description:
            "Tối thượng / Chân thần: sức mạnh gần như sáng lập vũ trụ, có khả năng tạo, chỉnh sửa hoặc khóa một thế giới; quyền năng siêu việt mọi định luật thông thường.",
        rankRange: [79600, 87400],
    },
};