import { createContext } from "react";

export interface IToolbarContext {
  canUndo: boolean;
  canRedo: boolean;
  applyStyleText: (styles: Record<string, string>) => void;
}

const ToolbarContext = createContext<IToolbarContext>({
  canUndo: false,
  canRedo: false,
  applyStyleText: () => {},
});

export default ToolbarContext;
