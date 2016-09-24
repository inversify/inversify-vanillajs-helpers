import { expect } from "chai";
import * as inversifyVanillaJsHelpers from "../src/index";

describe("Entry Point", () => {

    it("Should export register and annotate helpers", () => {
        expect(typeof inversifyVanillaJsHelpers.annotate).to.eql("function");
        expect(typeof inversifyVanillaJsHelpers.register).to.eql("function");
        expect(typeof inversifyVanillaJsHelpers.registerSelf).to.eql("function");
        expect(typeof inversifyVanillaJsHelpers.registerConstructor).to.eql("function");
        expect(typeof inversifyVanillaJsHelpers.registerConstantValue).to.eql("function");
        expect(typeof inversifyVanillaJsHelpers.registerDynamicValue).to.eql("function");
        expect(typeof inversifyVanillaJsHelpers.registerFunction).to.eql("function");
        expect(typeof inversifyVanillaJsHelpers.registerAutoFactory).to.eql("function");
        expect(typeof inversifyVanillaJsHelpers.registerFactory).to.eql("function");
        expect(typeof inversifyVanillaJsHelpers.registerProvider).to.eql("function");
    });

});
