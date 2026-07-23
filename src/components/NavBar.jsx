import { NavLink } from "react-router";
import PollLogo from "../assets/I_guess.png";

export default function NavBar() {

    return (
        <nav className="w-full h-25 bg-blue-400 px-8">
            <div className="flex flex-row items-center justify-between w-[95%]">

                <div className="flex items-center gap-10">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="new">Create Poll</NavLink>
                </div>
            </div>
        </nav>
    )
}