import { expect } from "chai";
import { Kernel } from "inversify";
import * as inversifyVanillaJsHelpers from "../src/index";

describe("Register Helper", () => {

    it("Should allow to register a class", () => {

        let kernel = new Kernel();
        let register = inversifyVanillaJsHelpers.register(kernel);

        class Ninja {}
        register("Ninja", Ninja);
        expect(true).to.eql(true);
        // TODO

    });

    it("Should allow to register a class using itself as identifier", () => {
        // TODO
    });

    it("Should allow to register a class constructor", () => {
        // TODO
    });

    it("Should allow to register a constant value", () => {
        // TODO
    });

    it("Should allow to register a dynamic value", () => {
        // TODO
    });

    it("Should allow to register a function", () => {
        // TODO
    });

    it("Should allow to register a auto factory", () => {
        // TODO
    });

    it("Should allow to register a factory", () => {
        // TODO
    });

    it("Should allow to register a provider", () => {
        // TODO
    });


});
