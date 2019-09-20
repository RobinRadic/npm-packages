import { INode } from './interfaces';
import { NodeArray } from './collections';
export declare abstract class BaseNode<C extends NodeArray<INode> = NodeArray<INode>> implements INode {
    protected children: INode[];
    protected parent?: INode;
    protected collectionClass: any;
    protected _index?: number;
    setIndex(index: number): this;
    setCollectionClass(collectionClass: any): this;
    newCollection(items?: INode[]): C;
    hasChild(child: INode): boolean;
    addChild(child: INode): this;
    setParent(parent?: INode): this;
    removeChild(childToRemove: INode): this;
    getAllDescendants(): C;
    removeAllChildren(): this;
    root(): INode;
    getAncestors(): C;
    getDepth(): number;
    getSize(): number;
    removeParentFromChildren(): this;
    setChildren(children: INode[]): this;
    isChild(): boolean;
    isLeaf(): boolean;
    isRoot(matchType?: boolean): boolean;
    hasMatchingParentType(): boolean;
    hasParent(): boolean;
    hasChildren(): boolean;
    getAncestorsAndSelf(): C;
    getChildren(): C;
    getHeight(): number;
    getLevel(): number;
    getNeighbors(): C;
    getNeighborsAndSelf(): C;
    getParent(): this;
    isFirst(): boolean;
    isLast(): boolean;
    hasAncestor(): boolean;
    hasSiblings(): boolean;
    hasPrevious(): boolean;
    hasNext(): boolean;
    getNext(): INode | undefined;
    getPrevious(): INode | undefined;
    getIndex(): number;
    protected _getObjectExcludeKeys(): string[];
    toObject(): any;
}
export declare class Node<C extends NodeArray = NodeArray> extends BaseNode<C> implements INode {
    protected _root: INode;
    constructor(_root: INode);
    root(): INode;
}
export declare class RootNode<C extends NodeArray<INode> = NodeArray<INode>> extends BaseNode<C> implements INode {
    nodeClass: any;
    collectionClass: any;
    createNode(): any;
}
export declare class ValuedNode<T extends any = any> extends BaseNode {
    protected value: T;
    constructor(value: T);
    setValue(value: T): this;
    getValue(): T;
}
