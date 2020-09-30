interface RegistryItem {
    id: string
}

class Registry<T extends RegistryItem> {
    items: T[];

    add(type: T, override = false) {
        if ( this.has(type.id) ) {
            if ( !override ) {
                throw new Error(`Site type already exists`);
            }
            let index = this.items.findIndex(t => t.id === type.id);
            this.items.splice(index);
        }
        this.items.push(type);
    }

    get(id) {return this.items.find(t => t.id === id); }

    has(id) {return this.get(id) !== undefined;}

    all() {return this.items; }

    ids() {return this.items.map(t => t.id);}

    pluck<TT extends keyof T>(key: TT): TT[] {return this.items.map(t => t[ key ]) as any;}
}


class TemplateWriter {

}

class TemplateManager extends Registry<Template> {
    templates: Template[];
}

abstract class Template implements RegistryItem {
    abstract get id(): string

    abstract get types(): string[]
}

class DefaultTemplate extends Template {
    id    = 'default';
    types = [ 'apache', 'nginx' ];
}

const templates = new TemplateManager();
templates.add(new DefaultTemplate());


interface SiteType {
    id: string
    name: string
}

class TypeManager extends Registry<SiteType> {

}


class ApacheType implements SiteType {
    public readonly id   = 'apache';
    public readonly name = 'Apache';
}

const types = new TypeManager();
types.add(new ApacheType);
types.pluck('name')[ 0 ];
types.all().map(t => t.id);
