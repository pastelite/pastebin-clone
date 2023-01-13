import { Component, ReactNode, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, useLoaderData, useLocation } from "react-router-dom";
import { Editable, Slate } from "slate-react";
import { Editor } from "../components/Editor";
import BottomBar from "../components/BottomBar";

export function ShowPage() {
  let data: any = useLoaderData();
  let b = useLocation();

  console.log(JSON.stringify(b));

  let [editState, setEditState] = useState(false)
  let [editable, setEditable] = useState(false)
  let editCodeInput = useRef<HTMLInputElement>(null)
  let editResponse = useRef<HTMLDivElement>(null)

  return (
    <>
      {b.state?.notice && <div>{b.state.notice}</div>}
      <Editor value={data.data || notFoundMessage} readOnly={!editable} />
      {data.data &&
        <BottomBar>
          <button onClick={()=>setEditState(e=>!e)}>
            {editState?"<- Back":"Edit"}
          </button>
          {editState &&
            <>
            <input type={"text"} ref={editCodeInput} className="p-1 mx-2 rounded-md bg-white/20" placeholder="insert edit code"></input>
            <button onClick={async ()=>{
              if (await checkEditCode(data.url,editCodeInput.current?.value||"",editResponse.current||undefined)) {
                console.log("true wtf")
                setEditable(e=>true)

              } else {
                console.log("false wtf")
              }
              //   console.log("false wtf")
              //   setEditable(e=>true)
              // } :
              // console.log("false wtf")
            }
            }>Edit!</button>
            <div className="mx-2" ref={editResponse}></div>
            </>
          }
        </BottomBar>
        // <button className="bg-[#4CE0B3] py-1 px-2 text-black rounded-md" onClick={()=>setEditState(e=>!e)}>
        //   {editState?"<- Back":"Edit"}
        // </button>
        // {editState && <>
        // <input type={"text"} className="p-1 mx-2 rounded-md bg-white/20" placeholder="insert edit code"></input>
        // <button>Edit!</button>
        // </>
      }
    </>
  );
}

const notFoundMessage = [
  {
    type: "header",
    level: 1,
    children: [{ text: "Not found" }],
  },
  {
    type: "paragraph",
    children: [{ text: "please makes sure URL is correct" }],
  },
];

async function checkEditCode(url: string, editCode: string, element?: HTMLDivElement): Promise<boolean> {
  let out = false
  try {
    console.log(editCode)
    element && (element.innerHTML = "loading..")
    let res = await axios.get(`/api/${url}/edit`,{headers:{'Authorization': `BEARER ${editCode}`}})
    // let res = await axios.request({url:`/api/${url}/edit`, method:"GET", params:{editCode: editCode}})
    element && (element.innerHTML = "")
    res.data && (out = true)
  } catch (e) {
    console.log(e)
    element && (element.innerHTML = "incorrect")
    out = false
  }
  return out
  
  // axios.get(`/api/${url}`, {data: {editCode}}).then((a)=>{
  //   out = true
  // }).catch((e)=>{
  //   console.log(e)
  //   console.log("it's not even passing here!")
  //   out = false})
  // return out
}