
const BookType = ({ type }: { type: string }) => {
    const cln = 'rounded-sm px-2 py-1 text-sm font-semibold uppercase';

    switch(type) {
        case "beebook":
            return (
                <span className={`text-white bg-yellow-500 ${cln}`}>beebook</span>
            )
        case "toptruyen":
            return (
                <span className={`text-white bg-blue-500 ${cln}`}>toptruyen</span>
            )
        case "blogtruyen":
            return (
                <span className={`text-white bg-green-600 ${cln}`}>blogtruyen</span>
            )
        case "blogtruyenmoi":
            return (
                <span className={`text-white bg-red-600 ${cln}`}>blogtruyenmoi</span>
            )
        case "g5":
            return (
                <span className={`text-white bg-blue-800 ${cln}`}>g5</span>
            )
        default:
            return (
                <span>{type}</span>
            )
    }
}

export default BookType;