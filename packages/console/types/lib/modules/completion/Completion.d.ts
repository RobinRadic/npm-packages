/// <reference types="node" />
import { EventEmitter } from 'events';
/**
 * Copy/paste from Omelette (0.4.4), converted to TS
 * Also includes https://github.com/f/omelette/pull/14
 * @copyright Fatih Kadir Akın <fka@fatihak.in>
 * @license MIT
 */
export declare class Completion extends EventEmitter {
    private compgen;
    private install;
    private installFish;
    private isDebug;
    private fragment;
    private line;
    private word;
    private HOME;
    private SHELL;
    private program;
    private programs;
    private fragments;
    private shell;
    constructor();
    setProgram(programs: any): any;
    setFragments(): void;
    generate(): never;
    reply(words: any): never;
    tree(objectTree: any): this;
    generateCompletionCode(): any;
    generateCompletionCodeFish(): any;
    generateTestAliases(): string;
    checkInstall(): never;
    getActiveShell(): "bash" | "zsh" | "fish";
    getDefaultShellInitFile(): any;
    setupShellInitFile(initFile: any): never;
    init(): never;
}
export declare function completion(...a: any[]): any;
