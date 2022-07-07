import { asapScheduler, asyncScheduler, merge, of, queueScheduler } from "rxjs"

console.log("start script");

let queue$=of("Queue Scheduler (sync task)",queueScheduler);

let asapQueue$=of("Asap Scheduler(async microtasks)",asapScheduler);

let asyncQueue$=of("AsyncScheduler (async task",asyncScheduler);

merge(asapQueue$,queue$,asyncQueue$).subscribe(
    value=>console.log(value)
)

console.log("end script");

/*
O/P:

start script
Queue Scheduler (sync task)
end script
Asap Scheduler(async microtasks)
AsyncScheduler (async task

Explanation:

queue$ observable is executed synhronously. This is the reason ,it got executed before the 
console.log("end script");

asapQueue$ is given more prioirty than the asyncQueue$ because the scheduler used.

*/
