import { expect } from "chai";
import { Container } from "inversify";
import { helpers } from "../src/index";
import getDecorators from "inversify-inject-decorators";

describe("Lazy Injections", () => {

    it("Should be able to use lazyInject", () => {

        let TYPES = {
            SomeComponent: "SomeComponent",
            SomeDependency: "SomeDependency"
        };

        class MyComponent {

            private _someProperty: any;

            public render() {
                return this._someProperty.doSomething();
            }
        }

        let myContainer = new Container();
        let { lazyInject } = getDecorators(myContainer);

        helpers.annotate(MyComponent, [
            // No constructor injection
        ]);

        lazyInject(TYPES.SomeDependency)(MyComponent.prototype, "_someProperty");

        myContainer.bind(TYPES.SomeDependency).toConstantValue(
            { doSomething: () => "something" }
        );

        myContainer.bind(TYPES.SomeComponent).to(MyComponent);

        let component = myContainer.get<MyComponent>(TYPES.SomeComponent);
        expect(component.render()).eql("something");

    });

    it("Should be able to use lazyInject when a class is not resolved", () => {

        let TYPES = {
            SomeComponent: "SomeComponent",
            SomeDependency: "SomeDependency"
        };

        class MyComponent {

            public props: any;
            private _someProperty: any;

            constructor(props: any) {
                this.props = props;
            }

            public render() {
                return this._someProperty.doSomething();
            }
        }

        let myContainer = new Container();
        let { lazyInject } = getDecorators(myContainer);

        myContainer.bind(TYPES.SomeDependency).toConstantValue(
            { doSomething: () => "something" }
        );

        lazyInject(TYPES.SomeDependency)(MyComponent.prototype, "_someProperty");
        myContainer.bind(TYPES.SomeComponent).to(MyComponent);

        let component = new MyComponent({ prop1: "prop1" });
        expect(component.render()).eql("something");
        expect(component.props.prop1).eql("prop1");

    });

});
