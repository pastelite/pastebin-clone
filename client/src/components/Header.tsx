import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {SwitchTransition,CSSTransition} from "react-transition-group"

export function Header() {
  let [s,sets] = useState(true)
  const helloRef = useRef<HTMLDivElement>(null);
  const goodbyeRef = useRef<HTMLDivElement>(null);
  const nodeRef = s ? goodbyeRef : helloRef;

  return <div className="flex items-center p-4 border-b-[1px] border-[#4CE0B388]">
    <div className="font-bold text-[#4CE0B3] text-2xl"><Link to="/">
      pastelbin
    </Link></div>
    <div className="mx-2">
      pastebin except it's pastelite's
    </div>
    {/* <div onClick={()=>sets(s=>!s)}>Switch</div>
    <SwitchTransition mode="out-in">
      <CSSTransition 
        key={s?"a":"b"}
        timeout={200}
        nodeRef={nodeRef}
        classNames='fade' >
        <div ref={nodeRef}>
          {s?<div contentEditable>"Test"</div>:<div contentEditable>"Test2"</div>}
        </div>
      </CSSTransition>
    </SwitchTransition> */}
  </div>;
}
