import { I18nextProvider, useTranslation } from "react-i18next";
import { LexicalComposer } from "@lexical/react/LexicalComposer";

import { LexicalEditor } from "./components/LexicalEditor";
import exampleTheme from "./components/LexicalEditor/Theme/theme";
import "./components/LexicalEditor/Theme/theme.css";
import PlaygroundNodes from "./nodes/playgroundNodes";

const onError = (error: any) => {
  console.error(error);
};

const initialConfig = {
  namespace: "MyEditor",
  exampleTheme,
  onError,
  nodes: [...PlaygroundNodes],
};

export const Editor = () => {
  const { i18n } = useTranslation();

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <I18nextProvider i18n={i18n}>
        <LexicalEditor />
      </I18nextProvider>
    </LexicalComposer>
  );
};
