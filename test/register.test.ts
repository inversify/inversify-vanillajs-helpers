import { expect } from "chai";
import { Container, interfaces } from "inversify";
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

        let container = new Container();
        let register = helpers.register(container);
        register<Katana>("Katana")(Katana);
        register<Shuriken>("Shuriken")(Shuriken);
        register<Ninja>("Ninja", [ "Katana", "Shuriken" ])(Ninja);

        let ninja = container.get<Ninja>("Ninja");
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

        let container = new Container();
        let registerSelf = helpers.registerSelf(container);
        registerSelf<Katana>()(Katana);
        registerSelf<Shuriken>()(Shuriken);
        registerSelf<Ninja>([Katana, Shuriken])(Ninja);

        let ninja = container.get<Ninja>(Ninja);
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

        let container = new Container();
        let registerConstructor = helpers.registerConstructor(container);
        registerConstructor<Katana>("Newable<Katana>")(Katana);
        registerConstructor<Shuriken>("Newable<Shuriken>")(Shuriken);
        registerConstructor<Ninja>("Newable<Ninja>")(Ninja);

        let ninjaConstructor = container.get<interfaces.Newable<Ninja>>("Newable<Ninja>");
        let katanaConstructor = container.get<interfaces.Newable<Katana>>("Newable<Katana>");
        let shurikenConstructor = container.get<interfaces.Newable<Shuriken>>("Newable<Shuriken>");

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

        let container = new Container();
        let registerConstantValue = helpers.registerConstantValue(container);
        registerConstantValue<Ninja>("Ninja", new Ninja(new Katana(), new Shuriken()));

        let ninja1 = container.get<Ninja>("Ninja");
        expect(ninja1.katana.name).to.eql("Katana");
        expect(ninja1.shuriken.name).to.eql("Shuriken");
        expect(ninja1.getHealth()).to.eql(100);
        ninja1.takeHit();
        expect(ninja1.getHealth()).to.eql(90);

        let ninja2 = container.get<Ninja>("Ninja");
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

        let container = new Container();
        let registerDynamicValue = helpers.registerDynamicValue(container);
        registerDynamicValue<Ninja>("Ninja", () => { return new Ninja(new Katana(), new Shuriken()); });

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

        let container = new Container();
        let registerFunction = helpers.registerFunction(container);
        registerFunction<() => Ninja>("Ninja", () => { return new Ninja(new Katana(), new Shuriken()); });

        let getNinja = container.get<() => Ninja>("Ninja");
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

        let container = new Container();
        let registerAutoFactory = helpers.registerAutoFactory(container);
        let register = helpers.register(container);
        register<Katana>("Katana")(Katana);
        register<Shuriken>("Shuriken")(Shuriken);
        registerAutoFactory<interfaces.Factory<Katana>, Katana>("Factory<Katana>", "Katana");
        registerAutoFactory<interfaces.Factory<Shuriken>, Shuriken>("Factory<Shuriken>", "Shuriken");
        register<Ninja>("Ninja", ["Factory<Katana>", "Factory<Shuriken>"])(Ninja);

        let ninja1 = container.get<Ninja>("Ninja");
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

        let container = new Container();
        let registerFactory = helpers.registerFactory(container);
        let register = helpers.register(container);
        register<Katana>("Katana")(Katana);
        register<Shuriken>("Shuriken")(Shuriken);

        registerFactory<interfaces.Factory<Katana>, Katana>("Factory<Katana>", (context: interfaces.Context) => {
            return () => {
                return context.container.get<Katana>("Katana");
            };
        });

        registerFactory<interfaces.Factory<Shuriken>, Shuriken>("Factory<Shuriken>", (context: interfaces.Context) => {
            return () => {
                return context.container.get<Shuriken>("Shuriken");
            };
        });

        register<Ninja>("Ninja", ["Factory<Katana>", "Factory<Shuriken>"])(Ninja);

        let ninja1 = container.get<Ninja>("Ninja");
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

        type KatanaProvider = () => Promise<Katana>;
        type ShurikenProvider = () => Promise<Katana>;

        class Ninja {

            public katana: Katana | null;
            public shuriken: Shuriken | null;
            public katanaProvider: KatanaProvider;
            public shurikenProvider: ShurikenProvider;
            private _health: number;

            public constructor(
                katanaProvider: KatanaProvider,
                shurikenProvider: ShurikenProvider
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

        registerProvider<KatanaProvider, Katana>("Provider<Katana>", (context) => {
            return () => {
                return new Promise<Katana>((resolve) => {
                    let katana = context.container.get<Katana>("Katana");
                    resolve(katana);
                });
            };
        });

        registerProvider<ShurikenProvider, Shuriken>("Provider<Shuriken>", (context) => {
            return () => {
                return new Promise<Shuriken>((resolve) => {
                    let katana = context.container.get<Shuriken>("Shuriken");
                    resolve(katana);
                });
            };
        });

        register<Ninja>("Ninja", ["Provider<Katana>", "Provider<Shuriken>"])(Ninja);

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
