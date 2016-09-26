import { expect } from "chai";
import { Kernel, interfaces } from "inversify";
import { helpers } from "../src/index";

describe("Register helper constraints", () => {

    it("Should allow to register a named class", () => {

        interface Weapon {
            name: string;
        }

        interface Warrior {
            primaryWeapon: Weapon;
            secondaryWeapon: Weapon;
        }

        class Katana implements Weapon {
            public name: string;
            public constructor() {
                this.name = "Katana";
            }
        }

        class Shuriken implements Weapon {
            public name: string;
            public constructor() {
                this.name = "Shuriken";
            }
        }

        class Ninja {
            public primaryWeapon: Weapon;
            public secondaryWeapon: Weapon;
            public constructor(primaryWeapon: Weapon, secondaryWeapon: Weapon) {
                this.primaryWeapon = primaryWeapon;
                this.secondaryWeapon = secondaryWeapon;
            }
        }

        let kernel = new Kernel();
        let register = helpers.register(kernel);

        register<Weapon>(
            "Weapon",
            [],
            (b: interfaces.BindingInWhenOnSyntax<Weapon>) => { b.whenTargetNamed("not-throwable"); }
        )(Katana);

        register<Weapon>(
            "Weapon",
            [],
            (b: interfaces.BindingInWhenOnSyntax<Weapon>) => { b.whenTargetNamed("throwable"); }
        )(Shuriken);

        register<Warrior>(
            "Warrior",
            [
                { named: "not-throwable", type: "Weapon" },
                { named: "throwable", type: "Weapon" }
            ]
        )(Ninja);

        let ninja = kernel.get<Ninja>("Warrior");
        expect(ninja.primaryWeapon.name).to.eql("Katana");
        expect(ninja.secondaryWeapon.name).to.eql("Shuriken");

    });

    it("Should allow to register a tagged class", () => {

        interface Weapon {
            name: string;
        }

        interface Warrior {
            primaryWeapon: Weapon;
            secondaryWeapon: Weapon;
        }

        class Katana implements Weapon {
            public name: string;
            public constructor() {
                this.name = "Katana";
            }
        }

        class Shuriken implements Weapon {
            public name: string;
            public constructor() {
                this.name = "Shuriken";
            }
        }

        class Ninja {
            public primaryWeapon: Weapon;
            public secondaryWeapon: Weapon;
            public constructor(primaryWeapon: Weapon, secondaryWeapon: Weapon) {
                this.primaryWeapon = primaryWeapon;
                this.secondaryWeapon = secondaryWeapon;
            }
        }

        let kernel = new Kernel();
        let register = helpers.register(kernel);
        let TYPE = {
            Warrior: "Warrior",
            Weapon: "Weapon"
        };

        register<Weapon>(
            TYPE.Weapon,
            [],
            (b: interfaces.BindingInWhenOnSyntax<Weapon>) => { b.whenTargetTagged("throwable", false); }
        )(Katana);

        register<Weapon>(
            TYPE.Weapon,
            [],
            (b: interfaces.BindingInWhenOnSyntax<Weapon>) => { b.whenTargetTagged("throwable", true); }
        )(Shuriken);

        register<Warrior>(
            TYPE.Warrior,
            [
                { tagged: { key: "throwable", value: false }, type: TYPE.Weapon },
                { tagged: { key: "throwable", value: true }, type: TYPE.Weapon }
            ]
        )(Ninja);

        let ninja = kernel.get<Ninja>(TYPE.Warrior);
        expect(ninja.primaryWeapon.name).to.eql("Katana");
        expect(ninja.secondaryWeapon.name).to.eql("Shuriken");

    });

    it("Should allow to apply constraints to registerSelf");
    it("Should allow to apply constraints to registerConstructor");
    it("Should allow to apply constraints to registerConstantValue");
    it("Should allow to apply constraints to registerDynamicValue");
    it("Should allow to apply constraints to registerFunction");
    it("Should allow to apply constraints to registerAutoFactory");
    it("Should allow to apply constraints to registerFactory");
    it("Should allow to apply constraints to registerProvider");

});
