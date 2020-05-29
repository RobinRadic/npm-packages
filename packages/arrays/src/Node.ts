import NodeList from './NodeList';
import { INode }    from './interfaces';


export default class Node<C extends NodeList = NodeList> implements INode {
    protected children: INode[]                              = [];
    protected parent?: INode;
    protected listClass:any = NodeList as any
    protected _index?: number

    public setIndex(index: number) {
        this._index = index
        return this;
    }

    public setListClass(collectionClass) {
        this.listClass = collectionClass;
        return this;
    }

    public newList(items: INode[] = []): C {
        return new (this.listClass)(...items as any) as any;
    }

    public hasChild(child: INode) {
        return this.children.filter(c => c === child).length > 0
    }

    public addChild(child: INode): this {
        if ( this.hasChild(child) ) {
            return this;
        }
        child.setIndex(this.children.push(child) - 1)
        child.setParent(this);
        return this;
    }

    public setParent(parent?: INode): this {
        if ( this.parent === parent ) {
            return this;
        }
        if ( this.hasParent() && this.getParent().hasChild(this) ) {
            this.getParent().removeChild(this);
        }
        this.parent = parent;
        if ( parent ) {
            parent.addChild(this);
        }
        return this;
    }

    public removeChild(childToRemove: INode): this {
        Object.entries(this.children).forEach(([ key, child ]) => {
            if ( child == childToRemove ) {
                delete this.children[ key ];
            }
        });
        let index = this.children.findIndex(node => node === childToRemove);
        if(index){
            this.children.splice(index)
        }
        // this.children = Array.from(this.children.values());
        childToRemove.setParent();
        return this;
    }

    public getAllDescendants(): C {
        let descendants = [];
        for ( let child of this.getChildren() ) {
            descendants.push(child);
            descendants.push(...child.getAllDescendants());
        }
        return this.newList(descendants);
    }

    public removeAllChildren(): this {
        this.children = [];
        return this;
    }

    public root(): this {
        let parent;
        let node = this;
        while ( parent = node.getParent() ) {
            node = parent;
        }
        return node;
    }

    public getAncestors(): C {
        let parents = [];
        let parent;
        let node    = this;
        while ( parent = node.getParent() ) {
            parents.unshift(parent);
            node = parent;
        }
        return this.newList(parents);
    }

    public getDepth(): number {
        if ( this.isRoot() ) {
            return 0;
        }
        return this.getParent().getDepth() + 1;
    }

    public getSize(): number {
        let size = 1;
        for ( let child of this.children ) {
            size += child.getSize();
        }
        return size;
    }

    public removeParentFromChildren(): this {
        for ( const child of this.children ) {
            child.setParent(null);
        }
        return this;
    }

    public setChildren(children: INode[]): this {
        this.removeParentFromChildren();
        this.children = [];
        for ( const child of children ) {
            this.addChild(child);
        }
        return undefined;
    }

    public isChild(): boolean { return this.getParent() !== undefined; }

    public isLeaf(): boolean { return this.children.length === 0; }

    public isRoot(matchType: boolean = false): boolean {
        if ( ! matchType ) {
            return this.getParent() === undefined;
        }
        if ( this.hasMatchingParentType() ) {
            return false;
        }
        return true;
    }

    public hasMatchingParentType() {
        if ( this.getParent() !== undefined ) {
            if ( this.getParent() instanceof this.constructor || this.getParent().constructor.name === this.constructor.name ) {
                return true
            }
        }
        return false
    }

    public hasParent(): boolean { return this.parent !== undefined}

    public hasChildren() { return Array.isArray(this.children) && this.children.length > 0; }

    public getAncestorsAndSelf(): C { return this.getAncestors().concat([ this as any ]) as any; }

    public getChildren(): C { return this.newList(this.children as any); }

    public getHeight(): number { return this.getAncestors().length; }

    public getLevel(): number { return this.getAncestors().length; }

    public getNeighbors(): C { return this.getParent().getChildren().without([ this ]); }

    public getNeighborsAndSelf(): C { return this.getParent().getChildren(); }

    public getParent(): this { return this.parent as any; }

    public isFirst(): boolean { return this.hasPrevious() === false}

    public isLast(): boolean { return this.hasNext() === false}

    public hasAncestor(): boolean { return this.hasParent() && this.getParent().hasParent()}

    public hasSiblings(): boolean { return this.hasParent() && this.getParent().getChildren().without([ this ]).isNotEmpty()}

    public hasPrevious(): boolean { return this.getNeighborsAndSelf().hasItem(this.getIndex() - 1) }

    public hasNext(): boolean { return this.getNeighborsAndSelf().hasItem(this.getIndex() + 1)}

    public getNext(): INode | undefined { return this.getNeighborsAndSelf().item(this.getIndex() + 1)}

    public getPrevious(): INode | undefined { return this.getNeighborsAndSelf().item(this.getIndex() - 1)}

    public getIndex(): number {
        if ( this._index !== undefined ) {
            return this._index;
        }
        if ( this.hasParent() ) {
            this.getNeighborsAndSelf().findIndex(node => node === this)
        }
        return 0;
    }

    protected _getObjectExcludeKeys(): string[] {
        return [ 'getChildren', 'getAncestors', 'getAncestorsAndSelf', 'getNeighbors', 'getNeighborsAndSelf', 'getParent', 'getNext', 'getPrevious', 'root', 'getAllDescendants' ]
    }

    public toObject() {
        let object: any = {}
        Object
            .keys(this)
            .filter(key => this._getObjectExcludeKeys().includes(key) === false)
            .filter(key => key.startsWith('remove') === false)
            .filter(key => key.startsWith('add') === false)
            .filter(key => typeof this[ key ] === 'function')
            .forEach(key => {
                try {
                    object[ key ] = this[ key ]()
                } catch ( e ) {

                }
            })
        return object;
    }

}
