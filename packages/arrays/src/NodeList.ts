import List   from './List';
import { INode } from './interfaces';

export default  class NodeList<T extends INode = INode> extends List<T> {

    depth(depth: number) {return this.filter(item => item.getDepth() === depth);}

    root() {return this.filter(item => item.isRoot);}

}
