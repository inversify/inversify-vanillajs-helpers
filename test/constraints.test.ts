import { expect } from "chai";
import { Container, interfaces } from "inversify";
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

        let container = new Container();
        let register = helpers.register(container);

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

        let ninja = container.get<Ninja>("Warrior");
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

        let container = new Container();
        let register = helpers.register(container);
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

        let ninja = container.get<Ninja>(TYPE.Warrior);
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

        let container = new Container();
        let registerSelf = helpers.registerSelf(container);

        registerSelf<Katana>(
            [],
            (b: interfaces.BindingInWhenOnSyntax<Katana>) => { b.inSingletonScope(); }
        )(Katana);

        registerSelf<Shuriken>(
            [],
            (b: interfaces.BindingInWhenOnSyntax<Shuriken>) => { b.inTransientScope(); }
        )(Shuriken);

        registerSelf<Ninja>([Katana, Shuriken])(Ninja);

        let ninja1 = container.get<Ninja>(Ninja);
        expect(ninja1.katana.name).to.eql("Katana");
        expect(ninja1.shuriken.name).to.eql("Shuriken");
        expect(ninja1.katana.durability()).to.eql(100);
        expect(ninja1.shuriken.durability()).to.eql(100);
        ninja1.katana.use();
        ninja1.shuriken.use();
        expect(ninja1.katana.durability()).to.eql(90);
        expect(ninja1.shuriken.durability()).to.eql(90);

        let ninja2 = container.get<Ninja>(Ninja);
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

        let container = new Container();
        let registerConstructor = helpers.registerConstructor(container);

        registerConstructor<Weapon>("Newable<Weapon>", (b: interfaces.BindingWhenOnSyntax<Weapon>) => {
            b.whenTargetTagged("throwable", false);
        })(Katana);

        registerConstructor<Weapon>("Newable<Weapon>", (b: interfaces.BindingWhenOnSyntax<Weapon>) => {
            b.whenTargetTagged("throwable", true);
        })(Shuriken);

        registerConstructor<Warrior>("Newable<Warrior>")(Ninja);

        let ninjaConstructor = container.get<interfaces.Newable<Warrior>>("Newable<Warrior>");
        let katanaConstructor = container.getTagged<interfaces.Newable<Weapon>>("Newable<Weapon>", "throwable", false);
        let shurikenConstructor = container.getTagged<interfaces.Newable<Weapon>>("Newable<Weapon>", "throwable", true);

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

        let container = new Container();
        let registerConstantValue = helpers.registerConstantValue(container);
        let register = helpers.register(container);

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

        let ninja = container.get<Warrior>("Warrior");
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

        let container = new Container();
        let registerDynamicValue = helpers.registerDynamicValue(container);

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

        let ninja1 = container.getNamed<Warrior>("Warrior", "chinese");
        expect(ninja1.name).to.eql("Ninja");
        expect(ninja1.weapon.name).to.eql("Shuriken");
        expect(ninja1.getHealth()).to.eql(100);
        ninja1.takeHit();
        expect(ninja1.getHealth()).to.eql(90);

        let ninja2 = container.getNamed<Warrior>("Warrior", "chinese");
        expect(ninja2.name).to.eql("Ninja");
        expect(ninja2.weapon.name).to.eql("Shuriken");
        expect(ninja2.getHealth()).to.eql(100);
        ninja2.takeHit();
        expect(ninja2.getHealth()).to.eql(90);

        let samurai1 = container.getNamed<Warrior>("Warrior", "japanese");
        expect(samurai1.name).to.eql("Samurai");
        expect(samurai1.weapon.name).to.eql("Katana");
        expect(samurai1.getHealth()).to.eql(100);
        samurai1.takeHit();
        expect(samurai1.getHealth()).to.eql(90);

        let samurai2 = container.getNamed<Warrior>("Warrior", "japanese");
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

        let container = new Container();
        let registerFunction = helpers.registerFunction(container);
        let register = helpers.register(container);

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


        let ninja1 = container.get<Ninja>("Ninja");
        expect(ninja1.katana.name).to.eql("Katana");
        expect(ninja1.shuriken.name).to.eql("Shuriken");
        expect(ninja1.getHealth()).to.eql(100);
        ninja1.takeHit();
        expect(ninja1.getHealth()).to.eql(90);

        let ninja2 = container.get<Ninja>("Ninja");
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

        let container = new Container();
        let registerAutoFactory = helpers.registerAutoFactory(container);
        let register = helpers.register(container);
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

        let ninja1 = container.get<Ninja>("Ninja");
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

        let container = new Container();
        let registerFactory = helpers.registerFactory(container);
        let register = helpers.register(container);
        register<Katana>("Katana")(Katana);
        register<Shuriken>("Shuriken")(Shuriken);

        registerFactory<interfaces.Factory<Weapon>, Weapon>(
            "Factory<Weapon>",
            (context: interfaces.Context) => {
                return () => {
                    return context.container.get<Weapon>("Katana");
                };
            },
            (b: interfaces.BindingWhenOnSyntax<interfaces.Factory<Weapon>>) => { b.whenTargetTagged("throwable", false); }
        );

        registerFactory<interfaces.Factory<Weapon>, Weapon>(
            "Factory<Weapon>",
            (context: interfaces.Context) => {
                return () => {
                    return context.container.get<Weapon>("Shuriken");
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

        let ninja1 = container.get<Ninja>("Ninja");
        expect(ninja1.katana.name).to.eql("Katana");
        expect(ninja1.shuriken.name).to.eql("Shuriken");
        expect(ninja1.getHealth()).to.eql(100);
        ninja1.takeHit();
        expect(ninja1.getHealth()).to.eql(90);

    });

    it("Should allow to apply constraints to registerProvider", () => {

        type WeaponProvider = () => Promise<Weapon>;

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

            public katana: Weapon | null;
            public shuriken: Weapon | null;
            public katanaProvider: WeaponProvider;
            public shurikenProvider: WeaponProvider;
            private _health: number;

            public constructor(
                katanaProvider: WeaponProvider,
                shurikenProvider: WeaponProvider
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

        let container = new Container();
        let registerProvider = helpers.registerProvider(container);
        let register = helpers.register(container);

        register<Katana>("Katana")(Katana);
        register<Shuriken>("Shuriken")(Shuriken);

        registerProvider<interfaces.Provider<Weapon>, Weapon>(
            "Provider<Weapon>",
            (context) => {
                return () => {
                    return new Promise<Weapon>((resolve) => {
                        let katana = context.container.get<Weapon>("Katana");
                        resolve(katana);
                    });
                };
            },
            (b: interfaces.BindingWhenOnSyntax<interfaces.Provider<Weapon>>) => {
                b.whenTargetTagged("throwable", false);
            }
        );

        registerProvider<WeaponProvider, Weapon>(
            "Provider<Shuriken>",
            (context) => {
                return () => {
                    return new Promise<Weapon>((resolve) => {
                        let katana = context.container.get<Weapon>("Shuriken");
                        resolve(katana);
                    });
                };
            },
            (b: interfaces.BindingWhenOnSyntax<WeaponProvider>) => { b.whenTargetTagged("throwable", true); }
        );

        register<Ninja>(
            "Ninja",
            [
                { tagged: { key: "throwable", value: false }, type: "Provider<Weapon>" },
                { tagged: { key: "throwable", value: true }, type: "Provider<Weapon>" }
            ]
        )(Ninja);

        let ninja1 = container.get<Ninja>("Ninja");
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
