import { interfaces } from "inversify";
import * as helperInterfaces from "./interfaces";
import annotate from "./annotate";

function register(container: interfaces.Container) {
    return <T>(
        identifier: interfaces.ServiceIdentifier<T>,
        dependencies: helperInterfaces.Injection[] = [],
        constraint?: (binding: interfaces.BindingInWhenOnSyntax<T>) => void
    ) => (constructor: interfaces.Newable<T>) => {
        annotate<T>(constructor, dependencies);
        let binding = container.bind<T>(identifier).to(constructor);
        if (constraint !== undefined) {
            constraint(binding);
        }
    };
}

function registerSelf(container: interfaces.Container) {
    return <T>(
        dependencies: helperInterfaces.Injection[] = [],
        constraint?: (binding: interfaces.BindingInWhenOnSyntax<T>) => void
    ) => (constructor: interfaces.Newable<T>) => {
        annotate<T>(constructor, dependencies);
        let binding = container.bind<T>(constructor).toSelf();
        if (constraint !== undefined) {
            constraint(binding);
        }
    };
}

function registerConstructor(container: interfaces.Container) {
    return <T>(
        identifier: interfaces.ServiceIdentifier<T>,
        constraint?: (binding: interfaces.BindingWhenOnSyntax<T>) => void
    ) => (constructor: interfaces.Newable<T>) => {
        let binding = container.bind<T>(identifier).toConstructor(constructor);
        if (constraint !== undefined) {
            constraint(binding);
        }
    };
}

function registerConstantValue(container: interfaces.Container) {
    return <T>(
        identifier: interfaces.ServiceIdentifier<T>,
        value: T,
        constraint?: (binding: interfaces.BindingWhenOnSyntax<T>) => void
    ) => {
        let binding = container.bind<T>(identifier).toConstantValue(value);
        if (constraint !== undefined) {
            constraint(binding);
        }
    };
}

function registerDynamicValue(container: interfaces.Container) {
    return <T>(
        identifier: interfaces.ServiceIdentifier<T>,
        func: (context: interfaces.Context) => T,
        constraint?: (binding: interfaces.BindingInWhenOnSyntax<T>) => void
    ) => {
        let binding = container.bind<T>(identifier).toDynamicValue(func);
        if (constraint !== undefined) {
            constraint(binding);
        }
    };
}

function registerFunction(container: interfaces.Container) {
    return <T extends Function>(
        identifier: interfaces.ServiceIdentifier<T>,
        func: T,
        constraint?: (binding: interfaces.BindingWhenOnSyntax<T>) => void
    ) => {
        let binding = container.bind<T>(identifier).toFunction(func);
        if (constraint !== undefined) {
            constraint(binding);
        }
    };
}

function registerAutoFactory(container: interfaces.Container) {
    return <T1, T2>(
        factoryIdentifier: interfaces.ServiceIdentifier<T1>,
        serviceIdentifier: interfaces.ServiceIdentifier<T2>,
        constraint?: (binding: interfaces.BindingWhenOnSyntax<T1>) => void
    ) => {
        let binding = container.bind<T1>(factoryIdentifier).toAutoFactory<T2>(serviceIdentifier);
        if (constraint !== undefined) {
            constraint(binding);
        }
    };
}

function registerFactory(container: interfaces.Container) {
    return <T1, T2>(
        identifier: interfaces.ServiceIdentifier<T1>,
        factory: interfaces.FactoryCreator<T2>,
        constraint?: (binding: interfaces.BindingWhenOnSyntax<T1>) => void
    ) => {
        let binding = container.bind<T1>(identifier).toFactory<T2>(factory);
        if (constraint !== undefined) {
            constraint(binding);
        }
    };
}

function registerProvider(container: interfaces.Container) {
    return <T1, T2>(
        identifier: interfaces.ServiceIdentifier<T1>,
        provider: interfaces.ProviderCreator<T2>,
        constraint?: (binding: interfaces.BindingWhenOnSyntax<T1>) => void
    ) => {
        let binding = container.bind<T1>(identifier).toProvider<T2>(provider);
        if (constraint !== undefined) {
            constraint(binding);
        }
    };
}

export {
    register,
    registerSelf,
    registerConstantValue,
    registerDynamicValue,
    registerConstructor,
    registerFunction,
    registerAutoFactory,
    registerFactory,
    registerProvider
};
