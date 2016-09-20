import { decorate, injectable, inject, interfaces } from "inversify";

function annotate<T>(
    constructor: interfaces.Newable<T>,
    dependencies: interfaces.ServiceIdentifier<T>[] = []
): void {

    decorate(injectable(), constructor);
    (dependencies).forEach(function(dependency, index) {
        decorate(inject(dependency), constructor, index);
    });

}

export default annotate;
