import { HTMLAttributes } from "react";
import "./BottomBar.css"

interface BottomBarProps extends HTMLAttributes<HTMLDivElement> {}

export default function BottomBar(props:BottomBarProps) {
  return <div className="bottomBar" {...props}>
    {props.children}
  </div>

}