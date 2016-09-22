import { expect } from "chai";
import { Kernel } from "inversify";
import * as inversifyVanillaJsHelpers from "../src/index";

describe("inversify-vanillajs-helpers", () => {

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

    it("Should allow to annotate class using ServiceIdentifiers", () => {

        class Katana {
            public name: string;
            public constructor() {
                this.name = "Katana";
            }
        }

        class Shuriken {
            public name: string;
            public constructor() {
                this.name = "Shuriken";
            }
        }

        class Ninja {
            public katana: Katana;
            public shuriken: Shuriken;
            public constructor(katana: Katana, shuriken: Shuriken) {
                this.katana = katana;
                this.shuriken = shuriken;
            }
        }

        let kernel = new Kernel();
        inversifyVanillaJsHelpers.annotate(Katana);
        inversifyVanillaJsHelpers.annotate(Shuriken);
        inversifyVanillaJsHelpers.annotate(Ninja, [ "Katana", "Shuriken" ]);
        kernel.bind<Katana>("Katana").to(Katana);
        kernel.bind<Shuriken>("Shuriken").to(Shuriken);
        kernel.bind<Ninja>("Ninja").to(Ninja);

        let ninja = kernel.get<Ninja>("Ninja");
        expect(ninja.katana.name).to.eql("Katana");
        expect(ninja.shuriken.name).to.eql("Shuriken");

    });

    it("Should allow to annotate class using Symbols", () => {

        class Ninja {}

        inversifyVanillaJsHelpers.annotate(
            Ninja,
            [
                Symbol("ThrowableWeapon"),
                Symbol("NotTrowableWeapon")
            ]
        );

    });

    it("Should allow to annotate class using Classes", () => {

        class Ninja {}
        class ThrowableWeapon {}
        class NotTrowableWeapon {}

        inversifyVanillaJsHelpers.annotate(
            Ninja,
            [
                NotTrowableWeapon,
                ThrowableWeapon
            ]
        );

    });

    it("Should allow to annotate class using BasicInjection", () => {

        class Ninja {}

        inversifyVanillaJsHelpers.annotate(
            Ninja,
            [
                { type: "ThrowableWeapon" },
                { type: "NotTrowableWeapon" }
            ]
        );

    });

    it("Should allow to annotate class using NamedInjection", () => {

        class Ninja {}

        inversifyVanillaJsHelpers.annotate(
            Ninja,
            [
                { named: "NotThrowable", type: "Weapon" },
                { named: "Throwable", type: "Weapon" }
            ]
        );

    });

    it("Should allow to annotate class using TaggedInjection", () => {

        class Ninja {}

        inversifyVanillaJsHelpers.annotate(
            Ninja,
            [
                { tagged: { key: "NotThrowable", val: false }, type: "Weapon" },
                { tagged: { key: "Throwable", val: false }, type: "Weapon" }
            ]
        );

    });

    it("Should allow to register a class", () => {
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
