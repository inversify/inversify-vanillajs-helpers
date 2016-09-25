import { interfaces } from "inversify";
import * as helperInterfaces from "./interfaces";
import annotate from "./annotate";

function register(kernel: interfaces.Kernel) {
    return <T>(
        identifier: interfaces.ServiceIdentifier<T>,
        constructor: interfaces.Newable<T>,
        dependencies: helperInterfaces.Injection[] = []
    ) => {
        annotate<T>(constructor, dependencies);
        return kernel.bind<T>(identifier).to(constructor);
    };
}

function registerSelf(kernel: interfaces.Kernel) {
    return <T>(
        constructor: interfaces.Newable<T>,
        dependencies: helperInterfaces.Injection[] = []
    ) => {
        annotate<T>(constructor, dependencies);
        return kernel.bind<T>(constructor).toSelf();
    };
}

function registerConstantValue(kernel: interfaces.Kernel) {
    return <T>(
        identifier: interfaces.ServiceIdentifier<T>,
        value: T
    ) => {
        return kernel.bind<T>(identifier).toConstantValue(value);
    };
}

function registerDynamicValue(kernel: interfaces.Kernel) {
    return <T>(
        identifier: interfaces.ServiceIdentifier<T>,
        func: (context: interfaces.Context) => T
    ) => {
        return kernel.bind<T>(identifier).toDynamicValue(func);
    };
}

function registerConstructor(kernel: interfaces.Kernel) {
    return <T>(
        identifier: interfaces.ServiceIdentifier<T>,
        constructor: interfaces.Newable<T>
    ) => {
        return kernel.bind<T>(identifier).toConstructor(constructor);
    };
}

function registerFunction(kernel: interfaces.Kernel) {
    return <T extends Function>(
        identifier: interfaces.ServiceIdentifier<T>,
        func: T
    ) => {
        return kernel.bind<T>(identifier).toFunction(func);
    };
}

function registerAutoFactory(kernel: interfaces.Kernel) {
    return <T1, T2>(
        factoryIdentifier: interfaces.ServiceIdentifier<T1>,
        serviceIdentifier: interfaces.ServiceIdentifier<T2>
    ) => {
        return kernel.bind<T1>(factoryIdentifier).toAutoFactory<T2>(serviceIdentifier);
    };
}

function registerFactory(kernel: interfaces.Kernel) {
    return <T1, T2>(
        identifier: interfaces.ServiceIdentifier<T1>,
        factory: interfaces.FactoryCreator<T2>
    ) => {
        return kernel.bind<T1>(identifier).toFactory<T2>(factory);
    };
}

function registerProvider(kernel: interfaces.Kernel) {
    return <T1, T2>(
        identifier: interfaces.ServiceIdentifier<T1>,
        provider: interfaces.ProviderCreator<T2>
    ) => {
        return kernel.bind<T1>(identifier).toProvider<T2>(provider);
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
