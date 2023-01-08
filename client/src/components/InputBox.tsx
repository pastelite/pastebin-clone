import React, {
  FunctionComponent,
  FC,
  HTMLAttributes,
  ReactNode,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface InputBox {
  //extends HTMLAttributes<HTMLDivElement>
  children?: ReactNode;
  notice?: String;
}

export let InputBox: React.FC<InputBox> = (props) => {
  let navigate = useNavigate();
  let inputbox = useRef<HTMLDivElement>(null);

  async function handleSubmit() {
    console.log(inputbox.current?.textContent);

    // save data
    // try {
    //   let req = await axios.post("/api/",{
    //     data: inputbox.current?.innerHTML
    //   })

    //   let data = req.data
    //   navigate(`/${data.url}`,{state: {
    //     notice: `editcode: ${data.editCode}`
    //   }})

    // } catch (e) {
    //   console.log(inputbox.current?.innerText)
    //   navigate('/idk',{state: {
    //     notice: "Something wrong"
    //   }})
    //   console.log(e)
    // }
    // .then(e=>console.log(e)).catch(e=>console.log(e))

    // navigate
    // navigate('/about',{state: {
    //   notice: "String"
    // }})
  }

  return (
    <>
      <div
        ref={inputbox}
        className="bg-white/20 rounded-md focus:outline-none p-2 m-2 break-words flex-grow"
        id="content"
        contentEditable
      ></div>
      {props.children}
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
