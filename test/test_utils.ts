import { expect } from "chai";

export const expectNoRejectedPromise = (msg: string) => (e: Error) => {
    setTimeout(function() {
        console.error(msg, e);
        expect(e).to.eql(undefined);
    });
};
