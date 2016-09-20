import { interfaces } from "inversify";
import annotate from "./annotate";

function register<T>(
    kernel: interfaces.Kernel,
    identifier: interfaces.ServiceIdentifier<T>,
    constructor: interfaces.Newable<T>,
    dependencies: interfaces.ServiceIdentifier<T>[] = []
) {
    annotate<T>(constructor, dependencies);
    return kernel.bind(identifier).to(constructor);
}

function registerSelf<T>(
    kernel: interfaces.Kernel,
    constructor: interfaces.Newable<T>,
    dependencies?: interfaces.ServiceIdentifier<T>[]
) {
    annotate<T>(constructor, dependencies);
    return kernel.bind(constructor).toSelf();
}

function registerConstantValue<T>(
    kernel: interfaces.Kernel,
    identifier: interfaces.ServiceIdentifier<T>,
    value: T
) {
    return kernel.bind(identifier).toConstantValue(value);
}

function registerDynamicValue<T>(
    kernel: interfaces.Kernel,
    identifier: interfaces.ServiceIdentifier<T>,
    func: (context: interfaces.Context) => T
) {
    return kernel.bind(identifier).toDynamicValue(func);
}

function registerConstructor<T>(
    kernel: interfaces.Kernel,
    identifier: interfaces.ServiceIdentifier<T>,
    constructor: interfaces.Newable<T>
) {
    return kernel.bind(identifier).toConstructor(constructor);
}

function registerFunction<T extends Function>(
    kernel: interfaces.Kernel,
    identifier: interfaces.ServiceIdentifier<T>,
    func: T
) {
    return kernel.bind(identifier).toFunction(func);
}

function registerAutoFactory<T1, T2>(
    kernel: interfaces.Kernel,
    factoryIdentifier: interfaces.ServiceIdentifier<T1>,
    serviceIdentifier: interfaces.ServiceIdentifier<T2>
) {
    return kernel.bind(factoryIdentifier).toAutoFactory(serviceIdentifier);
}

function registerFactory<T1, T2>(
    kernel: interfaces.Kernel,
    identifier: interfaces.ServiceIdentifier<T1>,
    factory: interfaces.FactoryCreator<T2>
) {
    return kernel.bind(identifier).toFactory(factory);
}

function registerProvider<T1, T2>(
    kernel: interfaces.Kernel,
    identifier: interfaces.ServiceIdentifier<T1>,
    provider: interfaces.ProviderCreator<T2>
) {
    return kernel.bind(identifier).toProvider(provider);
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
