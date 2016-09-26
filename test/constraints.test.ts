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

    it("Should allow to apply constraints to registerSelf", () => {

        class Katana {
            public name: string;
            private _durability: number;
            public constructor() {
                this.name = "Katana";
                this._durability = 100;
            }
            public use() {
                this._durability = this._durability - 10;
            }
            public durability() {
                return this._durability;
            }
        }

        class Shuriken {
            public name: string;
            private _durability: number;
            public constructor() {
                this.name = "Shuriken";
                this._durability = 100;
            }
            public use() {
                this._durability = this._durability - 10;
            }
            public durability() {
                return this._durability;
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

        registerSelf<Katana>(
            [],
            (b: interfaces.BindingInWhenOnSyntax<Katana>) => { b.inSingletonScope(); }
        )(Katana);

        registerSelf<Shuriken>(
            [],
            (b: interfaces.BindingInWhenOnSyntax<Shuriken>) => { b.inTransientScope(); }
        )(Shuriken);

        registerSelf<Ninja>([Katana, Shuriken])(Ninja);

        let ninja1 = kernel.get<Ninja>(Ninja);
        expect(ninja1.katana.name).to.eql("Katana");
        expect(ninja1.shuriken.name).to.eql("Shuriken");
        expect(ninja1.katana.durability()).to.eql(100);
        expect(ninja1.shuriken.durability()).to.eql(100);
        ninja1.katana.use();
        ninja1.shuriken.use();
        expect(ninja1.katana.durability()).to.eql(90);
        expect(ninja1.shuriken.durability()).to.eql(90);

        let ninja2 = kernel.get<Ninja>(Ninja);
        expect(ninja2.katana.name).to.eql("Katana");
        expect(ninja2.shuriken.name).to.eql("Shuriken");
        expect(ninja2.katana.durability()).to.eql(90);
        expect(ninja2.shuriken.durability()).to.eql(100);
        ninja2.katana.use();
        ninja2.shuriken.use();
        expect(ninja2.katana.durability()).to.eql(80);
        expect(ninja2.shuriken.durability()).to.eql(90);

    });

    it("Should allow to apply constraints to registerConstructor", () => {

        interface Weapon {
            name: string;
        }

        interface Warrior {
            katana: Katana;
            shuriken: Shuriken;
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

        class Ninja implements Warrior {
            public katana: Weapon;
            public shuriken: Weapon;
            public constructor(katana: Weapon, shuriken: Weapon) {
                this.katana = katana;
                this.shuriken = shuriken;
            }
        }

        let kernel = new Kernel();
        let registerConstructor = helpers.registerConstructor(kernel);

        registerConstructor<Weapon>("Newable<Weapon>", (b: interfaces.BindingWhenOnSyntax<Weapon>) => {
            b.whenTargetTagged("throwable", false);
        })(Katana);

        registerConstructor<Weapon>("Newable<Weapon>", (b: interfaces.BindingWhenOnSyntax<Weapon>) => {
            b.whenTargetTagged("throwable", true);
        })(Shuriken);

        registerConstructor<Warrior>("Newable<Warrior>")(Ninja);

        let ninjaConstructor = kernel.get<interfaces.Newable<Warrior>>("Newable<Warrior>");
        let katanaConstructor = kernel.getTagged<interfaces.Newable<Weapon>>("Newable<Weapon>", "throwable", false);
        let shurikenConstructor = kernel.getTagged<interfaces.Newable<Weapon>>("Newable<Weapon>", "throwable", true);

        let ninja = new ninjaConstructor(new katanaConstructor(), new shurikenConstructor());
        expect(ninja.katana.name).to.eql("Katana");
        expect(ninja.shuriken.name).to.eql("Shuriken");

    });

    it("Should allow to apply constraints to registerConstantValue", () => {

        interface Weapon {
            name: string;
        }

        interface Warrior {
            katana: Katana;
            shuriken: Shuriken;
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

        class Ninja implements Warrior {
            public katana: Weapon;
            public shuriken: Weapon;
            public constructor(katana: Weapon, shuriken: Weapon) {
                this.katana = katana;
                this.shuriken = shuriken;
            }
        }

        let kernel = new Kernel();
        let registerConstantValue = helpers.registerConstantValue(kernel);
        let register = helpers.register(kernel);

        registerConstantValue<Weapon>("Weapon", new Katana(), (b: interfaces.BindingWhenOnSyntax<Weapon>) => {
            b.whenTargetTagged("throwable", false);
        });

        registerConstantValue<Weapon>("Weapon", new Shuriken(), (b: interfaces.BindingWhenOnSyntax<Weapon>) => {
            b.whenTargetTagged("throwable", true);
        });

        register<Warrior>("Warrior", [
            { tagged: { key: "throwable", value: false }, type: "Weapon" },
            { tagged: { key: "throwable", value: true }, type: "Weapon" }
        ])(Ninja);

        let ninja = kernel.get<Warrior>("Warrior");
        expect(ninja.katana.name).to.eql("Katana");
        expect(ninja.shuriken.name).to.eql("Shuriken");

    });

    it("Should allow to apply constraints to registerDynamicValue", () => {

        interface Weapon {
            name: string;
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

        interface Warrior {
            name: string;
            weapon: Weapon;
            takeHit(): void;
            getHealth(): number;
        }

        class Ninja implements Warrior {
            public weapon: Weapon;
            public name: string;
            private _health: number;
            public constructor(weapon: Weapon) {
                this.name = "Ninja";
                this._health = 100;
                this.weapon = weapon;
            }
            public takeHit() {
                this._health = this._health - 10;
            }
            public getHealth() {
                return this._health;
            }
        }

        class Samurai implements Warrior {
            public weapon: Weapon;
            public name: string;
            private _health: number;
            public constructor(weapon: Weapon) {
                this.name = "Samurai";
                this._health = 100;
                this.weapon = weapon;
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

        registerDynamicValue<Warrior>(
            "Warrior",
            () => { return new Ninja(new Shuriken()); },
            (b: interfaces.BindingInWhenOnSyntax<Warrior>) => { b.whenTargetNamed("chinese"); }
        );

        registerDynamicValue<Warrior>(
            "Warrior",
            () => { return new Samurai(new Katana()); },
            (b: interfaces.BindingInWhenOnSyntax<Warrior>) => { b.whenTargetNamed("japanese"); }
        );

        let ninja1 = kernel.getNamed<Warrior>("Warrior", "chinese");
        expect(ninja1.name).to.eql("Ninja");
        expect(ninja1.weapon.name).to.eql("Shuriken");
        expect(ninja1.getHealth()).to.eql(100);
        ninja1.takeHit();
        expect(ninja1.getHealth()).to.eql(90);

        let ninja2 = kernel.getNamed<Warrior>("Warrior", "chinese");
        expect(ninja2.name).to.eql("Ninja");
        expect(ninja2.weapon.name).to.eql("Shuriken");
        expect(ninja2.getHealth()).to.eql(100);
        ninja2.takeHit();
        expect(ninja2.getHealth()).to.eql(90);

        let samurai1 = kernel.getNamed<Warrior>("Warrior", "japanese");
        expect(samurai1.name).to.eql("Samurai");
        expect(samurai1.weapon.name).to.eql("Katana");
        expect(samurai1.getHealth()).to.eql(100);
        samurai1.takeHit();
        expect(samurai1.getHealth()).to.eql(90);

        let samurai2 = kernel.getNamed<Warrior>("Warrior", "japanese");
        expect(samurai2.name).to.eql("Samurai");
        expect(samurai2.weapon.name).to.eql("Katana");
        expect(samurai2.getHealth()).to.eql(100);
        samurai2.takeHit();
        expect(samurai2.getHealth()).to.eql(90);

    });

    it("Should allow to apply constraints to registerFunction", () => {

        interface Weapon {
            name: string;
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
            public katana: Weapon;
            public shuriken: Weapon;
            private _health: number;
            public constructor(getKatana: () => Weapon, getShuriken: () => Weapon) {
                this._health = 100;
                this.katana = getKatana();
                this.shuriken = getShuriken();
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
        let register = helpers.register(kernel);

        registerFunction<() => Weapon>(
            "Weapon",
            () => { return new Katana(); },
            (b: interfaces.BindingWhenOnSyntax<() => Weapon>) => { b.whenTargetTagged("throwable", false); }
        );

        registerFunction<() => Weapon>(
            "Weapon",
            () => { return new Shuriken(); },
            (b: interfaces.BindingWhenOnSyntax<() => Weapon>) => { b.whenTargetTagged("throwable", true); }
        );

        register<Ninja>(
            "Ninja",
            [
                { tagged: { key: "throwable", value: false }, type: "Weapon" },
                { tagged: { key: "throwable", value: true }, type: "Weapon" }
            ]
        )(Ninja);


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

    it("Should allow to apply constraints to registerAutoFactory", () => {

        interface Weapon {
            name: string;
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
            public katana: Weapon;
            public shuriken: Weapon;
            private _health: number;
            public constructor(
                katanaFactory: interfaces.Factory<Weapon>,
                shurikenFactory: interfaces.Factory<Weapon>
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
        register<Katana>("Katana")(Katana);
        register<Shuriken>("Shuriken")(Shuriken);
        registerAutoFactory<interfaces.Factory<Katana>, Katana>(
            "Factory<Weapon>",
            "Katana",
            (b: interfaces.BindingWhenOnSyntax<() => Weapon>) => { b.whenTargetTagged("throwable", false); }
        );

        registerAutoFactory<interfaces.Factory<Shuriken>, Shuriken>(
            "Factory<Weapon>",
            "Shuriken",
            (b: interfaces.BindingWhenOnSyntax<() => Weapon>) => { b.whenTargetTagged("throwable", true); }
        );

        register<Ninja>(
            "Ninja",
            [
                { tagged: { key: "throwable", value: false }, type: "Factory<Weapon>" },
                { tagged: { key: "throwable", value: true }, type: "Factory<Weapon>" }
            ]
        )(Ninja);

        let ninja1 = kernel.get<Ninja>("Ninja");
        expect(ninja1.katana.name).to.eql("Katana");
        expect(ninja1.shuriken.name).to.eql("Shuriken");
        expect(ninja1.getHealth()).to.eql(100);
        ninja1.takeHit();
        expect(ninja1.getHealth()).to.eql(90);

    });

    it("Should allow to apply constraints to registerFactory", () => {

        interface Weapon {
            name: string;
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
            public katana: Weapon;
            public shuriken: Weapon;
            private _health: number;
            public constructor(
                katanaFactory: interfaces.Factory<Weapon>,
                shurikenFactory: interfaces.Factory<Weapon>
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
        register<Katana>("Katana")(Katana);
        register<Shuriken>("Shuriken")(Shuriken);

        registerFactory<interfaces.Factory<Weapon>, Weapon>(
            "Factory<Weapon>",
            (context: interfaces.Context) => {
                return () => {
                    return context.kernel.get<Weapon>("Katana");
                };
            },
            (b: interfaces.BindingWhenOnSyntax<interfaces.Factory<Weapon>>) => { b.whenTargetTagged("throwable", false); }
        );

        registerFactory<interfaces.Factory<Weapon>, Weapon>(
            "Factory<Weapon>",
            (context: interfaces.Context) => {
                return () => {
                    return context.kernel.get<Weapon>("Shuriken");
                };
            },
            (b: interfaces.BindingWhenOnSyntax<interfaces.Factory<Weapon>>) => { b.whenTargetTagged("throwable", true); }
        );

        register<Ninja>(
            "Ninja",
            [
                { tagged: { key: "throwable", value: false }, type: "Factory<Weapon>" },
                { tagged: { key: "throwable", value: true }, type: "Factory<Weapon>" }
            ]
        )(Ninja);

        let ninja1 = kernel.get<Ninja>("Ninja");
        expect(ninja1.katana.name).to.eql("Katana");
        expect(ninja1.shuriken.name).to.eql("Shuriken");
        expect(ninja1.getHealth()).to.eql(100);
        ninja1.takeHit();
        expect(ninja1.getHealth()).to.eql(90);

    });

    it("Should allow to apply constraints to registerProvider", () => {

        interface Weapon {
            name: string;
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

            public katana: Weapon;
            public shuriken: Weapon;
            public katanaProvider: interfaces.Provider<Weapon>;
            public shurikenProvider: interfaces.Provider<Weapon>;
            private _health: number;

            public constructor(
                katanaProvider: interfaces.Provider<Weapon>,
                shurikenProvider: interfaces.Provider<Weapon>
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

        register<Katana>("Katana")(Katana);
        register<Shuriken>("Shuriken")(Shuriken);

        registerProvider<interfaces.Provider<Weapon>, Weapon>(
            "Provider<Weapon>",
            (context) => {
                return () => {
                    return new Promise<Weapon>((resolve) => {
                        let katana = context.kernel.get<Weapon>("Katana");
                        resolve(katana);
                    });
                };
            },
            (b: interfaces.BindingWhenOnSyntax<interfaces.Provider<Weapon>>) => { b.whenTargetTagged("throwable", false); }
        );

        registerProvider<interfaces.Provider<Shuriken>, Weapon>(
            "Provider<Shuriken>",
            (context) => {
                return () => {
                    return new Promise<Weapon>((resolve) => {
                        let katana = context.kernel.get<Weapon>("Shuriken");
                        resolve(katana);
                    });
                };
            },
            (b: interfaces.BindingWhenOnSyntax<interfaces.Provider<Weapon>>) => { b.whenTargetTagged("throwable", true); }
        );

        register<Ninja>(
            "Ninja",
            [
                { tagged: { key: "throwable", value: false }, type: "Provider<Weapon>" },
                { tagged: { key: "throwable", value: true }, type: "Provider<Weapon>" }
            ]
        )(Ninja);

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

});
