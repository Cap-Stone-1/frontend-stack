import { NavLink } from "react-router";

const navLinkClass = ({ isActive }) => {
    return isActive
        ? "text-sm font-semibold text-slate-800"
        : "text-sm font-medium text-slate-500 hover:text-slate-800";
}

export default function NavBar() {

    return (
        <nav className="sticky top-0 z-10 w-full border-b border-slate-200 bg-white/80 px-8 py-4 backdrop-blur">
            <div className="mx-auto flex w-full max-w-5xl flex-row items-center justify-between">

                <NavLink to="/" className="font-semibold text-slate-800 text-lg">
                    Simple <span className="text-sky-500">Poll</span>
                </NavLink>

                <div className="flex gap-8 items-center">
                    <NavLink to="/" end className={navLinkClass}>Home</NavLink>
                    <NavLink
                        to="new"
                        className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >Create Poll</NavLink>
                </div>
            </div>
        </nav>
    )
}