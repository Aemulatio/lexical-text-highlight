import {Button} from "antd";
import {DownOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";


export const Highlighte = () => {
    const [id] = useState(localStorage.getItem('id'));

    const handleClick = () => {
        if (!id) return;
        const parentNode = document.getElementById((id));
        if (!parentNode) return;
        console.log(parentNode)

        const treeWalker = document.createTreeWalker(parentNode, NodeFilter.SHOW_TEXT);
        console.log(treeWalker)
        const allTextNodes = [];
        let currentNode = treeWalker.nextNode();
        while (currentNode) {
            allTextNodes.push(currentNode);
            currentNode = treeWalker.nextNode();
        }
        console.log("all nodes: ", allTextNodes)

        if (!CSS.highlights) {
            console.log("NO API :(");
            return;
        }

        CSS.highlights.clear();

        const strs = ['lorem', 'maecenas']
        // const str = 'lorem';

        const ranges = strs.flatMap(str => {
                return allTextNodes
                    .map((el) => {
                        return {el, text: el?.textContent?.toLowerCase()};
                    })
                    .map(({text, el}) => {
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
        const searchResultsHighlight = new Highlight(...ranges.flat(1));

        // Register the Highlight object in the registry.
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
