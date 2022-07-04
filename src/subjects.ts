import { interval, Observable, Subject } from "rxjs";
import { take } from "rxjs/operators";


//Subject behaves as an observable pushing values to its observers
const subject$=new Subject();

//observers subscribing to the subject
subject$.subscribe(
    value=>console.log(`Observer 1: ${value}`)
)

subject$.subscribe(
    value=>console.log(`Observer 2: ${value}`)
)

//subject pushing values to its observers
subject$.next("Hello World");

//Subject behaving as a proxy. As an observer it subscribes to the observable to consume values.
//Next, as an observable, it also pushes the values received to its own observers

const observable$=new Observable(function(subscriber){
    subscriber.next("Good morning");
})

//subject subscribing to the observable

observable$.subscribe(subject$); 
/*
The Subject's observers will receive values not just from the Subject but also from the observable.
*/


/*Cold Observable:Mechanism for producing values is inside the observable*/

const source1$=interval(1000).pipe(take(4));
/*
Only after 1 sec the 
*/

// source1$.subscribe(value=>console.log(`Observer 1 of Cold observable : ${value}`))

// setTimeout(()=>{
//     source1$.subscribe(value=>console.log(`Observer 2 of Cold observable : ${value}`))
// },1000)

// setTimeout(()=>{
//     source1$.subscribe(value=>console.log(`Observer 3 of Cold observable : ${value}`))
// },2000)

/*
O/P:
Observer 1 of Cold observable : 0
Observer 1 of Cold observable : 1
Observer 2 of Cold observable : 0
Observer 3 of Cold observable : 0
Observer 1 of Cold observable : 2
Observer 2 of Cold observable : 1
Observer 3 of Cold observable : 1
Observer 1 of Cold observable : 3
Observer 2 of Cold observable : 2
Observer 3 of Cold observable : 2
Observer 2 of Cold observable : 3
Observer 3 of Cold observable : 3

Here all 3 observers receive all the 3 values emitted over different time intervals because
for each observer there is a seperate execution of observable.

*/

/*Converting cold observable into hot observable using Subject   */

const subject2$=new Subject();

subject2$.subscribe(value=>console.log(`Observer 1 of Hot observable : ${value}`))

setTimeout(()=>{
    subject2$.subscribe(value=>console.log(`Observer 2 of Hot observable : ${value}`))
},1000)

setTimeout(()=>{
    subject2$.subscribe(value=>console.log(`Observer 3 of Hot observable : ${value}`))
},2000)

setTimeout(()=>{
    subject2$.subscribe(
        value=>console.log(`Observer 4 of Hot observable : ${value}`),
        err=>console.log(err),
        ()=>console.log("Observer 4 completed")
    
    )
},4500)

source1$.subscribe(subject2$); //subject subscribing to the observable

//observers subcribing to the subject.

/*
O/P:

Observer 1 of Hot observable : 0
Observer 2 of Hot observable : 0
Observer 1 of Hot observable : 1
Observer 2 of Hot observable : 1
Observer 3 of Hot observable : 1
Observer 1 of Hot observable : 2
Observer 2 of Hot observable : 2
Observer 3 of Hot observable : 2
Observer 1 of Hot observable : 3
Observer 2 of Hot observable : 3
Observer 3 of Hot observable : 3
Observer 4 completed

interval operator creates a cold observable which emits an integet starting 0 every 1sec. 
So the first emission 0 will also be after 1 sec.

The first 2 observers have subscribed to the subject by the end of 1sec.
So both these observers will receive the first emission 0 and the remaining values.

But the 3rd observer has subscribed to the subject only after 2secs. By the end of 2secs,
the interval() operator will emit 1.
So the 3rd observer will receive 1 and the remaining values but not 0.
This is because 0 was emitted before the 3rd observer subscribed to the subject.

Since the 4th observer subscribes to the subject after the observable has emitted all the values,
it receives no value. Just the complete() is called.

You can think of it like this.
=>Observable emits 0 after 1sec. Subject receives 0. 
At the end of 1sec, 2 Observers are subscribed to the subject. So the 2 observers receives 0.

=>Observables emits 1 after another 1sec. So 2 secs have passed now. Subject receives 1. 
At the end of 2secs, 3 observers have subscribed to the subject.
All 3 observers receive 1.

=>Similarly for the remaining values. Whatever value is emitted is shared between all observers.

*/
