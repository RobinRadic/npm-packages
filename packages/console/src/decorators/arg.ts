///<reference types="@radic/console-output"/>

import { PositionalDefinition } from '../yargs';
import { reflectParams } from '@radic/shared';
import { app } from '@radic/core';

export interface ArgumentDefinition {
    index: number,
    name: string,
    variadic: boolean,
    required: boolean,
    type: string,
    description: string,
    defaultValue: any,
    options: PositionalDefinition
}

export type ArgumentDefinitions = Array<ArgumentDefinition>



export function arg(description: string, required:boolean=false, options: PositionalDefinition = {}): ParameterDecorator {
    return (Target, propertyKey, parameterIndex) => {
        if ( !Reflect.hasMetadata('arguments', Target) ) {
            Reflect.defineMetadata('arguments', [], Target);
        }
        let args:ArgumentDefinitions       = Reflect.getMetadata('arguments', Target);
        let paramTypes = Reflect.getMetadata('design:paramtypes', Target, propertyKey);
        let reflect    = reflectParams(Target[ propertyKey ], true);

        const { name, variadic, defaultValue } = reflect[ parameterIndex ];

        let definition:ArgumentDefinition = {
            index: parameterIndex,
            name,
            variadic,
            defaultValue,
            type : paramTypes[ parameterIndex ].name.toLowerCase(),
            description,
            options,
            required,
        };
        args.push(definition);
    };
}
