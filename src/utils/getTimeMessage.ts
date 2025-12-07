
const getTimeMessage = (time: Date) => {
    let dateString = time;
    const date = new Date(dateString);

    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${hour < 10 ? "0" + hour : hour}:${minute < 10 ? "0" + minute : minute}`;
}

export default getTimeMessage;