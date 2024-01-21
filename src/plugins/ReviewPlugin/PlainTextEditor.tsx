import {EditorState, KEY_ESCAPE_COMMAND, LexicalEditor} from "lexical";
import CommentEditorTheme from "../../themes/CommentEditorTheme.ts";
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import {PlainTextPlugin} from "@lexical/react/LexicalPlainTextPlugin";
import ContentEditable from "../../ui/ContentEditable.tsx";
import Placeholder from "../../ui/Placeholder.tsx";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin";
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin";
import {AutoFocusPlugin} from "@lexical/react/LexicalAutoFocusPlugin";
import {ClearEditorPlugin} from "@lexical/react/LexicalClearEditorPlugin";
import {EditorRefPlugin} from "@lexical/react/LexicalEditorRefPlugin";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {useEffect} from "react";


export const PlainTextEditor = ({
                                    className,
                                    autoFocus,
                                    onEscape,
                                    onChange,
                                    editorRef,
                                    placeholder = 'Type a review...',
                                }: {
    autoFocus?: boolean;
    className?: string;
    editorRef?: { current: null | LexicalEditor };
    onChange: (editorState: EditorState, editor: LexicalEditor) => void;
    onEscape: (e: KeyboardEvent) => boolean;
    placeholder?: string;
}) => {
    const initialConfig = {
        namespace: 'Review',
        nodes: [],
        onError: (error: Error) => {
            throw error;
        },
        theme: CommentEditorTheme,
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="CommentPlugin_CommentInputBox_EditorContainer">
                <PlainTextPlugin
                    contentEditable={<ContentEditable className={className}/>}
                    placeholder={<Placeholder>{placeholder}</Placeholder>}
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <OnChangePlugin onChange={onChange}/>
                <HistoryPlugin/>
                {autoFocus !== false && <AutoFocusPlugin/>}
                <EscapeHandlerPlugin onEscape={onEscape}/>
                <ClearEditorPlugin/>
                {editorRef !== undefined && <EditorRefPlugin editorRef={editorRef}/>}
            </div>
        </LexicalComposer>
    );
}

function EscapeHandlerPlugin({
                                 onEscape,
                             }: {
    onEscape: (e: KeyboardEvent) => boolean;
}): null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(
            KEY_ESCAPE_COMMAND,
            (event: KeyboardEvent) => {
                return onEscape(event);
            },
            2,
        );
    }, [editor, onEscape]);

    return null;
}
