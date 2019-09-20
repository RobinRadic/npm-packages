"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_typescript_1 = require("mocha-typescript");
var bootstrap_1 = require("./_support/bootstrap");
var chai_1 = require("chai");
var yeoman_test_1 = require("yeoman-test");
var path_1 = require("path");
bootstrap_1.bootstrap();
var AppTest = /** @class */ (function () {
    function AppTest() {
    }
    AppTest.before = function () {
        this.bar = {};
    };
    AppTest.prototype.before = function () {
        function Cmd() { }
        this.context = yeoman_test_1.run(path_1.join(__dirname, '../'))
            .withOptions({ foo: 'bar' })
            .withArguments(['abc-def'])
            .withPrompts({ a: false });
    };
    AppTest.prototype.prepare = function () {
        return { name: 'foobar', alias: 'foo' };
    };
    AppTest.prototype.testPrepareNameAndAlias = function () {
        var _a = this.prepare(), name = _a.name, alias = _a.alias;
        name.should.eq('foobar');
        alias.should.eq('foo');
        chai_1.assert.equal(name, 'foobar');
        chai_1.should().equal(alias, 'foo');
    };
    __decorate([
        mocha_typescript_1.context
    ], AppTest.prototype, "mocha", void 0);
    __decorate([
        mocha_typescript_1.test
    ], AppTest.prototype, "testPrepareNameAndAlias", null);
    __decorate([
        mocha_typescript_1.context
    ], AppTest, "mocha", void 0);
    AppTest = __decorate([
        mocha_typescript_1.suite
    ], AppTest);
    return AppTest;
}());
