import {CodeHighlightNode, CodeNode} from "@lexical/code";
import {HashtagNode} from "@lexical/hashtag";
import {AutoLinkNode, LinkNode} from "@lexical/link";
import {ListItemNode, ListNode} from "@lexical/list";
import {MarkNode} from "@lexical/mark";
import {OverflowNode} from "@lexical/overflow";
import {HorizontalRuleNode} from "@lexical/react/LexicalHorizontalRuleNode";
import {HeadingNode, QuoteNode} from "@lexical/rich-text";
import {TableCellNode, TableNode, TableRowNode} from "@lexical/table";
import {Class} from "utility-types";

import type {LexicalNode} from "lexical";
import {ReviewNode} from "./ReviewNode";

const PlaygroundNodes: Array<Class<LexicalNode>> = [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    HashtagNode,
    CodeHighlightNode,
    AutoLinkNode,
    LinkNode,
    OverflowNode,
    HorizontalRuleNode,
    MarkNode,
    ReviewNode
];

export default PlaygroundNodes;
