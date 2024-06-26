import {
  Component,
  MouseEventHandler,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import {
  useParams,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Editable, Slate, withReact } from "slate-react";
import { Editor } from "../components/Editor";
import BottomBar from "../components/BottomBar";
import { createEditor } from "slate";

export function ShowPage() {
  let navigate = useNavigate();
  let data: any = useLoaderData();
  let location = useLocation();
  const [editor] = useState(() => withReact(createEditor()));

  console.log(JSON.stringify(location));

  enum State {
    Start,
    EditMenu,
    Editing,
  }

  let [editState, setEditState] = useState(false);
  let [editable, setEditable] = useState(false);
  let editCodeInput = useRef<HTMLInputElement>(null);
  let editResponse = useRef<HTMLDivElement>(null);

  const handleEdit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    if (
      await checkEditCode(
        data.url,
        editCodeInput.current?.value || "",
        editResponse.current || undefined
      )
    ) {
      console.log("true wtf");
      setEditable((e) => true);
      editCodeInput.current?.setAttribute("readOnly", "true");
    } else {
      console.log("false wtf");
    }
  };

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    if (
      await editUsingCode(
        data.url,
        editCodeInput.current?.value || "",
        editResponse.current,
        JSON.stringify(editor.children)
      )
    ) {
      console.log("good!");
      navigate(0);
    } else {
      console.log("something wrong");
    }
  };

  return (
    <>
      <div className="flex-grow">
        {location.state?.notice && (
          <div className="mx-3 my-1">{location.state.notice}</div>
        )}
        <Editor
          value={data.data || notFoundMessage}
          readOnly={!editable}
          editor={editor}
        />
      </div>
      {
        data.data && (
          <BottomBar>
            <button
              onClick={() => {
                setEditState((e) => !e);
              }}
            >
              {editState ? "<- Back" : "Edit"}
            </button>
            <input
              type={"text"}
              ref={editCodeInput}
              // className="p-1 rounded-md bg-white/20"
              placeholder="insert edit code"
              style={{ display: editState ? "initial" : "none" }}
            ></input>
            <button
              onClick={handleEdit}
              style={{ display: editState && !editable ? "initial" : "none" }}
            >
              Edit!
            </button>
            <button
              onClick={handleSubmit}
              style={{ display: editable ? "initial" : "none" }}
            >
              Submit
            </button>
            <div className="mx-2" ref={editResponse}></div>
          </BottomBar>
        )
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

async function editUsingCode(
  url: string,
  editCode: string,
  element?: HTMLDivElement | null,
  data?: string
): Promise<boolean> {
  console.log(editCode);
  try {
    let res = await axios.post(
      `/api/${url}/edit`,
      { data },
      { headers: { Authorization: `BEARER ${editCode}` } }
    );
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// const onSubmit: MouseEventHandler<HTMLButtonElement> = async () => {
//   try {
//     let res = await axios.get(`/api/${url}/edit`,{headers:{'Authorization': `BEARER ${editCode}`}})
//   } catch(e) {
//     console.log(e)
//   }
// }

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

async function checkEditCode(
  url: string,
  editCode: string,
  element?: HTMLDivElement
): Promise<boolean> {
  let out = false;
  try {
    console.log(editCode);
    element && (element.innerHTML = "loading..");
    let res = await axios.get(`/api/${url}/edit`, {
      headers: { Authorization: `BEARER ${editCode}` },
    });
    // let res = await axios.request({url:`/api/${url}/edit`, method:"GET", params:{editCode: editCode}})
    element && (element.innerHTML = "");
    res.data && (out = true);
  } catch (e) {
    console.log(e);
    element && (element.innerHTML = "incorrect");
    out = false;
  }
  return out;

  // axios.get(`/api/${url}`, {data: {editCode}}).then((a)=>{
  //   out = true
  // }).catch((e)=>{
  //   console.log(e)
  //   console.log("it's not even passing here!")
  //   out = false})
  // return out
}
