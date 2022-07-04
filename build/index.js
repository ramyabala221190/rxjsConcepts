"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("./users");
const rxjs_1 = require("rxjs");
function subscribe(subscriber) {
    //this is the function that will be executed when an observable is subscribed to
    if (users_1.users.length === 0) {
        subscriber.error('no data'); //when this executes no further values will be pushed to the observer
    }
    for (let user of users_1.users) {
        subscriber.next(user); //push value to the observer
    }
    setTimeout(() => {
        subscriber.complete(); //when this executes no further values will be pushed to the observer. Will not execute if observable errors out
    }, 2000);
}
let allUsersObservbale$ = new rxjs_1.Observable(subscribe);
//subscribe method will execute the subscribe() and pass the values to the observer object
allUsersObservbale$.subscribe({
    next: (user) => console.log(user.id),
    error: (e) => console.error('Some error has occured', e),
    complete: () => console.info('observable has finished pushing all values'),
});
let source1$ = (0, rxjs_1.of)('hello', 1, true, users_1.users[1].name); //This observable accepts individuals values
/*
Here the of operator creates an observable from values passed as argument. Earlier we created an observable using new Observable()
and used the next(), error() and complete() to pass values/messages to the observable.
*/
let source2$ = (0, rxjs_1.from)(users_1.users); //This observable accepts a group of values ie an array or promise or observable
source2$.subscribe({
    next: (result) => console.log(result),
    error: (err) => console.error(err),
    complete: () => console.log('observable 2 has finished pushing all values'),
});
source1$.subscribe({
    next: (result) => console.log(result),
    error: (err) => console.log(err),
    complete: () => console.info('observable 1 has finished pushing all values'),
});
//multiple observers subscribig to the same observable
let time$ = new rxjs_1.Observable(function subscribe(subscriber) {
    let timeStamp = new Date().toLocaleDateString(); //source of data
    subscriber.next(timeStamp); //subscriber pushing the value to the observer
    subscriber.complete();
});
time$.subscribe({
    next: (result) => console.log('First Observer', result),
    error: (err) => console.error(err),
    complete: () => console.log("1st execution of time observable completed"),
});
setTimeout(() => {
    time$.subscribe({
        next: (result) => console.log('Second Observer', result),
        error: (err) => console.error(err),
        complete: () => console.log("2nd execution of time observable completed"),
    });
}, 1000);
setTimeout(() => {
    time$.subscribe({
        next: (result) => console.log('Third Observer', result),
        error: (err) => console.error(err),
        complete: () => console.log("3rd execution of time observable completed"),
    });
}, 2000);
//cancelling the observable execution
let interval$ = (0, rxjs_1.interval)(1000);
let intervalSubs = interval$.subscribe({
    next: (result) => console.log(`${new Date().toLocaleDateString()} ${result}`),
    error: (err) => console.error(err),
    complete: () => console.log("execution of interval observable completed"),
});
setTimeout(() => {
    intervalSubs.unsubscribe(); //completion message wont be displayed because observable is cancelled
}, 3000);
