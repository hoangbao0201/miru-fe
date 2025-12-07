import Link from "next/link"

const BackLink = () => {
    return (
        <div>
            <Link href={'https://shbplc.com/'} target="_blank">
                <div className="flex items-center text-[#c6d4df] bg-[#c6d4df26] hover:bg-slate-600 px-4 py-3 rounded-sm">
                    <div className="font-semibold text-lg">IWin</div>
                </div>
            </Link>
        </div>
    )
}

export default BackLink;