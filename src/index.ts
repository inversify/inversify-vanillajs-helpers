import { annotate } from "./annotate";
import * as interfaces from "./interfaces";
import { interfaces as inversifyInterfaces } from "inversify";
import {
    register,
    registerAutoFactory,
    registerConstantValue,
    registerConstructor,
    registerDynamicValue,
    registerFactory,
    registerFunction,
    registerProvider,
    registerSelf
} from "./register";

let helpers = {
    annotate,
    register,
    registerAutoFactory,
    registerConstantValue,
    registerConstructor,
    registerDynamicValue,
    registerFactory,
    registerFunction,
    registerProvider,
    registerSelf
};

export { interfaces, inversifyInterfaces, helpers };
