import { Observable, of } from "rxjs";
import { filter, tap } from "rxjs/operators";

const source$=of(1,2,3,4,5,10,20,45);

function filterAndLogging(value:number){
    return function(observable:Observable<number>){
        //returning a function that accepts an observable as argument.
        //this function will return a new observable
        return observable.pipe(
            filter((x:number)=>x <value),
            tap(x=>console.log(`Value emitted: ${x}`))
        )
    }
}

source$.pipe(
    filterAndLogging(20)
)
.subscribe(x=>console.log(x))