import { expect } from "chai";
import { Kernel, interfaces } from "inversify";
import { helpers } from "../src/index";

describe("Register Helper", () => {

    it("Should allow to register a class", () => {

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
        let register = helpers.register(kernel);
        register<Katana>("Katana", Katana);
        register<Shuriken>("Shuriken", Shuriken);
        register<Ninja>("Ninja", Ninja, [ "Katana", "Shuriken" ]);

        let ninja = kernel.get<Ninja>("Ninja");
        expect(ninja.katana.name).to.eql("Katana");
        expect(ninja.shuriken.name).to.eql("Shuriken");

    });

    it("Should allow to register a class using itself as identifier", () => {

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
        let registerSelf = helpers.registerSelf(kernel);
        registerSelf<Katana>(Katana);
        registerSelf<Shuriken>(Shuriken);
        registerSelf<Ninja>(Ninja, [Katana, Shuriken]);

        let ninja = kernel.get<Ninja>(Ninja);
        expect(ninja.katana.name).to.eql("Katana");
        expect(ninja.shuriken.name).to.eql("Shuriken");

    });

    it("Should allow to register a class constructor", () => {

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
        let registerConstructor = helpers.registerConstructor(kernel);
        registerConstructor<Katana>("Newable<Katana>", Katana);
        registerConstructor<Shuriken>("Newable<Shuriken>", Shuriken);
        registerConstructor<Ninja>("Newable<Ninja>", Ninja);

        let ninjaConstructor = kernel.get<interfaces.Newable<Ninja>>("Newable<Ninja>");
        let katanaConstructor = kernel.get<interfaces.Newable<Katana>>("Newable<Katana>");
        let shurikenConstructor = kernel.get<interfaces.Newable<Shuriken>>("Newable<Shuriken>");

        let ninja = new ninjaConstructor(new katanaConstructor(), new shurikenConstructor());
        expect(ninja.katana.name).to.eql("Katana");
        expect(ninja.shuriken.name).to.eql("Shuriken");

    });

    it("Should allow to register a constant value", () => {

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
            private _health: number;
            public constructor(katana: Katana, shuriken: Shuriken) {
                this._health = 100;
                this.katana = katana;
                this.shuriken = shuriken;
            }
            public takeHit() {
                this._health = this._health - 10;
            }
            public getHealth() {
                return this._health;
            }
        }

        let kernel = new Kernel();
        let registerConstantValue = helpers.registerConstantValue(kernel);
        registerConstantValue<Ninja>("Ninja", new Ninja(new Katana(), new Shuriken()));

        let ninja1 = kernel.get<Ninja>("Ninja");
        expect(ninja1.katana.name).to.eql("Katana");
        expect(ninja1.shuriken.name).to.eql("Shuriken");
        expect(ninja1.getHealth()).to.eql(100);
        ninja1.takeHit();
        expect(ninja1.getHealth()).to.eql(90);

        let ninja2 = kernel.get<Ninja>("Ninja");
        expect(ninja2.katana.name).to.eql("Katana");
        expect(ninja2.shuriken.name).to.eql("Shuriken");
        expect(ninja2.getHealth()).to.eql(90);
        ninja2.takeHit();
        expect(ninja2.getHealth()).to.eql(80);

    });

    it("Should allow to register a dynamic value", () => {

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
            private _health: number;
            public constructor(katana: Katana, shuriken: Shuriken) {
                this._health = 100;
                this.katana = katana;
                this.shuriken = shuriken;
            }
            public takeHit() {
                this._health = this._health - 10;
            }
            public getHealth() {
                return this._health;
            }
        }

        let kernel = new Kernel();
        let registerDynamicValue = helpers.registerDynamicValue(kernel);
        registerDynamicValue<Ninja>("Ninja", () => { return new Ninja(new Katana(), new Shuriken()); });

        let ninja1 = kernel.get<Ninja>("Ninja");
        expect(ninja1.katana.name).to.eql("Katana");
        expect(ninja1.shuriken.name).to.eql("Shuriken");
        expect(ninja1.getHealth()).to.eql(100);
        ninja1.takeHit();
        expect(ninja1.getHealth()).to.eql(90);

        let ninja2 = kernel.get<Ninja>("Ninja");
        expect(ninja2.katana.name).to.eql("Katana");
        expect(ninja2.shuriken.name).to.eql("Shuriken");
        expect(ninja2.getHealth()).to.eql(100);
        ninja2.takeHit();
        expect(ninja2.getHealth()).to.eql(90);

    });

    it("Should allow to register a function", () => {

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
            private _health: number;
            public constructor(katana: Katana, shuriken: Shuriken) {
                this._health = 100;
                this.katana = katana;
                this.shuriken = shuriken;
            }
            public takeHit() {
                this._health = this._health - 10;
            }
            public getHealth() {
                return this._health;
            }
        }

        let kernel = new Kernel();
        let registerFunction = helpers.registerFunction(kernel);
        registerFunction<() => Ninja>("Ninja", () => { return new Ninja(new Katana(), new Shuriken()); });

        let getNinja = kernel.get<() => Ninja>("Ninja");
        let ninja1 = getNinja();
        expect(ninja1.katana.name).to.eql("Katana");
        expect(ninja1.shuriken.name).to.eql("Shuriken");
        expect(ninja1.getHealth()).to.eql(100);
        ninja1.takeHit();
        expect(ninja1.getHealth()).to.eql(90);

        let ninja2 = getNinja();
        expect(ninja2.katana.name).to.eql("Katana");
        expect(ninja2.shuriken.name).to.eql("Shuriken");
        expect(ninja2.getHealth()).to.eql(100);
        ninja2.takeHit();
        expect(ninja2.getHealth()).to.eql(90);

    });

    it("Should allow to register a auto factory", () => {

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
            private _health: number;
            public constructor(
                katanaFactory: interfaces.Factory<Katana>,
                shurikenFactory: interfaces.Factory<Shuriken>
            ) {
                this._health = 100;
                this.katana = katanaFactory();
                this.shuriken = shurikenFactory();
            }
            public takeHit() {
                this._health = this._health - 10;
            }
            public getHealth() {
                return this._health;
            }
        }

        let kernel = new Kernel();
        let registerAutoFactory = helpers.registerAutoFactory(kernel);
        let register = helpers.register(kernel);
        register<Katana>("Katana", Katana);
        register<Shuriken>("Shuriken", Shuriken);
        registerAutoFactory<interfaces.Factory<Katana>, Katana>("Factory<Katana>", "Katana");
        registerAutoFactory<interfaces.Factory<Shuriken>, Shuriken>("Factory<Shuriken>", "Shuriken");
        register<Ninja>("Ninja", Ninja, ["Factory<Katana>", "Factory<Shuriken>"]);

        let ninja1 = kernel.get<Ninja>("Ninja");
        expect(ninja1.katana.name).to.eql("Katana");
        expect(ninja1.shuriken.name).to.eql("Shuriken");
        expect(ninja1.getHealth()).to.eql(100);
        ninja1.takeHit();
        expect(ninja1.getHealth()).to.eql(90);

    });

    it("Should allow to register a factory", () => {

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
            private _health: number;
            public constructor(
                katanaFactory: interfaces.Factory<Katana>,
                shurikenFactory: interfaces.Factory<Shuriken>
            ) {
                this._health = 100;
                this.katana = katanaFactory();
                this.shuriken = shurikenFactory();
            }
            public takeHit() {
                this._health = this._health - 10;
            }
            public getHealth() {
                return this._health;
            }
        }

        let kernel = new Kernel();
        let registerFactory = helpers.registerFactory(kernel);
        let register = helpers.register(kernel);
        register<Katana>("Katana", Katana);
        register<Shuriken>("Shuriken", Shuriken);

        registerFactory<interfaces.Factory<Katana>, Katana>("Factory<Katana>", (context: interfaces.Context) => {
            return () => {
                return context.kernel.get<Katana>("Katana");
            };
        });

        registerFactory<interfaces.Factory<Shuriken>, Shuriken>("Factory<Shuriken>", (context: interfaces.Context) => {
            return () => {
                return context.kernel.get<Shuriken>("Shuriken");
            };
        });

        register<Ninja>("Ninja", Ninja, ["Factory<Katana>", "Factory<Shuriken>"]);

        let ninja1 = kernel.get<Ninja>("Ninja");
        expect(ninja1.katana.name).to.eql("Katana");
        expect(ninja1.shuriken.name).to.eql("Shuriken");
        expect(ninja1.getHealth()).to.eql(100);
        ninja1.takeHit();
        expect(ninja1.getHealth()).to.eql(90);

    });

    it("Should allow to register a provider", () => {

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
            public katanaProvider: interfaces.Provider<Katana>;
            public shurikenProvider: interfaces.Provider<Shuriken>;
            private _health: number;

            public constructor(
                katanaProvider: interfaces.Provider<Katana>,
                shurikenProvider: interfaces.Provider<Shuriken>
            ) {
                this._health = 100;
                this.katana = null;
                this.shuriken = null;
                this.katanaProvider = katanaProvider;
                this.shurikenProvider = shurikenProvider;
            }

            public takeHit() {
                this._health = this._health - 10;
            }

            public getHealth() {
                return this._health;
            }

        }

        let kernel = new Kernel();
        let registerProvider = helpers.registerProvider(kernel);
        let register = helpers.register(kernel);
        register<Katana>("Katana", Katana);
        register<Shuriken>("Shuriken", Shuriken);

        registerProvider<interfaces.Factory<Katana>, Katana>("Factory<Katana>", (context) => {
            return () => {
                return new Promise<Katana>((resolve) => {
                    let katana = context.kernel.get<Katana>("Katana");
                    resolve(katana);
                });
            };
        });

        registerProvider<interfaces.Factory<Shuriken>, Shuriken>("Factory<Shuriken>", (context) => {
            return () => {
                return new Promise<Shuriken>((resolve) => {
                    let katana = context.kernel.get<Shuriken>("Shuriken");
                    resolve(katana);
                });
            };
        });

        register<Ninja>("Ninja", Ninja, ["Factory<Katana>", "Factory<Shuriken>"]);

        let ninja1 = kernel.get<Ninja>("Ninja");
        expect(ninja1.katana).to.eql(null);
        expect(ninja1.shuriken).to.eql(null);
        expect(ninja1.getHealth()).to.eql(100);
        ninja1.takeHit();
        expect(ninja1.getHealth()).to.eql(90);

        ninja1.katanaProvider().then((katana: Katana) => {
            ninja1.katana = katana;
            expect(ninja1.katana.name).to.eql("Katana");
        });

        ninja1.shurikenProvider().then((shuriken: Shuriken) => {
            ninja1.shuriken = shuriken;
            expect(ninja1.shuriken.name).to.eql("Katana");
        });

    });

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
        register<Weapon>("Weapon", Katana).whenTargetNamed("not-throwable");
        register<Weapon>("Weapon", Shuriken).whenTargetNamed("throwable");
        register<Warrior>(
            "Warrior",
            Ninja,
            [
                { named: "not-throwable", type: "Weapon" },
                { named: "throwable", type: "Weapon" }
            ]
        );

        let ninja = kernel.get<Ninja>("Weapon");
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
        register<Weapon>("Weapon", Katana).whenTargetTagged("throwable", false);
        register<Weapon>("Weapon", Shuriken).whenTargetTagged("throwable", true);
        register<Warrior>(
            "Warrior",
            Ninja,
            [
                { tagged: { key: "throwable", value: false }, type: "Weapon" },
                { tagged: { key: "throwable", value: true }, type: "Weapon" }
            ]
        );

        let ninja = kernel.get<Ninja>("Weapon");
        expect(ninja.primaryWeapon.name).to.eql("Katana");
        expect(ninja.secondaryWeapon.name).to.eql("Shuriken");

    });

});
