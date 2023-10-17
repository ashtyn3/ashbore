import types from "@babel/types";

export type func_args = Array<
  | types.Expression
  | types.SpreadElement
  | types.JSXNamespacedName
  | types.ArgumentPlaceholder
>;

declare global {
  namespace JSX {
    interface Element {
      [elemName: string]: any;
    }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
