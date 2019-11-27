import { NodeArray } from './collections';
export class BaseNode {
    constructor() {
        this.children = [];
        this.collectionClass = NodeArray;
    }
    setIndex(index) {
        this._index = index;
        return this;
    }
    setCollectionClass(collectionClass) {
        this.collectionClass = collectionClass;
        return this;
    }
    newCollection(items = []) {
        return new (this.collectionClass)(...items);
    }
    hasChild(child) {
        return this.children.filter(c => c === child).length > 0;
    }
    addChild(child) {
        if (this.hasChild(child)) {
            return this;
        }
        child.setIndex(this.children.push(child) - 1);
        child.setParent(this);
        return this;
    }
    setParent(parent) {
        if (this.parent === parent) {
            return this;
        }
        if (this.hasParent() && this.getParent().hasChild(this)) {
            this.getParent().removeChild(this);
        }
        this.parent = parent;
        if (parent) {
            parent.addChild(this);
        }
        return this;
    }
    removeChild(childToRemove) {
        Object.entries(this.children).forEach(([key, child]) => {
            if (child == childToRemove) {
                delete this.children[key];
            }
        });
        let index = this.children.findIndex(node => node === childToRemove);
        if (index) {
            this.children.splice(index);
        }
        // this.children = Array.from(this.children.values());
        childToRemove.setParent();
        return this;
    }
    getAllDescendants() {
        let descendants = [];
        for (let child of this.getChildren()) {
            descendants.push(child);
            descendants.push(...child.getAllDescendants());
        }
        return this.newCollection(descendants);
    }
    removeAllChildren() {
        this.children = [];
        return this;
    }
    root() {
        let parent;
        let node = this;
        while (parent = node.getParent()) {
            node = parent;
        }
        return node;
    }
    getAncestors() {
        let parents = [];
        let parent;
        let node = this;
        while (parent = node.getParent()) {
            parents.unshift(parent);
            node = parent;
        }
        return this.newCollection(parents);
    }
    getDepth() {
        if (this.isRoot()) {
            return 0;
        }
        return this.getParent().getDepth() + 1;
    }
    getSize() {
        let size = 1;
        for (let child of this.children) {
            size += child.getSize();
        }
        return size;
    }
    removeParentFromChildren() {
        for (const child of this.children) {
            child.setParent(null);
        }
        return this;
    }
    setChildren(children) {
        this.removeParentFromChildren();
        this.children = [];
        for (const child of children) {
            this.addChild(child);
        }
        return undefined;
    }
    isChild() { return this.getParent() !== undefined; }
    isLeaf() { return this.children.length === 0; }
    isRoot(matchType = false) {
        if (!matchType) {
            return this.getParent() === undefined;
        }
        if (this.hasMatchingParentType()) {
            return false;
        }
        return true;
    }
    hasMatchingParentType() {
        if (this.getParent() !== undefined) {
            if (this.getParent() instanceof this.constructor || this.getParent().constructor.name === this.constructor.name) {
                return true;
            }
        }
        return false;
    }
    hasParent() { return this.parent !== undefined; }
    hasChildren() { return Array.isArray(this.children) && this.children.length > 0; }
    getAncestorsAndSelf() { return this.getAncestors().concat([this]); }
    getChildren() { return this.newCollection(this.children); }
    getHeight() { return this.getAncestors().length; }
    getLevel() { return this.getAncestors().length; }
    getNeighbors() { return this.getParent().getChildren().without([this]); }
    getNeighborsAndSelf() { return this.getParent().getChildren(); }
    getParent() { return this.parent; }
    isFirst() { return this.hasPrevious() === false; }
    isLast() { return this.hasNext() === false; }
    hasAncestor() { return this.hasParent() && this.getParent().hasParent(); }
    hasSiblings() { return this.hasParent() && this.getParent().getChildren().without([this]).isNotEmpty(); }
    hasPrevious() { return this.getNeighborsAndSelf().hasItem(this.getIndex() - 1); }
    hasNext() { return this.getNeighborsAndSelf().hasItem(this.getIndex() + 1); }
    getNext() { return this.getNeighborsAndSelf().item(this.getIndex() + 1); }
    getPrevious() { return this.getNeighborsAndSelf().item(this.getIndex() - 1); }
    getIndex() {
        if (this._index !== undefined) {
            return this._index;
        }
        if (this.hasParent()) {
            this.getNeighborsAndSelf().findIndex(node => node === this);
        }
        return 0;
    }
    _getObjectExcludeKeys() {
        return ['getChildren', 'getAncestors', 'getAncestorsAndSelf', 'getNeighbors', 'getNeighborsAndSelf', 'getParent', 'getNext', 'getPrevious', 'root', 'getAllDescendants'];
    }
    toObject() {
        let object = {};
        Object
            .keys(this)
            .filter(key => this._getObjectExcludeKeys().includes(key) === false)
            .filter(key => key.startsWith('remove') === false)
            .filter(key => key.startsWith('add') === false)
            .filter(key => typeof this[key] === 'function')
            .forEach(key => {
            try {
                object[key] = this[key]();
            }
            catch (e) {
            }
        });
        return object;
    }
}
export class Node extends BaseNode {
    constructor(_root) {
        super();
        this._root = _root;
        this.setParent(_root);
    }
    root() {
        return this._root;
    }
}
export class RootNode extends BaseNode {
    constructor() {
        super(...arguments);
        this.nodeClass = Node;
        this.collectionClass = NodeArray;
    }
    createNode() {
        const node = new this.nodeClass(this);
        node.setCollectionClass(this.collectionClass);
        return node;
    }
}
export class ValuedNode extends BaseNode {
    constructor(value) {
        super();
        this.value = value;
    }
    setValue(value) {
        this.value = value;
        return this;
    }
    getValue() {
        return this.value;
    }
}
//# sourceMappingURL=nodes.js.map