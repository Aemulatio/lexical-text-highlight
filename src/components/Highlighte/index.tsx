import {Button} from "antd";
import {DownOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
// import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";


export const Highlighte = () => {
    const [id] = useState(localStorage.getItem('id'));
    // const [editor] = useLexicalComposerContext();

    const handleClick = () => {
        // console.log(editor.getEditorState().toJSON())
        if (!id) return;
        const parentNode = document.getElementById((id));
        if (!parentNode) return;
        console.log(parentNode)

        const treeWalker = document.createTreeWalker(parentNode, NodeFilter.SHOW_TEXT);
        console.log(treeWalker)
        const allTextNodes: Node[] = [];
        let currentNode = treeWalker.nextNode();
        while (currentNode) {
            allTextNodes.push(currentNode);
            currentNode = treeWalker.nextNode();
        }
        console.log("all nodes: ", allTextNodes)

        // @ts-ignore
        if (!CSS.highlights) {
            console.log("NO API :(");
            return;
        }

        // @ts-ignore
        CSS.highlights.clear();

        const strs = ['lorem', 'maecenas']
        // const str = 'lorem';

        const ranges = strs.flatMap(str => {
                return allTextNodes
                    .map((el) => {
                        return {el, text: el?.textContent?.toLowerCase()};
                    })
                    .map(({text, el}) => {
                        if (!text) return;
                        const indices = [];
                        let startPos = 0;
                        while (startPos < text?.length) {
                            const index = text?.indexOf(str, startPos);
                            if (index === -1) break;
                            indices.push(index);
                            startPos = index + str.length;
                        }

                        // Create a range object for each instance of
                        // str we found in the text node.
                        return indices.map((index) => {
                            const range = new Range();
                            range.setStart(el, index);
                            range.setEnd(el, index + str.length);
                            return range;
                        });
                    });
            }
        )

        console.log('ranges: ', ranges)
        console.log('ranges: 0', ranges.flat(1))
        console.log('ranges: 0 spread', ...ranges.flat(1))
        // console.log('ranges: 0', ...ranges.flat(1).filter(f => f.length !== 0))
        // Create a Highlight object for the ranges.
        const searchResultsHighlight = new Highlight(...ranges.flat(1) as Range[]);

        // Register the Highlight object in the registry.
        // @ts-ignore
        CSS.highlights.set("search-results", searchResultsHighlight);

    }


    useEffect(() => {
        console.log('Id: ', id)
        if (!id) return;
        console.log(id)
        console.log(document.getElementById((id)))

    }, [id !== null]);

    return <Button onClick={handleClick}><DownOutlined/></Button>
}
