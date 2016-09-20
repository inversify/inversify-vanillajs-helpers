import { expect } from "chai";
import * as inversifyVanillajsHelpers from "../src/index";

describe("inversify-vanillajs-helpers", () => {

    it("Should export register and annotate helpers", () => {
        expect(typeof inversifyVanillajsHelpers.annotate).to.eql("function");
        expect(typeof inversifyVanillajsHelpers.register).to.eql("function");
        expect(typeof inversifyVanillajsHelpers.registerSelf).to.eql("function");
        expect(typeof inversifyVanillajsHelpers.registerConstructor).to.eql("function");
        expect(typeof inversifyVanillajsHelpers.registerConstantValue).to.eql("function");
        expect(typeof inversifyVanillajsHelpers.registerDynamicValue).to.eql("function");
        expect(typeof inversifyVanillajsHelpers.registerFunction).to.eql("function");
        expect(typeof inversifyVanillajsHelpers.registerAutoFactory).to.eql("function");
        expect(typeof inversifyVanillajsHelpers.registerFactory).to.eql("function");
        expect(typeof inversifyVanillajsHelpers.registerProvider).to.eql("function");
    });

    it("Should allow to annotate class");
    it("Should allow to register a class");
    it("Should allow to register a class using itself as identifier");
    it("Should allow to register a class constructor");
    it("Should allow to register a constant value");
    it("Should allow to register a dynamic value");
    it("Should allow to register a function");
    it("Should allow to register a auto factory");
    it("Should allow to register a factory");
    it("Should allow to register a provider");

});
