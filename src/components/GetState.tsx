import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {Button} from "antd";


export const GetState = () => {
    const [editor] = useLexicalComposerContext();
    const handleClick = () => console.log(editor.getEditorState().toJSON())
    return <Button onClick={handleClick}>STATE</Button>
}
