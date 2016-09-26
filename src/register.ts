import { interfaces } from "inversify";
import * as helperInterfaces from "./interfaces";
import annotate from "./annotate";

function register(kernel: interfaces.Kernel) {
    return <T>(
        identifier: interfaces.ServiceIdentifier<T>,
        dependencies: helperInterfaces.Injection[] = [],
        constraint?: (binding: interfaces.BindingInWhenOnSyntax<T>) => void
    ) => (constructor: interfaces.Newable<T>) => {
        annotate<T>(constructor, dependencies);
        let binding = kernel.bind<T>(identifier).to(constructor);
        if (constraint !== undefined) {
            constraint(binding);
        }
    };
}

function registerSelf(kernel: interfaces.Kernel) {
    return <T>(
        dependencies: helperInterfaces.Injection[] = [],
        constraint?: (binding: interfaces.BindingInWhenOnSyntax<T>) => void
    ) => (constructor: interfaces.Newable<T>) => {
        annotate<T>(constructor, dependencies);
        let binding = kernel.bind<T>(constructor).toSelf();
        if (constraint !== undefined) {
            constraint(binding);
        }
    };
}

function registerConstructor(kernel: interfaces.Kernel) {
    return <T>(
        identifier: interfaces.ServiceIdentifier<T>,
        constraint?: (binding: interfaces.BindingWhenOnSyntax<T>) => void
    ) => (constructor: interfaces.Newable<T>) => {
        let binding = kernel.bind<T>(identifier).toConstructor(constructor);
        if (constraint !== undefined) {
            constraint(binding);
        }
    };
}

function registerConstantValue(kernel: interfaces.Kernel) {
    return <T>(
        identifier: interfaces.ServiceIdentifier<T>,
        value: T,
        constraint?: (binding: interfaces.BindingWhenOnSyntax<T>) => void
    ) => {
        let binding = kernel.bind<T>(identifier).toConstantValue(value);
        if (constraint !== undefined) {
            constraint(binding);
        }
    };
}

function registerDynamicValue(kernel: interfaces.Kernel) {
    return <T>(
        identifier: interfaces.ServiceIdentifier<T>,
        func: (context: interfaces.Context) => T,
        constraint?: (binding: interfaces.BindingInWhenOnSyntax<T>) => void
    ) => {
        let binding = kernel.bind<T>(identifier).toDynamicValue(func);
        if (constraint !== undefined) {
            constraint(binding);
        }
    };
}

function registerFunction(kernel: interfaces.Kernel) {
    return <T extends Function>(
        identifier: interfaces.ServiceIdentifier<T>,
        func: T,
        constraint?: (binding: interfaces.BindingWhenOnSyntax<T>) => void
    ) => {
        let binding = kernel.bind<T>(identifier).toFunction(func);
        if (constraint !== undefined) {
            constraint(binding);
        }
    };
}

function registerAutoFactory(kernel: interfaces.Kernel) {
    return <T1, T2>(
        factoryIdentifier: interfaces.ServiceIdentifier<T1>,
        serviceIdentifier: interfaces.ServiceIdentifier<T2>,
        constraint?: (binding: interfaces.BindingWhenOnSyntax<T1>) => void
    ) => {
        let binding = kernel.bind<T1>(factoryIdentifier).toAutoFactory<T2>(serviceIdentifier);
        if (constraint !== undefined) {
            constraint(binding);
        }
    };
}

function registerFactory(kernel: interfaces.Kernel) {
    return <T1, T2>(
        identifier: interfaces.ServiceIdentifier<T1>,
        factory: interfaces.FactoryCreator<T2>,
        constraint?: (binding: interfaces.BindingWhenOnSyntax<T1>) => void
    ) => {
        let binding = kernel.bind<T1>(identifier).toFactory<T2>(factory);
        if (constraint !== undefined) {
            constraint(binding);
        }
    };
}

function registerProvider(kernel: interfaces.Kernel) {
    return <T1, T2>(
        identifier: interfaces.ServiceIdentifier<T1>,
        provider: interfaces.ProviderCreator<T2>,
        constraint?: (binding: interfaces.BindingWhenOnSyntax<T1>) => void
    ) => {
        let binding = kernel.bind<T1>(identifier).toProvider<T2>(provider);
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
