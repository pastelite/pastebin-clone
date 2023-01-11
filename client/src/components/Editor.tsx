import { ReactNode, useCallback, useRef, useState } from "react";
import {
  BaseEditor,
  Descendant,
  createEditor,
  Location,
  Editor as SlateEditor,
  Transforms,
  Span,
  Path,
  Node,
  NodeMatch,
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
import "./Editor.css";

// Types

type BasicElement = { type: "paragraph"; children: AllText[] };
type Header = { type: "header"; children: AllText[]; level: number };
type List = { type: "list"; children: (ListItemData | ListItemList)[] };
type ListItemData = {
  type: "listItem";
  children: AllText[];
};
type ListItemList = {
  type: "listItemList";
  children: (ListItemData | ListItemList)[];
};

type NormalText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

type AllElement = BasicElement | Header | List | ListItemData | ListItemList;
type AllText = NormalText;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor;
    Element: AllElement;
    Text: AllText;
  }
}

// Main function

interface EditorProps {
  value?: Descendant[];
  readOnly?: boolean;
  editor?: BaseEditor & ReactEditor;
}

export function Editor({ value, readOnly, ...props }: EditorProps) {
  let renderLeafCallback = useCallback(renderLeaf, []);
  let renderElementCallback = useCallback(renderElement, []);

  let editor: BaseEditor & ReactEditor;

  if (props.editor) {
    editor = props.editor;
  } else {
    [editor] = useState(() => withReact(createEditor()));
  }

  return (
    <Slate editor={editor} value={value || defaultValue}>
      {readOnly || (
        <div className="toolbar">
          <InlineButton format="bold">bold</InlineButton>
          <InlineButton format="italic">🇮🇹</InlineButton>
          <InlineButton format="underline">under</InlineButton>
          <BlockButton format="header" level={1}>
            h1
          </BlockButton>
          <BlockButton format="header" level={2}>
            h2
          </BlockButton>
          <BlockButton format="header" level={3}>
            h3
          </BlockButton>
          <BlockButton format="header" level={4}>
            h4
          </BlockButton>
          <BlockButton format="header" level={5}>
            h5
          </BlockButton>
          <AddListButton mode="wrap" />
          <AddListButton mode="unwrap" />
        </div>
      )}
      <Editable
        readOnly={readOnly}
        className="m-2 p-2 focus:outline-none bg-white/10 focus:bg-white/20 transition-all duration-200 rounded-md"
        placeholder="Start typing here..."
        renderLeaf={renderLeafCallback}
        renderElement={renderElementCallback}
        onKeyDown={(e) => onKeyDownHandler(e, editor)}
      />
    </Slate>
  );
}

const defaultValue: Descendant[] = [
  { type: "header", level: 1, children: [{ text: "Header1" }] },
  { type: "header", level: 2, children: [{ text: "Header2" }] },
  { type: "header", level: 3, children: [{ text: "Header3" }] },
  { type: "header", level: 4, children: [{ text: "Header4" }] },
  { type: "header", level: 5, children: [{ text: "Header5" }] },
  { type: "paragraph", children: [{ text: "normal text" }] },
  {
    type: "list",
    children: [
      {
        type: "listItem",
        children: [{ text: "first option" }],
      },
      {
        type: "listItem",
        children: [{ text: "second option" }],
      },
      {
        type: "listItemList",
        children: [
          {
            type: "listItem",
            children: [{ text: "first option inside a list" }],
          },
          {
            type: "listItem",
            children: [{ text: "second option inside a list" }],
          },
        ],
      },
    ],
  },
];

function onKeyDownHandler(
  e: React.KeyboardEvent<HTMLDivElement>,
  editor: BaseEditor
) {
  let nodes = getCurrentNodes(editor);

  // Handler for list
  if (SlateEditor.isBlock(editor, nodes[0][0]) && nodes[0][0].type == "list") {
    // Backspace at front
    if (
      e.key == "Backspace" &&
      // selection is the same and offset == first
      JSON.stringify(editor.selection?.anchor.path) ==
        JSON.stringify(editor.selection?.focus.path) &&
      editor.selection?.anchor.offset == 0
    ) {
      e.preventDefault();

      removeList(editor);
    }

    // Tab
    if (
      e.key == "Tab" &&
      JSON.stringify(editor.selection?.anchor.path) ==
        JSON.stringify(editor.selection?.focus.path)
    ) {
      e.preventDefault();

      if (e.shiftKey == true) {
        removeList(editor);
      } else {
        addList(editor);
      }
    }
  }

  // Control key
  if (e.ctrlKey == true) {
    // Bold Underline Italic
    if (e.key == "b") {
      e.preventDefault();
      marks(editor, "bold");
    }
    if (e.key == "u") {
      e.preventDefault();
      marks(editor, "underline");
    }
    if (e.key == "i") {
      e.preventDefault();
      marks(editor, "italic");
    }
  }
}

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
      className={buttonActive ? "include" : ""}
      onMouseDown={(mouseEvent) => {
        mouseEvent.preventDefault();

        marks(editor, format);
      }}
    >
      {children}
    </button>
  );
}

