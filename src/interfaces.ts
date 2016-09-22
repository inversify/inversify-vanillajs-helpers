import { interfaces } from "inversify";

export interface BasicInjection {
    type: interfaces.ServiceIdentifier<any>;
}

export interface NamedInjection extends BasicInjection {
    named: string;
}

export interface TaggedInjection extends BasicInjection {
    tagged: { key: string, val: string };
}

export type Injection = (interfaces.ServiceIdentifier<any>|BasicInjection|NamedInjection|TaggedInjection);
