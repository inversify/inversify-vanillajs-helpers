import { decorate, injectable, inject } from "inversify";

function annotate(constructor, dependencies) {
    decorate(injectable(), constructor);
    (dependencies || []).forEach(function(dependency, index) {
        decorate(inject(dependency), constructor, index);
    });
}

export default annotate;
