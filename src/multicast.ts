// using multicast() operator to multicast cold observables

import { ConnectableObservable, interval, Subject } from "rxjs";
import { multicast, publish, refCount, share, take, tap } from "rxjs/operators";

const source1$= interval(1000).pipe(
    take(4),
    multicast(new Subject())
) as ConnectableObservable<number>

// source1$.subscribe(value=>console.log(`Observer 1 of hot multicast observable : ${value}`))

// setTimeout(()=>{
//     source1$.subscribe(value=>console.log(`Observer 2 of hot multicast observable : ${value}`))
// },1000)

// setTimeout(()=>{
//     source1$.subscribe(value=>console.log(`Observer 3 of hot multicast observable : ${value}`))
// },2000)

// setTimeout(()=>{
//     source1$.subscribe(
//         value=>console.log(`Observer 4 of Hot multicast observable : ${value}`),
//         err=>console.log(err),
//         ()=>console.log("Observer 4 completed")
    
//     )
// },4500)


//multicast operator wont allow the values to be emitted from the observable untill connect()
//is called on the observable. This gives us flexibility to set up the observers before the values are emitted.

source1$.connect();

/*
O/P:

Observer 1 of hot multicast observable : 0
Observer 2 of hot multicast observable : 0
Observer 1 of hot multicast observable : 1
Observer 2 of hot multicast observable : 1
Observer 3 of hot multicast observable : 1
Observer 1 of hot multicast observable : 2
Observer 2 of hot multicast observable : 2
Observer 3 of hot multicast observable : 2
Observer 1 of hot multicast observable : 3
Observer 2 of hot multicast observable : 3
Observer 3 of hot multicast observable : 3
Observer 4 completed

Since Observer 4 subscribes only after all the values have been emitted by the observable,
it receives no values. Just the complete() of observer 4 is called.
The O/P is same as using a Subject in between the observable and observer as shown in subjects.ts
*/


/* In case I dont want to manually call connect() on the observable and automatically start
execution, when there is atleast 1 observer, I go for combination of multicast() and refCount   */


const source2$= interval(1000).pipe(
    take(4),
    multicast(new Subject()),
    refCount(),
    tap(x=>console.log("Value emitted",x))
)

// source2$.subscribe(value=>console.log(`Observer 1 of hot multicast+refCount observable : ${value}`))

// setTimeout(()=>{
//     source2$.subscribe(value=>console.log(`Observer 2 of hot multicast+refCount observable : ${value}`))
// },1000)

// setTimeout(()=>{
//     source2$.subscribe(value=>console.log(`Observer 3 of hot multicast+refCount observable : ${value}`))
// },2000)

// setTimeout(()=>{
//     source2$.subscribe(
//         value=>console.log(`Observer 4 of hot multicast+refCount observable : ${value}`),
//         err=>console.log(err),
//         ()=>console.log("Observer 4 completed")
    
//         )
// },4500)

/*
O/P:

Value emitted 0
Observer 1 of hot multicast+refCount observable : 0
Value emitted 1
Observer 1 of hot multicast+refCount observable : 1
Value emitted 1
Observer 2 of hot multicast+refCount observable : 1
Value emitted 1
Observer 3 of hot multicast+refCount observable : 1
Value emitted 2
Observer 1 of hot multicast+refCount observable : 2
Value emitted 2
Observer 2 of hot multicast+refCount observable : 2
Value emitted 2
Observer 3 of hot multicast+refCount observable : 2
Value emitted 3
Observer 1 of hot multicast+refCount observable : 3
Value emitted 3
Observer 2 of hot multicast+refCount observable : 3
Value emitted 3
Observer 3 of hot multicast+refCount observable : 3
Observer 4 completed

refCount causes the first value to be emitted as soon as the first observer subscribes. 
Since the 2nd observer subscribes only after 1sec, only the first observer receives value 0.
By the time value 1 is emitted, all 3 obsevers have subscribed to the subject.
Thus all 3 observers receive values 1,2 and 3.

Since observer 4 subscribes after 4.5 secs, by that time, the observable has already emitted
all the values and late subscribers dont receive any values. 
Just the complete() of observer 4 is executed.
*/


/*
I can replace multicast(new Subject()) with publish(), where latter will take care of Subject
creation on its own. The output is the same.

*/

const source3$= interval(1000).pipe(
    take(4),
    publish(),
    refCount(),
    tap(x=>console.log("Value emitted",x))
)

// source3$.subscribe(value=>console.log(`Observer 1 of hot publish observable : ${value}`))

// setTimeout(()=>{
//     source3$.subscribe(value=>console.log(`Observer 2 of hot publish observable : ${value}`))
// },1000)

// setTimeout(()=>{
//     source3$.subscribe(value=>console.log(`Observer 3 of hot publish observable : ${value}`))
// },2000)

// setTimeout(()=>{
//     source3$.subscribe(
//         value=>console.log(`Observer 4 of hot publish observable : ${value}`),
//         err=>console.log(err),
//         ()=>console.log("Observer 4 completed")
    
//         )
// },4500)

/*
Replacing publish() and refCount() with share(). share() internally uses refCount() to trigger the
observable to emit valus as soon as there is atleast 1 observer.
But in case any observer subscribes after the observable has emitted all the values, share()
will trigger the re-execution of the observable and the late subscriber will receive all the values.
This is the advantage of share() has over the other operators.
*/

const source4$= interval(1000).pipe(
    take(4),
    share(),
    tap(x=>console.log("Value emitted",x))
)

source4$.subscribe(value=>console.log(`Observer 1 of hot share observable : ${value}`))

setTimeout(()=>{
    source4$.subscribe(value=>console.log(`Observer 2 of hot share observable : ${value}`))
},1000)

setTimeout(()=>{
    source4$.subscribe(value=>console.log(`Observer 3 of hot share observable : ${value}`))
},2000)

setTimeout(()=>{
    source4$.subscribe(
        value=>console.log(`Observer 4 of hot share observable : ${value}`),
        err=>console.log(err),
        ()=>console.log("Observer 4 completed")
    
        )
},4500)

/*
O/P:

Value emitted 0
Observer 1 of hot share observable : 0
Value emitted 1
Observer 1 of hot share observable : 1
Value emitted 1
Observer 2 of hot share observable : 1
Value emitted 1
Observer 3 of hot share observable : 1
Value emitted 2
Observer 1 of hot share observable : 2
Value emitted 2
Observer 2 of hot share observable : 2
Value emitted 2
Observer 3 of hot share observable : 2
Value emitted 3
Observer 1 of hot share observable : 3
Value emitted 3
Observer 2 of hot share observable : 3
Value emitted 3
Observer 3 of hot share observable : 3
Value emitted 0
Observer 4 of hot share observable : 0
Value emitted 1
Observer 4 of hot share observable : 1
Value emitted 2
Observer 4 of hot share observable : 2
Value emitted 3
Observer 4 of hot share observable : 3
Observer 4 completed



*/