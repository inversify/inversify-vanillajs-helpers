import { expect } from "chai";
import { Container } from "inversify";
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

        let container = new Container();
        helpers.annotate(Katana);
        helpers.annotate(Shuriken);
        helpers.annotate(Ninja, [ "Katana", "Shuriken" ]);
        container.bind<Katana>("Katana").to(Katana);
        container.bind<Shuriken>("Shuriken").to(Shuriken);
        container.bind<Ninja>("Ninja").to(Ninja);

        let ninja = container.get<Ninja>("Ninja");
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

        let ThrowableWeaponId = Symbol.for("ThrowableWeapon");
        let NotTrowableWeaponId = Symbol.for("NotTrowableWeapon");
        let NinjaId = Symbol.for("Ninja");

        let container = new Container();
        helpers.annotate(Katana);
        helpers.annotate(Shuriken);
        helpers.annotate(Ninja, [NotTrowableWeaponId, ThrowableWeaponId]);
        container.bind<Katana>(NotTrowableWeaponId).to(Katana);
        container.bind<Shuriken>(ThrowableWeaponId).to(Shuriken);
        container.bind<Ninja>(NinjaId).to(Ninja);

        let ninja = container.get<Ninja>(NinjaId);
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

        let container = new Container();
        helpers.annotate(Katana);
        helpers.annotate(Shuriken);
        helpers.annotate(Ninja, [ Katana, Shuriken ]);
        container.bind<Katana>(Katana).toSelf();
        container.bind<Shuriken>(Shuriken).toSelf();
        container.bind<Ninja>(Ninja).to(Ninja);

        let ninja = container.get<Ninja>(Ninja);
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

        let container = new Container();
        helpers.annotate(Katana);
        helpers.annotate(Shuriken);
        helpers.annotate(
            Ninja,
            [
                { type: "Katana" },
                { type: "Shuriken" }
            ]
        );
        container.bind<Katana>("Katana").to(Katana);
        container.bind<Shuriken>("Shuriken").to(Shuriken);
        container.bind<Ninja>("Ninja").to(Ninja);

        let ninja = container.get<Ninja>("Ninja");
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

        let container = new Container();
        helpers.annotate(Katana);
        helpers.annotate(Shuriken);
        helpers.annotate(
            Ninja,
            [
                { named: "not-throwable", type: "Weapon" },
                { named: "throwable", type: "Weapon" }
            ]
        );
        container.bind<Katana>("Weapon").to(Katana).whenTargetNamed("not-throwable");
        container.bind<Shuriken>("Weapon").to(Shuriken).whenTargetNamed("throwable");
        container.bind<Ninja>("Ninja").to(Ninja);

        let ninja = container.get<Ninja>("Ninja");
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

        let container = new Container();
        helpers.annotate(Katana);
        helpers.annotate(Shuriken);
        helpers.annotate(
            Ninja,
            [
                { tagged: { key: "throwable", value: false }, type: "Weapon" },
                { tagged: { key: "throwable", value: true }, type: "Weapon" }
            ]
        );
        container.bind<Katana>("Weapon").to(Katana).whenTargetTagged("throwable", false);
        container.bind<Shuriken>("Weapon").to(Shuriken).whenTargetTagged("throwable", true);
        container.bind<Ninja>("Ninja").to(Ninja);

        let ninja = container.get<Ninja>("Ninja");
        expect(ninja.katana.name).to.eql("Katana");
        expect(ninja.shuriken.name).to.eql("Shuriken");

    });

});
