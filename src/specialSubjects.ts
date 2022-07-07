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

Since it uses refCount(), the observable will emit values only when there is atleast
1 observer
*/

const source2$=interval(1000).pipe(
    take(4),
    publishBehavior(30),
    refCount(),
    tap(x=>
        console.log(`Value emitted: ${x} at ${new Date().toLocaleTimeString()}`)
        )
)

// source2$.subscribe(value=>console.log(`Observer 1 of hot publishBehavior observable : ${value}`))

// setTimeout(()=>{
//     source2$.subscribe(value=>console.log(`Observer 2 of hot publishBehavior observable : ${value}`))
// },1000)

// setTimeout(()=>{
//     source2$.subscribe(value=>console.log(`Observer 3 of hot publishBehavior observable : ${value}`))
// },2000)

// setTimeout(()=>{
//     source2$.subscribe(value=>console.log(`Observer 4 of hot publishBehavior observable : ${value}`))
// },3000)


// setTimeout(()=>{
//     source2$.subscribe(
//         value=>console.log(`Observer 5 of Hot publishBehavior observable : ${value}`),
//         err=>console.log(err),
//         ()=>console.log("Observer 5 completed")
    
//     )
// },4500)

/*
O/P:

Value emitted: 30 at 9:35:28 AM
Observer 1 of hot publishBehavior observable : 30
Value emitted: 0 at 9:35:29 AM
Observer 1 of hot publishBehavior observable : 0
Value emitted: 0 at 9:35:29 AM
Observer 2 of hot publishBehavior observable : 0
Value emitted: 0 at 9:35:30 AM
Observer 3 of hot publishBehavior observable : 0
Value emitted: 1 at 9:35:30 AM
Observer 1 of hot publishBehavior observable : 1
Value emitted: 1 at 9:35:30 AM
Observer 2 of hot publishBehavior observable : 1
Value emitted: 1 at 9:35:30 AM
Observer 3 of hot publishBehavior observable : 1
Value emitted: 1 at 9:35:31 AM
Observer 4 of hot publishBehavior observable : 1
Value emitted: 2 at 9:35:31 AM
Observer 1 of hot publishBehavior observable : 2
Value emitted: 2 at 9:35:31 AM
Observer 2 of hot publishBehavior observable : 2
Value emitted: 2 at 9:35:31 AM
Observer 3 of hot publishBehavior observable : 2
Value emitted: 2 at 9:35:31 AM
Observer 4 of hot publishBehavior observable : 2
Value emitted: 3 at 9:35:32 AM
Observer 1 of hot publishBehavior observable : 3
Value emitted: 3 at 9:35:32 AM
Observer 2 of hot publishBehavior observable : 3
Value emitted: 3 at 9:35:32 AM
Observer 3 of hot publishBehavior observable : 3
Value emitted: 3 at 9:35:32 AM
Observer 4 of hot publishBehavior observable : 3
Observer 5 completed

Explanation:
=>Value emitted: 30 at 9:35:28 AM
Here Observer 1 has received the initial seed value of 30 because it had subscribed to the subject
before the observable had started emitting values.
The intial seed value is emitted to an observer only if the observable has previously emitted no values.

=>Value emitted: 0 at 9:35:29 AM
After 1 sec, observable emits 0. At the end of 1 sec, we have 2 Observers. Both receive value 0.

=>Value emitted: 0 at 9:35:30 AM
Observer 3 of hot publishBehavior observable : 0

After 2secs, we have the 3rd Observer. This observer receives the most recent previous value emitted by
the observable i.e 0.

=>Value emitted: 1 at 9:35:30 AM

Please note that the observable also emits 1 at the same time, because the 1sec duration is completed.
So the 3 observers receive 1.

=>Value emitted: 1 at 9:35:31 AM
Observer 4 of hot publishBehavior observable : 1

Observer 4 has subscribed after 3secs. So it receives the most recent previous value emitted by the
observable i.e 1 but not 0.

=>Value emitted: 2 at 9:35:31 AM
Please note that the observable also emits 2 at the same time, because the 1sec duration is completed.
All 4 observers receive 4.

The 5th Observer which has subscribed after the observable has emitted all values, 
wont receive any value. Only the complete() of the 5th observer is called.
*/


/*
publishReplay() uses the ReplaySubject internally

*/

const source3$=interval(1000).pipe(
    take(4),
    publishReplay(),
    refCount(),
    tap(x=>console.log(`Value emitted: ${x} at ${new Date().toLocaleTimeString()}`))
)

// source3$.subscribe(value=>console.log(`Observer 1 of hot publishReplay observable : ${value}`))

// setTimeout(()=>{
//     source3$.subscribe(value=>console.log(`Observer 2 of hot publishReplay observable : ${value}`))
// },1000)

// setTimeout(()=>{
//     source3$.subscribe(value=>console.log(`Observer 3 of hot publishReplay observable : ${value}`))
// },2000)

// setTimeout(()=>{
//     source3$.subscribe(value=>console.log(`Observer 4 of hot publishReplay observable : ${value}`))
// },3000)

