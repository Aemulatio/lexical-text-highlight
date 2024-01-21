import type {SerializedElementNode, Spread} from "lexical";

export type ReviewStatus = 'ok' | 'decline' | 'wait'


export type SerializedReviewNode = Spread<
    {
        ids: Array<string>;
    },
    SerializedElementNode
>;
