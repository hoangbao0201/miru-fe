export async function fetchWithConcurrency<T>(
    items: T[],
    limit: number,
    handler: (item: T, index: number) => Promise<void>
) {
    const queue: Array<[number, T]> = [...items.entries()];
    let activeCount = 0;
    let errorOccurred = false;

    return new Promise<void>((resolve, reject) => {
        const next = () => {
            if (errorOccurred) return;

            if (queue.length === 0 && activeCount === 0) {
                resolve(); // All done
                return;
            }

            while (activeCount < limit && queue.length > 0) {
                const [index, item] = queue.shift()!;
                activeCount++;

                // console.log("item: ", item);

                handler(item, index)
                    .catch((err) => {
                        errorOccurred = true;
                        reject(err);
                    })
                    .finally(() => {
                        activeCount--;
                        next();
                    });
            }
        };

        next();
    });
}
