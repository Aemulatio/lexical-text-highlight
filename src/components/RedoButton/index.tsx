import { useContext } from "react";
import { RedoOutlined } from "@ant-design/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button } from "antd";
import { REDO_COMMAND } from "lexical";

import ToolbarContext from "../../context/ToolbarContext";
import { IS_APPLE } from "../../environments";

const RedoButton = () => {
  const [editor] = useLexicalComposerContext();
  const { canRedo } = useContext<any>(ToolbarContext);

  return (
    <Button
      type="link"
      disabled={!canRedo}
      onClick={() => {
        editor.dispatchCommand(REDO_COMMAND, undefined);
      }}
      title={
        IS_APPLE
          ? `toolbar:redoButton.Title (⌘Y)`
          : `toolbar:redoButton.Title (Ctrl+Y)`
      }
      className="toolbar-item"
    >
      <RedoOutlined />
    </Button>
  );
};

export default RedoButton;