function marks(editor: BaseEditor, format: string) {
  let isMarked = markCheck(editor, format);

  if (isMarked) {
    editor.removeMark(format);
  } else {
    editor.addMark(format, true);
  }
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

function BlockButton({ children, format, active, level }: BlockButtonProps) {
  let editor = useSlate();
  let buttonActive = active || blockCheck(editor, format, level);

  return (
    <button
      className={buttonActive ? "include" : ""}
      onMouseDown={(mouseEvent) => {
        mouseEvent.preventDefault();

        let isMarked = blockCheck(editor, format, level);
        let newBlock: Partial<AllElement>;

        if (!isMarked && format == "header") {
          newBlock = {
            type: "header",
            level,
          };
        } else if (!isMarked) {
          newBlock = {
            type: format,
          };
        } else {
          newBlock = {
            type: "paragraph",
          };
        }

        Transforms.setNodes(editor, newBlock);
      }}
    >
      {children}
    </button>
  );
}

function blockCheck(editor: BaseEditor, type: string, level?: number) {
  let { selection } = editor;
  if (!selection) return false;

  // get all node with the selected format
  let blockList = Array.from(
    SlateEditor.nodes(editor, {
      at: SlateEditor.unhangRange(editor, selection),
      match: (n) => {
        if (!SlateEditor.isBlock(editor, n)) return false;
        // special case for header
        if (n.type == "header") {
          return n.type ? n.type == type && n.level == level : false;
        } else {
          return n.type ? n.type == type : false;
        }
      },
    })
  );

  return blockList.length > 0;
}

// List
function AddListButton({ mode }: { mode: "wrap" | "unwrap" }) {
  let editor = useSlate();

  return (
    <button
      onMouseDown={(mouseEvent) => {
        mouseEvent.preventDefault();
        if (mode == "wrap") {
          addList(editor);
        } else {
          removeList(editor);
        }
      }}
    >
      addList
    </button>
  );
}

function getCurrentNodes(
  editor: BaseEditor,
  location?: Location | Span,
  match?: NodeMatch<Node>
) {
  let selection = editor.selection;
  if (!selection) return [];

  let currentLocation = SlateEditor.unhangRange(editor, selection);
  let matchFunction: NodeMatch<Node> = (n) => SlateEditor.isBlock(editor, n);

  return Array.from(
    SlateEditor.nodes(editor, {
      at: location || currentLocation,
      match: match || matchFunction,
    })
  );
}

function addList(editor: BaseEditor) {
  console.log(
    JSON.stringify(editor.selection?.anchor) ==
      JSON.stringify(editor.selection?.focus)
  );

  let nodes = getCurrentNodes(editor);

  // check if nodes is already list
  let firstChild = nodes[0][0];

  if (SlateEditor.isBlock(editor, firstChild)) {
    if (firstChild.type !== "list") {
      Transforms.setNodes(editor, { type: "listItem" });
      Transforms.wrapNodes(editor, { type: "list", children: [] });
    } else {
      Transforms.wrapNodes(editor, { type: "listItemList", children: [] });
    }
  }

  // console.log(nodes)
}

function removeList(editor: BaseEditor) {
  let nodes = getCurrentNodes(editor);

  // if in a list
  let firstChild = nodes[0][0];

  if (SlateEditor.isBlock(editor, firstChild) && firstChild.type == "list") {
    nodes
      .slice()
      .reverse()
      .forEach((e) => {
        let currentItem = e;
        let parentItem = Node.parent(editor, currentItem[1]);
        // let parentItem = [Node.parent(editor,e[1]), e[1].slice(0,-1)]

        if (
          SlateEditor.isBlock(editor, currentItem[0]) &&
          currentItem[0].type == "listItem"
        ) {
          // if parentNode = list then convert to paragraph
          if (
            SlateEditor.isBlock(editor, parentItem) &&
            parentItem.type == "list"
          ) {
            Transforms.setNodes(
              editor,
              { type: "paragraph" },
              { at: currentItem[1] }
            );
          }

          // remove one from node
          console.log(currentItem);
          Transforms.liftNodes(editor, { at: currentItem[1] });
        }
      });
  }
}

// Render
const renderElement = (props: RenderElementProps) => {
  switch (props.element.type) {
    case "header":
      const HeaderTag = `h${props.element.level}`;
      return <HeaderTag {...props.attributes}>{props.children}</HeaderTag>;
    case "paragraph":
      return <p {...props.attributes}>{props.children}</p>;
    case "list":
      return <ul {...props.attributes}>{props.children}</ul>;
    case "listItem":
      return <li {...props.attributes}>{props.children}</li>;
    case "listItemList":
      return <ul {...props.attributes}>{props.children}</ul>;
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
