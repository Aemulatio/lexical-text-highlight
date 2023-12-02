import { ItalicOutlined } from "@ant-design/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button } from "antd";
import { FORMAT_TEXT_COMMAND } from "lexical";

import { IS_APPLE } from "../../../environments";

import { useUpdateStateEditor } from "../../../hooks";

import s from "../styles.module.css";

const ItalicButton = () => {
  const [editor] = useLexicalComposerContext();
  const { selectBlock } = useUpdateStateEditor({ typeBlock: "italic" });

  return (
    <Button
      className={s.button}
      type={selectBlock ? "primary" : "link"}
      onClick={() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
      }}
      title={IS_APPLE ? "Курсив (⌘B)" : `Курсив (Ctrl + B)`}
    >
      <ItalicOutlined />
    </Button>
  );
};

export default ItalicButton;
