import { ReactNode, useCallback, useRef, useState } from "react";
import {
  BaseEditor,
  Descendant,
  createEditor,
  Editor as SlateEditor,
  Transforms,
} from "slate";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useSlate,
  withReact,
} from "slate-react";
import "./Editor.css"

// Types

type BasicElement = { type: "paragraph"; children: AllText[] };
type Header = { type: "header", children: AllText[], level: number}
type List = { type: "list", children: AllElement[]}
type ListItem = {
  type: "listItem"
  children: (AllText|AllElement)[]
}

type NormalText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

type AllElement = BasicElement | Header | List | ListItem;
type AllText = NormalText;

declare module "slate" {
  interface CustomTypes {
    Element: AllElement;
    Text: AllText;
  }
}

// Main function

interface EditorProps {
  value?: Descendant[]
  readOnly?: boolean
  editor?: BaseEditor & ReactEditor
}

export function Editor({value, readOnly,...props}:EditorProps) {

  let renderLeafCallback = useCallback(renderLeaf, []);
  let renderElementCallback = useCallback(renderElement, []);

  let editor: BaseEditor & ReactEditor

  if (props.editor) {
    editor = props.editor
  } else {
    [editor] = useState(() => withReact(createEditor()));
  }

  return (
    <Slate editor={editor} value={value || defaultValue}>
      { readOnly || 
        <div className="toolbar">
          <InlineButton format="bold">bold</InlineButton>
          <InlineButton format="italic">🇮🇹</InlineButton>
          <InlineButton format="underline">under</InlineButton>
          <BlockButton format="header" level={1}>h1</BlockButton>
          <BlockButton format="header" level={2}>h2</BlockButton>
          <BlockButton format="header" level={3}>h3</BlockButton>
          <BlockButton format="header" level={4}>h4</BlockButton>
          <BlockButton format="header" level={5}>h5</BlockButton>
        </div>
        }
          <Editable
            readOnly={readOnly}
            className="m-2 p-2 focus:outline-none bg-white/10 focus:bg-white/20 transition-all duration-200 rounded-md"
            placeholder="Start typing here..."
            renderLeaf={renderLeafCallback}
            renderElement={renderElementCallback}
          />
    </Slate>
  );
}

const defaultValue: Descendant[] = [
  { type: "header", level: 1, children: [{ text: "Header1" }]},
  { type: "header", level: 2, children: [{ text: "Header2" }]},
  { type: "header", level: 3, children: [{ text: "Header3" }]},
  { type: "header", level: 4, children: [{ text: "Header4" }]},
  { type: "header", level: 5, children: [{ text: "Header5" }]},
  { type: "paragraph", children: [{ text: "normal text" }] },
  { type: "list", children: [{
    type: "listItem", children: [{text:"first option"}]
  },{
    type: "listItem", children: [{text:"second option"}]
  },
  {
    type: "listItem", children: [
      {type:"list",children:[{
          type: "listItem", children: [{text:"inside"}]
      }]}
    ]
  }
]}
];

// Inline

interface InlineButtonProps {
  children?: ReactNode | ReactNode[];
  format: string;
  active?: boolean;
}

function InlineButton({ children, format, active }: InlineButtonProps) {
  let editor = useSlate();
  let buttonActive = active || markCheck(editor, format);

  return (
    <button
      className={buttonActive?"include":""}
      onMouseDown={(mouseEvent) => {
        mouseEvent.preventDefault();

        let isMarked = markCheck(editor, format);

        if (isMarked) {
          editor.removeMark(format);
        } else {
          editor.addMark(format, true);
        }
      }}
    >
      {children}
    </button>
  );
}

function markCheck(editor: BaseEditor, format: string) {
  let marks: any = SlateEditor.marks(editor);

  // console.log(marks);
  // if (!marks) return false;

  return marks ? marks[format] === true : false;
}

// Block
interface BlockButtonProps {
  children?: ReactNode | ReactNode[];
  format: AllElement["type"];
  active?: boolean;
  level?: number;
}

function BlockButton({ children, format, active,level }: BlockButtonProps) {
  let editor = useSlate();
  let buttonActive = active || blockCheck(editor, format, level);

  return (
    <button
      className={buttonActive?"include":""}
      onMouseDown={(mouseEvent) => {
        mouseEvent.preventDefault();

        let isMarked = blockCheck(editor, format, level);

        let newBlock: Partial<AllElement>

        if (!isMarked && format=="header") {
          newBlock = {
            type: "header",
            level
          }
        } else if (!isMarked) {
          newBlock = {
            type: format
          }
        } else {
          newBlock = {
            type: 'paragraph'
          }
        }

        Transforms.setNodes(editor,newBlock)
      }}
    >
      {children}
    </button>
  );
}

function blockCheck(editor: BaseEditor, type: string, level?: number) {
  let {selection} = editor
  if (!selection) return false;

  // get all node with the selected format
  let blockList = Array.from(SlateEditor.nodes(editor, {
    at: SlateEditor.unhangRange(editor,selection),
    match: n => {
      // special case for header
      if (level) {
        // @ts-ignore
        // console.log(n)
        // @ts-ignore
        return n.type ? (n.type == type && n.level == level) : false
        
      } else {
        // @ts-ignore
        return n.type ? n.type == type : false
      }
    }
  }))

  return blockList.length > 0
}

// Render
const renderElement = (props: RenderElementProps) => {
  switch (props.element.type) {
    case "header":
      const HeaderTag = `h${props.element.level}`
      return <HeaderTag {...props.attributes}>{props.children}</HeaderTag>
    case "paragraph":
      return <p {...props.attributes}>{props.children}</p>
    case "list":
      return <ul {...props.attributes}>
        {props.children}
      </ul>
    case "listItem":
      return <li {...props.attributes}>{props.children}</li>
    default:
      return <div {...props.attributes}>{props.children}</div>;
  }
};

const renderLeaf = (props: RenderLeafProps) => {
  return (
    <span
      {...props.attributes}
      style={{
        fontWeight: props.leaf.bold ? "bold" : "",
        fontStyle: props.leaf.italic ? "italic" : "",
        textDecoration: props.leaf.underline ? "underline" : "",
      }}
    >
      {props.children}
    </span>
  );
};
