import { decorate, inject, injectable, interfaces } from "inversify";

function register<T>(
    kernel: interfaces.Kernel,
    identifier: interfaces.ServiceIdentifier<T>,
    constructor,
    dependencies: interfaces.ServiceIdentifier<T>[]
) {
    inversify.decorate(inversify.injectable(), constructor);
    (dependencies || []).forEach(function(dependency, index) {
        inversify.decorate(inversify.inject(dependency), constructor, index);
    });
    return kernel.bind(identifier).to(constructor);
}

function registerSelf<T>(kernel: interfaces.Kernel, constructor) {
    // TODO
}

function registerConstantValue<T>(
    kernel: interfaces.Kernel,
    identifier: interfaces.ServiceIdentifier<T>, value) {
    // TODO
}

function registerDynamicValue<T>(
    kernel: interfaces.Kernel,
    identifier: interfaces.ServiceIdentifier<T>, factory) {
    // TODO
}

function registerConstructor<T>(
    kernel: interfaces.Kernel,
    identifier: interfaces.ServiceIdentifier<T>, constructor) {
    // TODO
}

function registerFunction<T>(
    kernel: interfaces.Kernel,
    identifier: interfaces.ServiceIdentifier<T>, func) {
    // TODO
}

function registerAutoFactory<T>(
    kernel: interfaces.Kernel,
    identifier: interfaces.ServiceIdentifier<T>, constructor) {
    // TODO
}

function registerFactory<T>(
    kernel: interfaces.Kernel,
    identifier: interfaces.ServiceIdentifier<T>, factory) {
    // TODO
}

function registerProvider<T>(
    kernel: interfaces.Kernel,
    identifier: interfaces.ServiceIdentifier<T>, factory) {
    // TODO
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