// setTimeout(()=>{
//     source3$.subscribe(
//         value=>console.log(`Observer 5 of Hot publishReplay observable : ${value}`),
//         err=>console.log(err),
//         ()=>console.log("Observer 5 completed")
    
//     )
// },4500)

/*
O/P:

Value emitted: 0 at 9:51:12 AM
Observer 1 of hot publishReplay observable : 0
Value emitted: 0 at 9:51:13 AM
Observer 2 of hot publishReplay observable : 0
Value emitted: 0 at 9:51:13 AM
Observer 3 of hot publishReplay observable : 0
Value emitted: 1 at 9:51:13 AM
Observer 1 of hot publishReplay observable : 1
Value emitted: 1 at 9:51:13 AM
Observer 2 of hot publishReplay observable : 1
Value emitted: 1 at 9:51:13 AM
Observer 3 of hot publishReplay observable : 1
Value emitted: 0 at 9:51:14 AM
Observer 4 of hot publishReplay observable : 0
Value emitted: 1 at 9:51:14 AM
Observer 4 of hot publishReplay observable : 1
Value emitted: 2 at 9:51:14 AM
Observer 1 of hot publishReplay observable : 2
Value emitted: 2 at 9:51:14 AM
Observer 2 of hot publishReplay observable : 2
Value emitted: 2 at 9:51:14 AM
Observer 3 of hot publishReplay observable : 2
Value emitted: 2 at 9:51:14 AM
Observer 4 of hot publishReplay observable : 2
Value emitted: 3 at 9:51:15 AM
Observer 1 of hot publishReplay observable : 3
Value emitted: 3 at 9:51:15 AM
Observer 2 of hot publishReplay observable : 3
Value emitted: 3 at 9:51:15 AM
Observer 3 of hot publishReplay observable : 3
Value emitted: 3 at 9:51:15 AM
Observer 4 of hot publishReplay observable : 3
Value emitted: 0 at 9:51:16 AM
Observer 5 of Hot publishReplay observable : 0
Value emitted: 1 at 9:51:16 AM
Observer 5 of Hot publishReplay observable : 1
Value emitted: 2 at 9:51:16 AM
Observer 5 of Hot publishReplay observable : 2
Value emitted: 3 at 9:51:16 AM
Observer 5 of Hot publishReplay observable : 3
Observer 5 completed

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
    tap(x=>console.log(`Value emitted: ${x} at ${new Date().toLocaleTimeString()}`))
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

Value emitted: 0 at 9:54:53 AM
Observer 1 of hot publishReplay observable : 0
Value emitted: 0 at 9:54:53 AM
Observer 2 of hot publishReplay observable : 0
Value emitted: 0 at 9:54:54 AM
Observer 3 of hot publishReplay observable : 0
Value emitted: 1 at 9:54:54 AM
Observer 1 of hot publishReplay observable : 1
Value emitted: 1 at 9:54:54 AM
Observer 2 of hot publishReplay observable : 1
Value emitted: 1 at 9:54:54 AM
Observer 3 of hot publishReplay observable : 1
Value emitted: 1 at 9:54:55 AM
Observer 4 of hot publishReplay observable : 1
Value emitted: 2 at 9:54:55 AM
Observer 1 of hot publishReplay observable : 2
Value emitted: 2 at 9:54:55 AM
Observer 2 of hot publishReplay observable : 2
Value emitted: 2 at 9:54:55 AM
Observer 3 of hot publishReplay observable : 2
Value emitted: 2 at 9:54:55 AM
Observer 4 of hot publishReplay observable : 2
Value emitted: 3 at 9:54:56 AM
Observer 1 of hot publishReplay observable : 3
Value emitted: 3 at 9:54:56 AM
Observer 2 of hot publishReplay observable : 3
Value emitted: 3 at 9:54:56 AM
Observer 3 of hot publishReplay observable : 3
Value emitted: 3 at 9:54:56 AM
Observer 4 of hot publishReplay observable : 3
Value emitted: 3 at 9:54:57 AM
Observer 5 of Hot publishReplay observable : 3
Observer 5 completed

Explanaation:

=>Value emitted: 0 at 9:54:53 AM
After 1sec, the observable emits 0.
At the end of 1sec, we have 2 observers who receive this value 0.

=>Value emitted: 0 at 9:54:54 AM
Observer 3 of hot publishReplay observable : 0

After 1 more sec i.e at the end of 2secs, we have 3 observers.
The 3rd observer receives the last 1 value which was emitted before 3rd observer subscribed i.e 0

=>Value emitted: 1 at 9:54:54 AM
At the same time, the observable also emits 1.
All 3 observers receive 1.

=>Value emitted: 1 at 9:54:55 AM
Observer 4 of hot publishReplay observable : 1

After 1 more sec i.e at the end of 3secs, we have 4 observers. 
The 4th observer receives the last 1 value which was emitted before the 4th observer subscribed i.e 1
It wont receive 0 because we have specified that the late observers receive only the last 1 value
emitted by the observable before the late observer subscribed.

*/
