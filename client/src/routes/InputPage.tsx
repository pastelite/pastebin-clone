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
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps, useSlate } from 'slate-react'
import { BaseEditor, Editor, Element, Transforms, createEditor } from 'slate'

interface InputBox {
  //extends HTMLAttributes<HTMLDivElement>
  children?: ReactNode;
  notice?: String;
}

const initialValue = [
  {
    type: 'paragraph',
    children: [
      { text: 'A line of text in a paragraph.' },
      { text: 'test',bold:true}
    ],
  },
]

export let InputPage: React.FC<InputBox> = (props) => {
  let navigate = useNavigate();
  let inputbox = useRef<HTMLDivElement>(null);
  const [editor] = useState(()=> withReact(createEditor()))

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

  function renderElement(props: RenderElementProps) {
    // switch (props.element.type) {
    //   return
    // }
    return <div id="lala">{props.children}</div>
    // return <div>test</div>
  }

  // function renderLeaf(props: RenderLeafProps) {
  //   // throw new Error("Function not implemented.");
  //   // @ts-ignore
  //   if (props.leaf.bold) {
  //     return <span style={{color:"red"}}>{props.children}</span>
  //   }
  //   return <span>{props.children}</span>
  // }

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    // @ts-ignore
    if (props.leaf.bold) {
      return <span {...props.attributes} style={{fontWeight:"bold"}}>{props.children}</span>
    }
    return <span {...props.attributes}>{props.children}</span>
  },[])

  return (
    <>
      <Slate editor={editor} value={initialValue} >
        <div>
        <button onMouseDown={event=>{
          event.preventDefault()
          let mark = Editor.marks(editor)
          // @ts-ignore
          let isMarked = mark? mark["bold"] === true: false
          console.log(isMarked)

          // let isMarked = false;

          if (isMarked) {
            Editor.removeMark(editor,"bold")
          } else {
            editor.addMark("bold",true)
          }
          
          // editor.addMark("bold",true)
        }}>Bold</button>
        <button onMouseDown={event=>{
        event.preventDefault()

        Transforms.unwrapNodes({
          insertNode: {
            // @ts-ignore
            type: "paragraph",
            children: [{ text: 'PG' }]
          }
        })
        
        // Transforms.insertNodes(editor,{
        //   // @ts-ignore
        //   type: 'paragraph',
        //   children: [{ text: 'PG' }]
        // })
        // Transforms.unwrapNodes(editor,{
        //   match: (n)=> true,
        //   split: true
        // })
        // Transforms.setNodes<Element>(editor, {
        //   // @ts-ignore
        //   type: 'paragraph'
        // })
        }}>
          Try
        </button>
        </div>
        <Editable 
        renderLeaf={renderLeaf}
        onKeyDown={event => {
          console.log(event.key)
          if (event.key === '&') {
            // Prevent the ampersand character from being inserted.
            event.preventDefault()
            // Execute the `insertText` method when the event occurs.
            editor.insertText("and")
          }
        }}
        />
      </Slate>
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

function EditorButton() {
  let editor = useSlate()

  return <button onMouseDown={event=>{
    event.preventDefault()
    addMark(editor)
  }}>Bold</button>
}

const addMark = (editor: BaseEditor) => {
  // let editor = useSlate()
  Editor.addMark(editor,"rad",true)
}

// const isMarkActive = (editor: BaseEditor, format: string) => {
//   const marks = Editor.marks(editor)
//   return marks ? marks[format] === true : false
// }