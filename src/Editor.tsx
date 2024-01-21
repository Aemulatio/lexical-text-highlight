import {I18nextProvider, useTranslation} from "react-i18next";
import {InitialConfigType, LexicalComposer} from "@lexical/react/LexicalComposer";

import {LexicalEditor} from "./components/LexicalEditor";
import exampleTheme from "./components/LexicalEditor/Theme/theme";
import "./components/LexicalEditor/Theme/theme.css";
import PlaygroundNodes from "./nodes/playgroundNodes";

const onError = (error: any) => {
    console.error(error);
};

const state = {
    "root": {
        "children": [
            {
                "children": [
                    {
                        "detail": 0,
                        "format": 1,
                        "mode": "normal",
                        "style": "",
                        "text": "Lorem ",
                        "type": "text",
                        "version": 1
                    },
                    {
                        "detail": 0,
                        "format": 3,
                        "mode": "normal",
                        "style": "",
                        "text": "ipsum ",
                        "type": "text",
                        "version": 1
                    },
                    {
                        "detail": 0,
                        "format": 1,
                        "mode": "normal",
                        "style": "",
                        "text": "do",
                        "type": "text",
                        "version": 1
                    },
                    {
                        "detail": 0,
                        "format": 3,
                        "mode": "normal",
                        "style": "",
                        "text": "lor",
                        "type": "text",
                        "version": 1
                    },
                    {
                        "detail": 0,
                        "format": 1,
                        "mode": "normal",
                        "style": "",
                        "text": " sit ",
                        "type": "text",
                        "version": 1
                    },
                    {
                        "detail": 0,
                        "format": 3,
                        "mode": "normal",
                        "style": "",
                        "text": "amet",
                        "type": "text",
                        "version": 1
                    },
                    {
                        "detail": 0,
                        "format": 1,
                        "mode": "normal",
                        "style": "",
                        "text": ", ",
                        "type": "text",
                        "version": 1
                    },
                    {
                        "detail": 0,
                        "format": 1,
                        "mode": "normal",
                        "style": "color: #305e9f;",
                        "text": "consectetur ",
                        "type": "text",
                        "version": 1
                    },
                    {
                        "detail": 0,
                        "format": 1,
                        "mode": "normal",
                        "style": "",
                        "text": "adipiscing elit",
                        "type": "text",
                        "version": 1
                    },
                    {
                        "detail": 0,
                        "format": 0,
                        "mode": "normal",
                        "style": "",
                        "text": ". Donec ac libero a tortor dignissim fringilla maximus a justo. Phasellus ",
                        "type": "text",
                        "version": 1
                    },
                    {
                        "detail": 0,
                        "format": 2,
                        "mode": "normal",
                        "style": "",
                        "text": "purus ",
                        "type": "text",
                        "version": 1
                    },
                    {
                        "detail": 0,
                        "format": 0,
                        "mode": "normal",
                        "style": "",
                        "text": "lacus, porta ut sem ",
                        "type": "text",
                        "version": 1
                    },
                    {
                        "detail": 0,
                        "format": 1,
                        "mode": "normal",
                        "style": "",
                        "text": "non",
                        "type": "text",
                        "version": 1
                    },
                    {
                        "detail": 0,
                        "format": 0,
                        "mode": "normal",
                        "style": "",
                        "text": ", fermentum congue ligula. Praesent faucibus urna ut imperdiet venenatis. Integer eu lacinia nisi. Sed id arcu ut eros eleifend elementum. Cras laoreet varius orci, ac dignissim magna semper quis. Nullam diam quam, vulputate sit amet sodales at, vehicula et nibh. Donec sit amet risus diam. Nam massa metus, vestibulum et neque ut, imperdiet ullamcorper purus. Morbi gravida, risus vulputate mollis rhoncus, mi odio pretium dui, sed condimentum velit augue elementum ante.",
                        "type": "text",
                        "version": 1
                    }
                ],
                "direction": "ltr",
                "format": "",
                "indent": 0,
                "type": "paragraph",
                "version": 1
            }
        ],
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "type": "root",
        "version": 1
    }
}

const initialConfig: InitialConfigType = {
    namespace: "MyEditor",
    theme: exampleTheme,
    onError,
    nodes: [...PlaygroundNodes],
    editorState: JSON.stringify(state),
};

export const Editor = () => {
    const {i18n} = useTranslation();

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <I18nextProvider i18n={i18n}>
                <LexicalEditor/>
            </I18nextProvider>
        </LexicalComposer>
    );
};
