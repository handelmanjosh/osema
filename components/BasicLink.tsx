


export default function BasicLink({to, text}: {text: string, to: string}) {
    return (
        <a href={to} target="_blank" className="py-2 px-4 rounded-lg bg-green-800 hover:brightness-90 active:brightness-75">
            {text}
        </a>
    )
}