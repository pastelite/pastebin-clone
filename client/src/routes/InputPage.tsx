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
import BottomBar from "../components/BottomBar";

export let InputPage: React.FC = () => {
  let navigate = useNavigate();
  let inputbox = useRef<HTMLDivElement>(null);
  const [editor] = useState(() => withReact(createEditor()));

  async function handleSubmit() {
    console.log(JSON.stringify(editor.children));

    // save data
    try {
      let req = await axios.post("/api/", {
        data: JSON.stringify(editor.children),
      });

      let data = req.data;
      navigate(`/${data.url}`, {
        state: {
          notice: `editcode: ${data.editCode}`,
        },
      });
    } catch (e) {
      navigate("/idk", {
        state: {
          notice: "Something wrong",
        },
      });
      console.log(e);
    }
  }

  return (
    <>
      <div className="flex-grow">
        <Editor editor={editor} />
      </div>
      <BottomBar>
        <button onClick={handleSubmit}>Submit</button>
      </BottomBar>
    </>
  );
};
