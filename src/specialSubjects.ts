import { BehaviorSubject, ConnectableObservable, interval, Observable } from "rxjs";
import { multicast, publishBehavior, publishLast, publishReplay, refCount, take, tap } from "rxjs/operators";

/*
publishLast() uses the Async Subject to push the last value emitted by the observable to all its
observers.
Since it uses refCount(), the observable will emit the last value only when there is atleast
1 observer
*/

const source1$=interval(1000).pipe(
    take(4),
    publishLast(),
    refCount()
)

// source1$.subscribe(value=>console.log(`Observer 1 of hot publishLast observable : ${value}`))

// setTimeout(()=>{
//     source1$.subscribe(value=>console.log(`Observer 2 of hot publishLast observable : ${value}`))
// },1000)

// setTimeout(()=>{
//     source1$.subscribe(value=>console.log(`Observer 3 of hot publishLast observable : ${value}`))
// },2000)

// setTimeout(()=>{
//     source1$.subscribe(
//         value=>console.log(`Observer 4 of Hot publishLast observable : ${value}`),
//         err=>console.log(err),
//         ()=>console.log("Observer 4 completed")
    
//     )
// },4500)

/*
O/P:

Observer 1 of hot multicast observable : 3
Observer 2 of hot multicast observable : 3
Observer 3 of hot multicast observable : 3
Observer 4 of Hot multicast observable : 3
Observer 4 completed

All observers receive the last value emitted by the observable. Even the observer that subscribed after
the observable had emitted all the 4 values has received the last value.


*/

/*
publishBehavior() uses the Behavior Subject to emit an initial value to the observer which has subscribed
to the subject before the observable has started emitting values to the subject.

Like a normal Subject, it too doesnt emit any values to observers which have subscribed to the subject
after the observable has emitted all the values.

Since it uses refCount(), the observable will emit the last value only when there is atleast
1 observer
*/

const source2$=interval(1000).pipe(
    take(4),
    publishBehavior(30),
    refCount(),
    tap(x=>console.log(`Value emitted: ${x}`))
)

// source2$.subscribe(value=>console.log(`Observer 1 of hot publishBehavior observable : ${value}`))

// setTimeout(()=>{
//     source2$.subscribe(value=>console.log(`Observer 2 of hot publishBehavior observable : ${value}`))
// },1000)

// setTimeout(()=>{
//     source2$.subscribe(value=>console.log(`Observer 3 of hot publishBehavior observable : ${value}`))
// },2000)

// setTimeout(()=>{
//     source2$.subscribe(
//         value=>console.log(`Observer 4 of Hot publishBehavior observable : ${value}`),
//         err=>console.log(err),
//         ()=>console.log("Observer 4 completed")
    
//     )
// },4500)

/*
O/P:

Observer 1 of hot publishBehavior observable : 30
Observer 1 of hot publishBehavior observable : 0
Observer 2 of hot publishBehavior observable : 0
Observer 3 of hot publishBehavior observable : 0
Observer 1 of hot publishBehavior observable : 1
Observer 2 of hot publishBehavior observable : 1
Observer 3 of hot publishBehavior observable : 1
Observer 1 of hot publishBehavior observable : 2
Observer 2 of hot publishBehavior observable : 2
Observer 3 of hot publishBehavior observable : 2
Observer 1 of hot publishBehavior observable : 3
Observer 2 of hot publishBehavior observable : 3
Observer 3 of hot publishBehavior observable : 3
Observer 4 completed

Here Observer 1 has received the initial seed value of 30 because it had subscribed to the subject
before the observable had started emitting values.

After 1 sec, observable emits 0. At the end of 1 sec, we have 2 Observers. Both receive value 0.
After 1 sec, 2 secs are completed and Observable emits 1. 
At the end of 2 secs, we have 3 Observers.
Observer 3 will also receive the most recent of the previous values emitted by observable i.e 0.

After this the 3 observers receive all other values i.e 1,2 and 3.

The 4th Observer which has subscribed after the observable has emitted all values, wont receive any value
*/


/*
publishReplay() uses the ReplaySubject internally

*/

const source3$=interval(1000).pipe(
    take(4),
    publishReplay(),
    refCount(),
    tap(x=>console.log(`Value emitted: ${x}`))
)

// source3$.subscribe(value=>console.log(`Observer 1 of hot publishReplay observable : ${value}`))

// setTimeout(()=>{
//     source3$.subscribe(value=>console.log(`Observer 2 of hot publishReplay observable : ${value}`))
// },1000)

