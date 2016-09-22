import { decorate, injectable, inject, named, tagged, interfaces } from "inversify";
import { Injection, TaggedInjection, NamedInjection, BasicInjection } from "./interfaces";

function annotate<T>(constructor: interfaces.Newable<T>, dependencies: Injection[] = []): void {

    decorate(injectable(), constructor);

    (dependencies).forEach((injection: Injection, index: number) => {

        if ((injection as BasicInjection).type === undefined) {

            // Add inject metadata
            decorate(
                inject(
                    (injection as interfaces.ServiceIdentifier<T>)
                ),
                constructor,
                index
            );

        } else {

            // Add inject metadata
            decorate(
                inject(
                    (injection as BasicInjection).type
                ),
                constructor,
                index
            );

            // Add named metadata
            if ((injection as NamedInjection).named !== undefined) {
                decorate(
                    named(
                        (injection as NamedInjection).named
                    ),
                    constructor,
                    index
                );
            }

            // Add tagged metadata
            if ((injection as TaggedInjection).tagged !== undefined) {
                decorate(
                    tagged(
                        (injection as TaggedInjection).tagged.key,
                        (injection as TaggedInjection).tagged.val
                    ),
                    constructor,
                    index
                );
            }

        }

    });

}

export default annotate;
