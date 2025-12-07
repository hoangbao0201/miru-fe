export const concurrentUpload = async <T>(
    items: T[],
    limit: number,
    asyncFn: (item: T) => Promise<any>
): Promise<any[]> => {
    const results: any[] = [];
    const executing: Promise<any>[] = [];

    for (const item of items) {
        const p = asyncFn(item).then(result => results.push(result));
        executing.push(p);

        if (executing.length >= limit) {
            await Promise.race(executing);
            // Xoá những promise đã hoàn thành
            executing.splice(0, executing.length - limit + 1);
        }
    }

    // Đợi tất cả promise còn lại
    await Promise.all(executing);
    return results;
};

// export const concurrentUpload = () => {}