// setTimeout(()=>{
//     source3$.subscribe(value=>console.log(`Observer 3 of hot publishReplay observable : ${value}`))
// },2000)

// setTimeout(()=>{
//     source3$.subscribe(
//         value=>console.log(`Observer 4 of Hot publishReplay observable : ${value}`),
//         err=>console.log(err),
//         ()=>console.log("Observer 4 completed")
    
//     )
// },4500)

/*
O/P:

Value emitted: 0
Observer 1 of hot publishReplay observable : 0
Value emitted: 0
Observer 2 of hot publishReplay observable : 0
Value emitted: 1
Observer 1 of hot publishReplay observable : 1
Value emitted: 1
Observer 2 of hot publishReplay observable : 1
Value emitted: 0
Observer 3 of hot publishReplay observable : 0
Value emitted: 1
Observer 3 of hot publishReplay observable : 1
Value emitted: 2
Observer 1 of hot publishReplay observable : 2
Value emitted: 2
Observer 2 of hot publishReplay observable : 2
Value emitted: 2
Observer 3 of hot publishReplay observable : 2
Value emitted: 3
Observer 1 of hot publishReplay observable : 3
Value emitted: 3
Observer 2 of hot publishReplay observable : 3
Value emitted: 3
Observer 3 of hot publishReplay observable : 3
Value emitted: 0
Observer 4 of Hot publishReplay observable : 0
Value emitted: 1
Observer 4 of Hot publishReplay observable : 1
Value emitted: 2
Observer 4 of Hot publishReplay observable : 2
Value emitted: 3
Observer 4 of Hot publishReplay observable : 3
Observer 4 completed


Here all observers receive all values irrespective of when they have subscribed. publishReplay()
with no arguments will replay all values to all observers.
*/

/*
Below is an example of publishReplay() with arguments. The argument specifies how many previous values
will be replayed to late subscribers.
*/

const source4$=interval(1000).pipe(
    take(4),
    publishReplay(1),
    refCount(),
    tap(x=>console.log(`Value emitted: ${x}`))
)

source4$.subscribe(value=>console.log(`Observer 1 of hot publishReplay observable : ${value}`))

setTimeout(()=>{
    source4$.subscribe(value=>console.log(`Observer 2 of hot publishReplay observable : ${value}`))
},1000)

setTimeout(()=>{
    source4$.subscribe(value=>console.log(`Observer 3 of hot publishReplay observable : ${value}`))
},2000)

setTimeout(()=>{
    source4$.subscribe(value=>console.log(`Observer 4 of hot publishReplay observable : ${value}`))
},3000)

setTimeout(()=>{
    source4$.subscribe(
        value=>console.log(`Observer 5 of Hot publishReplay observable : ${value}`),
        err=>console.log(err),
        ()=>console.log("Observer 5 completed")
    
    )
},4500)

/*
O/P:

Value emitted: 0
Observer 1 of hot publishReplay observable : 0
Value emitted: 0
Observer 2 of hot publishReplay observable : 0
Value emitted: 0
Observer 3 of hot publishReplay observable : 0
Value emitted: 1
Observer 1 of hot publishReplay observable : 1
Value emitted: 1
Observer 2 of hot publishReplay observable : 1
Value emitted: 1
Observer 3 of hot publishReplay observable : 1
Value emitted: 1
Observer 4 of hot publishReplay observable : 1
Value emitted: 2
Observer 1 of hot publishReplay observable : 2
Value emitted: 2
Observer 2 of hot publishReplay observable : 2
Value emitted: 2
Observer 3 of hot publishReplay observable : 2
Value emitted: 2
Observer 4 of hot publishReplay observable : 2
Value emitted: 3
Observer 1 of hot publishReplay observable : 3
Value emitted: 3
Observer 2 of hot publishReplay observable : 3
Value emitted: 3
Observer 3 of hot publishReplay observable : 3
Value emitted: 3
Observer 4 of hot publishReplay observable : 3
Value emitted: 3
Observer 5 of Hot publishReplay observable : 3
Observer 5 completed

After 1sec, observable emits 0. 
We have 2 observers at the end of 1 sec which receive value 0.
After 1 more sec i.e end of 2secs, we have 3 observers. Observable emits 1.

Now the 3rd observer will receive the last 1 value emitted by observable i.e 0.

After 1 more sec i.e end of 3secs, we have 4 observers. Observable emits 2.
The 4th observable will only receive the last 1 of the previously emitted values i.e 1.
It wont receive 0.

*/
