export interface INode {
    setCollectionClass(collectionClass: any): this;
    setIndex(index: number): this;
    hasChild(child: INode): boolean;
    addChild(child: INode): this;
    removeChild(child: INode): this;
    removeAllChildren(): this;
    getChildren(): INode[];
    getAllDescendants(): INode[];
    setChildren(children: INode[]): this;
    removeParentFromChildren(): this;
    setParent(parent?: INode): this;
    getParent(): INode;
    getAncestors(): INode[];
    getAncestorsAndSelf(): INode[];
    getNeighbors(): INode[];
    getNeighborsAndSelf(): INode[];
    isLeaf(): boolean;
    isRoot(): boolean;
    isChild(): boolean;
    root(): INode;
    getDepth(): number;
    getHeight(): number;
    getSize(): number;
    isFirst(): boolean;
    isLast(): boolean;
    hasAncestor(): boolean;
    hasChildren(): boolean;
    hasMatchingParentType(): boolean;
    hasParent(): boolean;
    hasSiblings(): boolean;
    hasPrevious(): boolean;
    hasNext(): boolean;
    getNext(): INode | undefined;
    getPrevious(): INode | undefined;
    getIndex(): number;
}
export interface Visitor {
    enter?(node: INode): any;
    leave(node: INode): any;
}
