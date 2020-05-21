import { uniq } from 'lodash';

export interface MissingPackages {
    hasMissing: boolean
    missing: number
    all: string[]
    dependencies: string[]
    devDependencies: string[]
}

export class Dependencies {
    protected dependencies: string[]    = [
        'reflect-metadata',
    ];
    protected devDependencies: string[] = [];

    add(...dependencies: string[]) {
        dependencies.forEach(name => {
            // (dev/dev) @@html-webpack-plugin  = @types/html-webpack-plugin / html-webpack-plugin
            // (dev,dep) @!jquery               = @types/jquery / jquery
            // (dep)     !inversify             = inversify
            // (dev)     inversify              = inversify

            if ( name.startsWith('@@') ) {
                this.push('devDependencies', '@types/' + name.slice(2));
                this.push('devDependencies', name.slice(2));
            } else if ( name.startsWith('@!') ) {
                this.push('devDependencies', '@types/' + name.slice(2));
                this.push('dependencies', name.slice(2));
            } else if ( name.startsWith('!') ) {
                this.push('dependencies', name.slice(1));
            } else {
                this.push('devDependencies',name);
            }
        });
        return this;
    }

    push(to: 'devDependencies' | 'dependencies', name: string) {
        if ( name.includes('@') && !name.startsWith('@') ) {
            name = name.split('@')[ 0 ];
        }
        this[ to ].push(name);
    }

    getAll() {return uniq([].concat(this.dependencies).concat(this.devDependencies)); }

    // @todo temporary
    get() {return uniq(this.dependencies);}

    getDev() {return uniq(this.devDependencies);}

    getMissingPackages(installedPackages:string[]): MissingPackages {
        let missingPackages: string[] = [];
        for ( let name of this.getAll() ) {
            if ( !installedPackages.includes(name) ) {
                missingPackages.push(name);
            }
        }
        let dependencies    = missingPackages.filter(name => this.get().includes(name));
        let devDependencies = missingPackages.filter(name => this.getDev().includes(name));

        return {
            hasMissing: missingPackages.length > 0,
            missing   : missingPackages.length,
            all       : missingPackages,
            dependencies,
            devDependencies,
        };
    }
}
