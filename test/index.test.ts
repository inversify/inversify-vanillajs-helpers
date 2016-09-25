import { expect } from "chai";
import { helpers } from "../src/index";

describe("Entry Point", () => {

    it("Should export register and annotate helpers", () => {
        expect(typeof helpers.annotate).to.eql("function");
        expect(typeof helpers.register).to.eql("function");
        expect(typeof helpers.registerSelf).to.eql("function");
        expect(typeof helpers.registerConstructor).to.eql("function");
        expect(typeof helpers.registerConstantValue).to.eql("function");
        expect(typeof helpers.registerDynamicValue).to.eql("function");
        expect(typeof helpers.registerFunction).to.eql("function");
        expect(typeof helpers.registerAutoFactory).to.eql("function");
        expect(typeof helpers.registerFactory).to.eql("function");
        expect(typeof helpers.registerProvider).to.eql("function");
    });

});
