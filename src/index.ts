import annotate from "./annotate";
import * as interfaces from "./interfaces";
import { interfaces as inversifyInterfaces } from "inversify";
import {
    register,
    registerSelf,
    registerConstantValue,
    registerDynamicValue,
    registerConstructor,
    registerFunction,
    registerAutoFactory,
    registerFactory,
    registerProvider
} from "./register";

let helpers = {
    annotate,
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

export { interfaces, inversifyInterfaces, helpers };
