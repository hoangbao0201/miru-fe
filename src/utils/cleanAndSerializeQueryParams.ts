const cleanAndSerializeQueryParams = (obj: any) => {
    const cleanedParams = new URLSearchParams();

    Object.keys(obj).forEach((key) => {
        const value = obj[key];
        if (value !== null && value !== undefined && value !== "") {
            cleanedParams.append(key, value);
        }
    });

    return cleanedParams.toString();
};

export { cleanAndSerializeQueryParams };
