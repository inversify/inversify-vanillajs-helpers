import { decorate, injectable, inject, tagged, named, interfaces } from "inversify";
import * as helperInterfaces from "./interfaces";

function annotate<T>(
    constructor: interfaces.Newable<T>,
    dependencies: helperInterfaces.Injection[] = []
): void {

    decorate(injectable(), constructor);

    (dependencies).forEach((injection: helperInterfaces.Injection, index: number) => {

        if ((injection as helperInterfaces.BasicInjection).type === undefined) {

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
                    (injection as helperInterfaces.BasicInjection).type
                ),
                constructor,
                index
            );

            // Add named metadata
            if ((injection as helperInterfaces.NamedInjection).named !== undefined) {

                decorate(
                    named(
                        (injection as helperInterfaces.NamedInjection).named
                    ),
                    constructor,
                    index
                );
            }

            // Add tagged metadata
            if ((injection as helperInterfaces.TaggedInjection).tagged !== undefined) {

                decorate(
                    tagged(
                        (injection as helperInterfaces.TaggedInjection).tagged.key,
                        (injection as helperInterfaces.TaggedInjection).tagged.val
                    ),
                    constructor,
                    index
                );
            }

        }

    });

}

export default annotate;
