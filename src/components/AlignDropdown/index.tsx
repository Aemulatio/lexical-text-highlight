import { useContext, useMemo } from "react";
import {
  UnorderedListOutlined,
  OrderedListOutlined,
  AppstoreAddOutlined,
  DownOutlined,
} from "@ant-design/icons";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button, Dropdown } from "antd";

import s from "./styles.module.css";

export const AlignDropdown = () => {
  const [editor] = useLexicalComposerContext();

  const formatBulletList = () => {
    (editor as any).dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
  };

  const formatNumericList = () => {
    (editor as any).dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
  };

  const items = useMemo(
    () => [
      {
        label: (
          <Button type="link" onClick={formatBulletList}>
            <UnorderedListOutlined />
            &nbsp;Unordered List
          </Button>
        ),
        key: "bullet",
      },
      {
        label: (
          <Button type="link" onClick={formatNumericList}>
            <OrderedListOutlined />
            &nbsp;Numbered List
          </Button>
        ),
        key: "numeric",
      },
    ],
    []
  );

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <Button type="link" className={s.button}>
        <AppstoreAddOutlined className={s.add} />
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};
