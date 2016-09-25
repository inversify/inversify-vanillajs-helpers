import * as inversify from "inversify";

export interface BasicInjection {
    type: inversify.interfaces.ServiceIdentifier<any>;
}

export interface NamedInjection extends BasicInjection {
    named: string;
}

export interface TaggedInjection extends BasicInjection {
    tagged: { key: string, val: string };
}

export type Injection = (
    inversify.interfaces.ServiceIdentifier<any>|
    BasicInjection|
    NamedInjection|
    TaggedInjection
);
