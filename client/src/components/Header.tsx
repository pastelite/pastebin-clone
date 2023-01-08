import { Link } from "react-router-dom";

export function Header() {
  return <div className="flex p-4 border-b-[1px] border-[#4CE0B388]">
    <div className="font-bold text-[#4CE0B3] text-2xl"><Link to="/">Pastebin Clone</Link></div>
    <Link to="/about">About</Link>
  </div>;
}
