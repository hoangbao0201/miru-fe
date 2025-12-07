function createLimit(concurrency: number) {
    let activeCount = 0;
    const queue: any = [];
    const next = () => {
        if (activeCount >= concurrency || queue.length === 0) {
            return;
        }
        activeCount++;
        const fn = queue.shift();
        fn().finally(() => {
            activeCount--;
            next();
        });
    };
    return async (fn: () => Promise<any>) => {
        if (activeCount < concurrency) {
            activeCount++;
            const result = await fn();
            activeCount--;
            next();
            return result;
        }
        return new Promise((resolve, reject) => {
            queue.push(() => fn().then(resolve, reject));
        });
    };
}

export default createLimit;
