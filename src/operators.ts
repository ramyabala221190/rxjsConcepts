import { catchError, filter, map, mergeMap, tap } from "rxjs/operators";
import { users } from "./users";
import {todos} from "./todos";
import { from, of } from "rxjs";


let source$=of(1,2,3,4,5);
let doubler=map((value:number)=>value * 2); //map operator returns a function.

let doubler$=doubler(source$); //The observable is passed as argument to the function returned from the map.
//So the map function will double the value of each number emitted from the observable

doubler$.subscribe(x=>{
    console.log(x);
})

//chaining operators using pipe operator

let source1$=of(1,2,3,4,5).pipe(
    map(value=>value *2),   //multiplies each number emitted by the of operator by 2 and returns an observable with new numbers
    filter(x=>x<5) //filter operator is applied on the values emitted by the observable returned by map
)

source1$.subscribe(
    y=>console.log("Values less than 5",y)
)

//using map,filter and tap

let source2$=from(users).pipe(
map(x=>x.id), //mapping each object emitted from the observable created by from operator to the id property and return new observable
filter(y=>y< 5), //filter operator is applied on the values emitted by the observable returned by map
tap(z=>console.log("Logged for each value",z)) 
//tap operator is applied to each value returned by filter operator and returns the observable returned from filter operator unchanged.
);

source2$.subscribe(value=>console.log("id",value));

//using mergeMap without piping

let source3$=from(users);

let mergeMapFunction=mergeMap((x:any)=>from(todos));
let mergeMapObservable=mergeMapFunction(source3$);

let filterFunction=filter((y:any)=>y.userId < 5);
let filterObservable=filterFunction(mergeMapObservable);

let tapFunction=tap(z=>console.log("Logged for each value",z)) ;
let tapObservable=tapFunction(filterObservable);
tapObservable.subscribe(value=>console.log("todo",value));

//using mergeMap using pipe

// let source4$=from(users).pipe(
//     mergeMap(x=>from(todos)), 
//     //mapping each object emitted from the observable created by 1st from operator to another observable returned from the 2nd from operator
//     //Finally it flattens all the new observables returned for each object into a single observable
//     filter((y:any)=>y.userId < 2), //filter operator is applied on the values emitted by the observable returned by mergeMAp
//     tap(z=>console.log("Logged for each value",z)) ,
//     //tap operator is applied to each value returned by filter operator and returns the observable returned from filter operator unchanged.
//     //catchError(err=>of("Received error but passing it of as some value")) //Option1 :error observable replaced with success observable
//     //catchError(err=> {throw "Throwing the error"}) //Option2: Throw error. Error will logged in the error callback of subscribe
//     //catchError(err=>throwError(err)) //Option3: Throw error using rxjs operator throwError
//     );

//     /*
// If any error occurs in the mergeMap, the filter and tap operators wont execute and the catchError will
// called.

//     */

// source4$.subscribe(
//     value=>console.log(`VALUE:${value}`),
//     err=>console.log(`ERROr : ${err}`)
// )
    
