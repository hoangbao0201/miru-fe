const getDayInMonth = (): {
    day: number;
    month: number;
    year: number;
    listDate: { day: number, month: number }[];
} => {
    const date = new Date();
    const currrentDay = date.getDate();
    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();

    // Lấy tên của ngày 1 của tháng hiện tại
    const indexDayName = [0,1,2,3,4,5,6];
    const indexFirstDayInMonthCurrent = indexDayName[new Date(currentYear, 1, currentMonth).getDay() + 1];

    const getCountDay = (year: number, month: number) => {
        return new Date(year, month, 0).getDate();
    };

    const getCountDayInMonthCurrent = getCountDay(currentYear, currentMonth);
    const getCountDayMonthBefore = getCountDay(
        currrentDay === 1 ? currentYear - 1 : currentYear,
        currentMonth === 1 ? 12 : currentMonth - 1
    );

    let listDate = [];

    for (
        let i = getCountDayInMonthCurrent - indexFirstDayInMonthCurrent + 1;
        i <= getCountDayMonthBefore;
        i++
    ) {
        listDate.push({
            day: i,
            month: currentMonth === 1 ? 12 : currentMonth - 1
        });
    }

    for (let i = 1; i <= getCountDayInMonthCurrent; i++) {
        listDate.push({
            day: i,
            month: currentMonth
        });
    }

    return {
        day: currrentDay,
        month: currentMonth,
        year: currentYear,
        listDate: listDate,
    };
};

export default getDayInMonth;