import { BoldOutlined } from "@ant-design/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button } from "antd";
import { FORMAT_TEXT_COMMAND } from "lexical";

import { IS_APPLE } from "../../../environments";

import { useUpdateStateEditor } from "../../../hooks";

import s from "../styles.module.css";

const BoldButton = () => {
  const [editor] = useLexicalComposerContext();
  const { selectBlock } = useUpdateStateEditor({ typeBlock: "bold" });

  return (
    <Button
      className={s.button}
      type={selectBlock ? "primary" : "link"}
      onClick={() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
      }}
      title={IS_APPLE ? "Жирный (⌘B)" : `Жирный (Ctrl + B)`}
      aria-label={`Сделать жирным ${IS_APPLE ? "⌘B" : "Ctrl+B"}`}
    >
      <BoldOutlined />
    </Button>
  );
};

export default BoldButton;
