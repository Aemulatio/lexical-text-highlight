import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, TextFormatType } from "lexical";

interface UseUpdateStateEditorTypes {
  typeBlock: TextFormatType;
}

export const useUpdateStateEditor = ({
  typeBlock,
}: UseUpdateStateEditorTypes) => {
  const [editor] = useLexicalComposerContext();
  const [selectBlock, setSelectBlock] = useState<boolean | string | null>(null);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          setSelectBlock(selection.hasFormat(typeBlock));
        }
      });
    });
  }, [editor]);

  return { selectBlock };
};
