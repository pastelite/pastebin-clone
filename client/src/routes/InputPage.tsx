import React, {
  FunctionComponent,
  FC,
  HTMLAttributes,
  ReactNode,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
  useSlate,
} from "slate-react";
import { BaseEditor, Element, Transforms, createEditor } from "slate";
import { Editor } from "../components/Editor";

export let InputPage: React.FC = () => {
  let navigate = useNavigate();
  let inputbox = useRef<HTMLDivElement>(null);
  const [editor] = useState(() => withReact(createEditor()));

  async function handleSubmit() {
    console.log(JSON.stringify(editor.children));

    // save data
    // try {
    //   let req = await axios.post("/api/",{
    //     data: JSON.stringify(editor.children)
    //   })

    //   let data = req.data
    //   navigate(`/${data.url}`,{state: {
    //     notice: `editcode: ${data.editCode}`
    //   }})

    // } catch (e) {
    //   navigate('/idk',{state: {
    //     notice: "Something wrong"
    //   }})
    //   console.log(e)
    // }
  }

  return (
    <>
      <Editor editor={editor} />
      <div className="fixed right-0 bottom-0">
        <button
          className="bg-green-300 px-4 py-2 m-4 border-green-800 border-2"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </>
  );
};
