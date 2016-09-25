import { expect } from "chai";
import { Kernel } from "inversify";
import { helpers } from "../src/index";

describe("Annotate Helper", () => {

    it("Should allow to annotate class using strings", () => {

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
        helpers.annotate(Katana);
        helpers.annotate(Shuriken);
        helpers.annotate(Ninja, [ "Katana", "Shuriken" ]);
        kernel.bind<Katana>("Katana").to(Katana);
        kernel.bind<Shuriken>("Shuriken").to(Shuriken);
        kernel.bind<Ninja>("Ninja").to(Ninja);

        let ninja = kernel.get<Ninja>("Ninja");
        expect(ninja.katana.name).to.eql("Katana");
        expect(ninja.shuriken.name).to.eql("Shuriken");

    });

    it("Should allow to annotate class using Symbols", () => {

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

        let ThrowableWeaponId = Symbol("ThrowableWeapon");
        let NotTrowableWeaponId = Symbol("NotTrowableWeapon");
        let NinjaId = Symbol("Ninja");

        let kernel = new Kernel();
        helpers.annotate(Katana);
        helpers.annotate(Shuriken);
        helpers.annotate(Ninja, [NotTrowableWeaponId, ThrowableWeaponId]);
        kernel.bind<Katana>(NotTrowableWeaponId).to(Katana);
        kernel.bind<Shuriken>(ThrowableWeaponId).to(Shuriken);
        kernel.bind<Ninja>(NinjaId).to(Ninja);

        let ninja = kernel.get<Ninja>(NinjaId);
        expect(ninja.katana.name).to.eql("Katana");
        expect(ninja.shuriken.name).to.eql("Shuriken");

    });

    it("Should allow to annotate class using Classes", () => {

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
        helpers.annotate(Katana);
        helpers.annotate(Shuriken);
        helpers.annotate(Ninja, [ Katana, Shuriken ]);
        kernel.bind<Katana>(Katana).toSelf();
        kernel.bind<Shuriken>(Shuriken).toSelf();
        kernel.bind<Ninja>(Ninja).to(Ninja);

        let ninja = kernel.get<Ninja>(Ninja);
        expect(ninja.katana.name).to.eql("Katana");
        expect(ninja.shuriken.name).to.eql("Shuriken");

    });

    it("Should allow to annotate class using BasicInjection", () => {

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
        helpers.annotate(Katana);
        helpers.annotate(Shuriken);
        helpers.annotate(
            Ninja,
            [
                { type: "Katana" },
                { type: "Shuriken" }
            ]
        );
        kernel.bind<Katana>("Katana").to(Katana);
        kernel.bind<Shuriken>("Shuriken").to(Shuriken);
        kernel.bind<Ninja>("Ninja").to(Ninja);

        let ninja = kernel.get<Ninja>("Ninja");
        expect(ninja.katana.name).to.eql("Katana");
        expect(ninja.shuriken.name).to.eql("Shuriken");

    });

    it("Should allow to annotate class using NamedInjection", () => {

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
        helpers.annotate(Katana);
        helpers.annotate(Shuriken);
        helpers.annotate(
            Ninja,
            [
                { named: "not-throwable", type: "Weapon" },
                { named: "throwable", type: "Weapon" }
            ]
        );
        kernel.bind<Katana>("Weapon").to(Katana).whenTargetNamed("not-throwable");
        kernel.bind<Shuriken>("Weapon").to(Shuriken).whenTargetNamed("throwable");
        kernel.bind<Ninja>("Ninja").to(Ninja);

        let ninja = kernel.get<Ninja>("Ninja");
        expect(ninja.katana.name).to.eql("Katana");
        expect(ninja.shuriken.name).to.eql("Shuriken");

    });

    it("Should allow to annotate class using TaggedInjection", () => {

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
        helpers.annotate(Katana);
        helpers.annotate(Shuriken);
        helpers.annotate(
            Ninja,
            [
                { tagged: { key: "throwable", value: false }, type: "Weapon" },
                { tagged: { key: "throwable", value: true }, type: "Weapon" }
            ]
        );
        kernel.bind<Katana>("Weapon").to(Katana).whenTargetTagged("throwable", false);
        kernel.bind<Shuriken>("Weapon").to(Shuriken).whenTargetTagged("throwable", true);
        kernel.bind<Ninja>("Ninja").to(Ninja);

        let ninja = kernel.get<Ninja>("Ninja");
        expect(ninja.katana.name).to.eql("Katana");
        expect(ninja.shuriken.name).to.eql("Shuriken");

    });

});
