import { expect } from "chai";
import { Kernel, interfaces } from "inversify";
import { helpers } from "../src/index";

describe("Register helper as a decorator", () => {

    it("Should allow to use register helper as a class decorator", () => {

        let kernel = new Kernel();
        let register = helpers.register(kernel);

        let TYPE = {
            Warrior: "Warrior",
            Weapon: "Weapon"
        };

        interface Weapon {
            name: string;
        }

        interface Warrior {
            primaryWeapon: Weapon;
            secondaryWeapon: Weapon;
        }

        @register<Weapon>(
            TYPE.Weapon, [],
            (b: interfaces.BindingInWhenOnSyntax<Weapon>) => { b.whenTargetTagged("throwable", false); }
        )
        class Katana implements Weapon {
            public name: string;
            public constructor() {
                this.name = "Katana";
            }
        }

        @register<Weapon>(
            TYPE.Weapon, [],
            (b: interfaces.BindingInWhenOnSyntax<Weapon>) => { b.whenTargetTagged("throwable", true); }
        )
        class Shuriken implements Weapon {
            public name: string;
            public constructor() {
                this.name = "Shuriken";
            }
        }

        @register<Warrior>(
            TYPE.Warrior,
            [
                { tagged: { key: "throwable", value: false }, type: TYPE.Weapon },
                { tagged: { key: "throwable", value: true }, type: TYPE.Weapon }
            ]
        )
        class Ninja {
            public primaryWeapon: Weapon;
            public secondaryWeapon: Weapon;
            public constructor(primaryWeapon: Weapon, secondaryWeapon: Weapon) {
                this.primaryWeapon = primaryWeapon;
                this.secondaryWeapon = secondaryWeapon;
            }
        }

        let ninja = kernel.get<Ninja>(TYPE.Warrior);
        expect(ninja.primaryWeapon.name).to.eql("Katana");
        expect(ninja.secondaryWeapon.name).to.eql("Shuriken");

    });

});
