Setting up Typescript Project.
1. Create a folder RXJS.
2. npm init
3. git init
4. Create tsconfig.json with the contents in this project and create a .gitignore file.
5. Install the below modules
npm install -g typescript
npm install typescript --save-dev
npm install --save rxjs
npm install --save-dev '@types/node'

6. Create a src folder with index.ts
7. Now run the below to view the transpiled files in the build folder.
npx tsc 

8. For cold reloading of the edited .ts and .js file: 
Now run: npm install --save-dev ts-node nodemon
Then create a nodemon.json file with contents in this project

9. To start the project: npm run start:dev

Always update the nodemon.js with the file name that you want to run.
If you think that npm run start:dev is not running the latest changes in the .ts file,
then repeat step 7 followed by step 9.
-------------------------------------------------------------------------------------------------

What are observables?

1. An observable ties the producer of values and the observer.

2. A producer is the source of values for your observable. It could be a web socket, it could be DOM events, it could be an iterator, or something looping over an array. Basically, it’s anything you’re using to get values and pass them to `observer.next(value)`.
Visualise any data as a stream of data. Let the data contain single or multiple values.
Data is obtained synchronously or asynchronously.

Data maybe a finite set of values eg: an array of 5 objects.
Data can also be an infinite set of values eg: A button which can be clicked infinite number of times.

3. Who is observing the observables? observers! 
Observers register to listen to the values produced by the observable by subscribing to the observable.
observers are objects that implement a very simple interface. This interface has 3 methods: next(),error() and complete().
These methods correspond to the 3 types of messages an observable can produce.

next() is for pushing the next value to an observer
error() is for pushing the error message to the observer
complete() is when observable has finished pushing all values

4. Three ways you can create observables:

=>create from scratch using new Observable()
=>using operators to create like of,from,concat,fromEvent etc.
>some function returns an observable eg: http.get()

5. An observable will stop execution under these scenarios:
=>When the observable errors out and the subscriber pushes the error message to the observer.
=>When the subscriber has pushed all values to the observer and pushes the complete message to the observer
=>Calling unsusbscribe() on the subscription object

"Stop execution" means the observable wont emit any more values from the source.

6. Now we have a source of stream of values, an Observable, an Observer, a Subscriber and a Subscription.

An Observer is an object which looks like below. It has 3 properties: next,error and complete. 
These 3 properties are methods. Which method will execute is decided based on the type of message,
the subscriber pushes to the observer.

let myObserver={
    next:(result)=>console.log(result),
    error:(err)=>console.log(err),
    complete:()=>console.log("Observable has pushed all values to the Observer")
}

What is the subscriber?  A Subscriber passes the value to the Observer.

function subscribe(subscriber){
    /*
This function executes each time the observable executes i.e when an observer subscribes to the observable.
Here the subscriber can pass values to the observer in 3 ways: using next(value) OR error(value) OR
complete()
If subscriber uses next(value) to pass the value, then the method under the next property of the myObserver object will execute.
Similarly for error(value) and complete().
    */
}

let observable$=new Observable(subscribe);

Subscription is the act of the observer subscribing to the observable. Subscription alone can trigger
execution of the Observable.Each call to subscribe triggers an independent execution of the observable.
When the Observable executes, the subscribe method passed as argument to the new Observable() is executed.

let observableSubs=observable$.subscribe(myObserver);

observableSubs is the Subscription object which can be used to cancel this particular execution of the
observable using the unsubscribe().

7. The observer object can also look like below:

let observableSubs=observable$.susbcribe(
(next) => console.log(next),
  (err) => console.log(err),
  () => console.log('completed')
)

Instead of passing the observer object, if you simply passing the methods as arguments to the subscribe(), then the observer
object is created for you behind the scenes with these methods as properties.

8. complete() will not be called under these scenarios:
Will not execute if observable errors out.
Will not execute if observer unsubscribes from the observable and cancels the execution.

9. Operator is a function A that returns a new function B and this new function B takes an observable M
as a parameter .The new function B now returns a new observable N which can be subscribed to.

10. Categories of operators:
Transformation
Filtering
Combination
Utility
Conditional
Aggregate
Multicasting

11. Marble diagrams.
The arrow running from left to right represents the input observable.
The circles on the arrow are the values emitted by the observable from the source.
The vertical line on the arrow on the right represents the successful completion of the observable.
If the obsrvable errors out, then instead of the vertical line ,we have an X on the right side of the arrow.
Below this arrow, the operator applied to the values emitted by the input observable is shown.
Finally below the operator, we have another arrow pointing from left to right. This arrow represents the
output observable from the operator.

11. catchError operator must be the last operator in the piped chain to replace the error observable
or throw the error observable

------------------------------------------------------------------------
 What are Subjects?

 Subjects are observables. They are implemented as the child class of the observabel class.
This means Subjects will have a subscribe method to which the observer will be passed as argument.
Subject can act as an observer and subscribe to an observable.
Subject can also produce values from observers.
Subject can proxy values i.e it can behave as an observer,subscribe to an observable and push the values emitted by the observable 
to its own observers i.e the observers subscribed to the subject.

Thus subjects have a dual nature i.e they can behave as observables which emits values from the source and they can also behave as an observer
which will subscribe to an observable and receives values from it.

Subjects also have state and they maintain an internal list of its observers. Thus they can push values to more than 1 observer at a time.
So subjects multicast instead of unicast.

Observables are by default only capable of unicast i.e they can push values to only 1 observer at a time. If another observer subscribes, then the
observable will execute again.

Use Alt F12 to get some information on class, your mouse if hovering on.

Subject class has the following properties and methods which indicate its dual nature:

1. Observers:Observer<T>[]  This indicates it maintains an internal list of observers to enable multicast.
2. subscribe() This indicates it can behave as an observable which can be subscribed to.
3. next(), error() and complete() This indicates it can behave as an observer which subscribes to an observable.

-------------------------------------------------------------------------------------------

Cold vs Hot Observable

Cold Observable                      Hot Observable
 
1. Value producer is created         Value producer is created outside th observable. This mean it produces values
                                     whether there are any observers or not.
inside the observable
Each time an observable is
subscribed, the producer is
created again inside the 
observable.

2. There can be only                  Shared producer allows for multiple observers which receive the same value at the same time. They are multicast.
                                      This is because the subscribe() isn't what triggers the producer to produce values as mentioned in point 1
observer per execution
of a cold observable.
This is because if anaother
observer subscribes,then 
a 2nd execution of the 
observable begins.
This is called
unicasting.

Converting a unicast cold observable into a multicast hot observable

You can do this by inserting a Subject in between the observable pushing the values and the observers
receiving the values.
=>Observable pushes the values
=>Subject subscribes to the observable and receives the values
=>Observers subscribe to the subject
=>Observers receive values from the subject. Values are shared amongst the observers.

The above steps can be minimized to a single step using multicasting operators.

1. multicast()
2. refCount(),
3. publish(),
4. share()

We also have 3 specialixed subject operators

1. publishLast()
2. publishBehavior()
3. publishReplay()



