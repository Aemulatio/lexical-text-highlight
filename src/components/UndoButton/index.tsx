import { useContext } from "react";
import { UndoOutlined } from "@ant-design/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button } from "antd";
import { UNDO_COMMAND } from "lexical";

import ToolbarContext from "../../context/ToolbarContext";
import { IS_APPLE } from "../../environments";

const UndoButton = () => {
  const [editor] = useLexicalComposerContext();
  const { canUndo } = useContext<any>(ToolbarContext);

  return (
    <Button
      type="link"
      disabled={!canUndo}
      onClick={() => {
        editor.dispatchCommand(UNDO_COMMAND, undefined);
      }}
      title={IS_APPLE ? `(⌘Z)` : `(Ctrl+Z)`}
      className="toolbar-item spaced"
    >
      <UndoOutlined />
    </Button>
  );
};

export default UndoButton;
