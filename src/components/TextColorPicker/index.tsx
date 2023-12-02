import { useCallback, useContext } from "react";
import { FontColorsOutlined } from "@ant-design/icons";
import { Button, ColorPicker } from "antd";
import { Color } from "antd/es/color-picker";

import ToolbarContext from "../../context/ToolbarContext";

const TextColorPicker = () => {
  const { applyStyleText } = useContext<any>(ToolbarContext);

  const onFontColorSelect = useCallback(
    (_value: Color, hex: any) => {
      applyStyleText({ color: hex });
    },
    [applyStyleText]
  );

  return (
    <ColorPicker onChange={onFontColorSelect}>
      <Button type="link">
        <FontColorsOutlined />
      </Button>
    </ColorPicker>
  );
};

export default TextColorPicker;
