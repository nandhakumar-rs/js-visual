import type { Concept } from "@/types/concept";
import { SECTION_ORDER } from "@/types/concept";

export const concepts: Concept[] = [
  // ───────────────────────── Core JavaScript ─────────────────────────
  {
    id: "null-vs-undefined",
    slug: "null-vs-undefined",
    title: "null vs undefined",
    section: "core",
    order: 1,
    mvpOrder: 1,
    visibility: "mvp",
    simpleDescription:
      "`undefined` means JavaScript doesn't have a value here yet. `null` means someone intentionally chose \"no value.\" Let's see the difference.",
    technicalDescription:
      "`undefined` is the default value for uninitialized variables — missing object properties and functions with no explicit `return` also evaluate to `undefined`. `null` is an explicitly assigned primitive value. `typeof null === \"object\"` is a historical JavaScript quirk kept for backward compatibility.",
    difficulty: "beginner",
    prerequisites: ["mapping-users"],
    interviewQuestion: "What's the difference between null and undefined, and why does typeof null return \"object\"?",
  },
  {
    id: "execution-context",
    slug: "execution-context",
    title: "Execution Context & Call Stack",
    section: "core",
    order: 20,
    mvpOrder: 3,
    visibility: "mvp",
    simpleDescription:
      "When a function calls another function, JavaScript pauses the current function, works on the new call, and then returns to where it left off. The call stack keeps track of that order.",
    technicalDescription:
      "Each function invocation creates an execution context containing the information needed to run that call. The call stack tracks active function calls: a call is pushed when it begins and popped when it returns.",
    difficulty: "beginner",
    prerequisites: ["null-vs-undefined"],
    interviewQuestion: "What happens to the call stack when function `A` calls function `B`, and then `B` returns?",
    interviewAnswer:
      "Calling `B` pushes a new frame above `A`, so `B` becomes the currently running function and `A` waits. When `B` returns, its frame is popped, its return value is passed back to `A`, and `A` resumes after the call to `B`.",
  },
  {
    id: "mapping-users",
    slug: "mapping-users",
    title: "Mapping Users",
    section: "core",
    order: 2,
    visibility: "later",
    simpleDescription:
      "`.map()` takes every item in an array, transforms it, and puts the results into a new array. Let's see how that works with a list of users.",
    technicalDescription:
      "`Array.prototype.map()` returns a new array by invoking a callback function once per element (in ascending index order, skipping holes in sparse arrays) and collecting each call's return value — the original array's length and contents are never mutated.",
    difficulty: "beginner",
    interviewQuestion: "What does .map() return, and does it change the original array?",
  },
  {
    id: "immutable-arrays",
    slug: "immutable-arrays",
    title: "Values, References & Mutation",
    section: "core",
    order: 3,
    mvpOrder: 2,
    visibility: "mvp",
    simpleDescription:
      "Variables do not always behave like separate boxes. A copied number becomes an independent value, but two variables can lead to the same array or object. If that shared value is changed, both variables see the change.",
    technicalDescription:
      "Primitive assignments copy the primitive value. Assigning an array or object copies its reference value, so two variables can refer to the same object. Mutation changes that shared object, while spread creates a new outer array or object.",
    difficulty: "beginner",
    prerequisites: ["null-vs-undefined"],
    interviewQuestion:
      "If `const` prevents reassignment, why does `const items = []; items.push(1);` still work?",
    interviewAnswer:
      "`const` prevents `items` from being assigned a different array; it does not make the existing array immutable. `items.push(1)` changes the contents of the same array, so it works. However, assigning `items = []` would throw an error.",
  },
  {
    id: "concatenating-arrays",
    slug: "concatenating-arrays",
    title: "Concatenating Arrays",
    section: "core",
    order: 4,
    visibility: "later",
    simpleDescription: "Join two arrays in order to create one new array.",
    technicalDescription:
      "`Array.prototype.concat()` returns a new array without mutating its receiver or its arguments; `[...a, ...b]` builds a new array literal by spreading each source's values into it. Both are shallow — nested objects inside the arrays are still shared with the originals — and while they produce the same result for simple values, they are not universally equivalent operations.",
    difficulty: "beginner",
    prerequisites: ["immutable-arrays"],
    interviewQuestion: "Do `concat()` and `[...a, ...b]` mutate the source arrays, and are the values inside deeply cloned?",
  },
  {
    id: "user-existence",
    slug: "user-existence",
    title: "Checking If a User Exists",
    section: "core",
    order: 5,
    visibility: "later",
    simpleDescription: "Check whether at least one user in an array matches what we are looking for.",
    technicalDescription:
      "`some()`, `find()`, and `findIndex()` all search an array with a predicate callback and stop at the first match — they differ only in what they return: a boolean, the matching element, or its index.",
    difficulty: "beginner",
    prerequisites: ["mapping-users"],
    interviewQuestion: "When would you use `find()` instead of `filter()[0]`?",
  },
  {
    id: "removing-duplicates",
    slug: "removing-duplicates",
    title: "Removing Duplicates",
    section: "core",
    order: 6,
    visibility: "later",
    simpleDescription: "Remove repeated values so each value appears only once.",
    technicalDescription:
      "`Set` keeps unique values using SameValueZero equality and preserves their first-seen order. Spreading the Set creates a new array, while `filter()` with `indexOf()` and `reduce()` with `includes()` provide manual alternatives.",
    difficulty: "beginner",
    prerequisites: ["user-existence"],
    interviewQuestion:
      "What does `[...new Set(array)]` return, and what limitation should you remember when the array contains objects?",
  },
  {
    id: "sorting",
    slug: "sorting",
    title: "Sorting",
    section: "core",
    order: 7,
    visibility: "later",
    simpleDescription:
      "Arrange values into an order, such as smallest to largest—but first decide how the values should be compared.",
    technicalDescription:
      "`sort()` mutates an array and compares string representations by default. A comparator controls numeric order, while `toSorted()` applies the same comparison rules without changing the source array.",
    difficulty: "beginner",
    prerequisites: ["removing-duplicates"],
    interviewQuestion:
      "Why does [10, 2, 5].sort() not produce numeric ascending order, and how do sort() and toSorted() differ?",
  },
  {
    id: "range",
    slug: "range",
    title: "Range Function",
    section: "core",
    order: 8,
    visibility: "later",
    simpleDescription:
      "Create a sequence by starting at one number and moving by the same amount until reaching a stopping boundary.",
    technicalDescription:
      "JavaScript has no built-in general-purpose `range()` function, so this helper starts an empty result array at `start`, rejects a `step` of `0`, and loops while the current value is less than `end` for ascending ranges or greater than `end` for descending ones. Each iteration pushes the current value and adds `step`, returning a new array the moment the boundary condition becomes false — so `end` itself is never included.",
    difficulty: "beginner",
    prerequisites: ["sorting"],
    interviewQuestion:
      "How would you implement a JavaScript range helper that safely supports both ascending and descending ranges?",
  },
  {
    id: "minimum-occurrences",
    slug: "minimum-occurrences",
    title: "Minimum Value Occurrences",
    section: "core",
    order: 9,
    visibility: "later",
    simpleDescription:
      "First find the smallest number in a list, then count how many times that exact number shows up.",
    technicalDescription:
      "A single reduce (or two-pass loop) can compute Math.min(...array) and then filter the array against that minimum, counting matches — an O(n) two-phase traversal.",
    difficulty: "beginner",
    prerequisites: ["user-existence"],
    interviewQuestion: "How would you count how many times the minimum value appears in an array?",
  },
  {
    id: "shuffle",
    slug: "shuffle",
    title: "Shuffle",
    section: "core",
    order: 10,
    visibility: "later",
    simpleDescription:
      "To shuffle a list fairly, walk backward through it and repeatedly swap the current item with a random earlier one — that's the Fisher–Yates algorithm.",
    technicalDescription:
      "Fisher–Yates produces a uniformly random permutation in O(n) by iterating from the last index to the first, swapping each element with one at a uniformly random index ≤ its own. array.sort(() => Math.random() - 0.5) is a common but statistically biased alternative, because Array.prototype.sort()'s comparator isn't guaranteed to be called on every pair.",
    difficulty: "intermediate",
    prerequisites: ["sorting"],
    interviewQuestion: "Why is array.sort(() => Math.random() - 0.5) not a correct shuffle?",
  },
  {
    id: "modules",
    slug: "modules",
    title: "Modules",
    section: "core",
    order: 11,
    visibility: "later",
    simpleDescription:
      "Modules let you split code across files and explicitly choose what to share (export) and what to use from elsewhere (import).",
    technicalDescription:
      "ES Modules are statically analyzable: import/export bindings are resolved at parse time (enabling tree-shaking) and are live read-only views onto the exporting module's bindings, unlike CommonJS's require()/module.exports, which copies values at runtime.",
    difficulty: "beginner",
    prerequisites: ["closures"],
    interviewQuestion: "What's the difference between a named export and a default export?",
  },
  {
    id: "classes",
    slug: "classes",
    title: "Classes",
    section: "core",
    order: 12,
    visibility: "later",
    simpleDescription:
      "A class is a template for creating objects that share the same methods, with a constructor that sets up each new instance's own data.",
    technicalDescription:
      "Class syntax is sugar over JavaScript's prototypal inheritance: methods defined in a class body live on the class's prototype (shared, not copied per instance), extends wires up the prototype chain, and super invokes the parent constructor or method.",
    difficulty: "intermediate",
    prerequisites: ["this"],
    interviewQuestion: "What does extends actually set up under the hood?",
  },
  {
    id: "prototypes",
    slug: "prototypes",
    title: "Prototypes",
    section: "core",
    order: 13,
    visibility: "later",
    simpleDescription:
      "When you access a property JavaScript can't find on an object, it keeps looking up a chain of \"parent\" objects called prototypes until it finds it or runs out.",
    technicalDescription:
      "Every object has an internal [[Prototype]] link (exposed via Object.getPrototypeOf / __proto__). Property lookup walks this prototype chain until the property is found or the chain ends at null; this is the mechanism classes are built on top of.",
    difficulty: "intermediate",
    prerequisites: ["classes"],
    interviewQuestion: "Walk through what happens when you call maya.greet() and greet isn't an own property.",
  },
  {
    id: "this",
    slug: "this",
    title: "this",
    section: "core",
    order: 14,
    visibility: "later",
    simpleDescription:
      "this doesn't mean \"the current object\" — it depends entirely on how a function was called, not where it was written.",
    technicalDescription:
      "this is determined by a function's call-site: implicit binding for object-method calls, undefined/global for plain calls (strict/non-strict), explicit binding via call/apply/bind, new-binding for constructors, and lexical binding (inherited from the enclosing scope) for arrow functions.",
    difficulty: "intermediate",
    prerequisites: ["closures"],
    interviewQuestion: "What determines the value of this inside a regular function versus an arrow function?",
  },
  {
    id: "scope",
    slug: "scope",
    title: "Scope",
    section: "core",
    order: 21,
    mvpOrder: 4,
    visibility: "mvp",
    simpleDescription:
      "Scope decides where a variable can be used. Code inside a function or block can use nearby variables and look outward, but code outside cannot access variables hidden inside an inner scope.",
    technicalDescription:
      "JavaScript uses lexical scope, meaning identifier accessibility is determined by where code is written. Identifier resolution begins in the current lexical environment and continues through its outer environments until a matching binding is found.",
    difficulty: "beginner",
    prerequisites: ["execution-context"],
    interviewQuestion: "What is lexical scope, and how does JavaScript resolve an identifier?",
    interviewAnswer:
      "Lexical scope means variable accessibility is determined by where code is written. JavaScript searches the current scope first and then follows the chain of enclosing scopes. If it cannot find the identifier anywhere in that chain, it throws a ReferenceError.",
  },
  {
    id: "hoisting",
    slug: "hoisting",
    title: "Hoisting & Temporal Dead Zone",
    section: "core",
    order: 15,
    mvpOrder: 5,
    visibility: "mvp",
    simpleDescription:
      "Before JavaScript runs the statements in a scope, it prepares the declarations it finds there. What happens when code uses a name before its declaration line depends on how that name was declared.",
    technicalDescription:
      "When JavaScript creates a scope's environment, it creates its bindings before executing the statements. `var` bindings are initialized with `undefined`, `let` and `const` bindings remain uninitialized, and function declarations are initialized with their function objects. Accessing an uninitialized lexical binding throws a `ReferenceError`.",
    difficulty: "beginner",
    prerequisites: ["scope"],
    interviewQuestion:
      "Are let and const hoisted, and why does accessing them before their declaration throw an error?",
    interviewAnswer:
      "Their bindings are created when JavaScript prepares the scope, but they remain uninitialized until their declaration executes. This period is the Temporal Dead Zone. Reading them during that period throws a ReferenceError.",
  },
  {
    id: "closures",
    slug: "closures",
    title: "Closures",
    section: "core",
    order: 16,
    mvpOrder: 6,
    visibility: "mvp",
    simpleDescription:
      "A closure is like a backpack a function carries around — it holds onto variables from the place where the function was created, even after that place is gone.",
    technicalDescription:
      "A closure is the combination of a function and references to its surrounding lexical environment, allowing the function to access those variables even after the outer function has returned.",
    difficulty: "beginner",
    prerequisites: ["hoisting"],
    interviewQuestion: "What is a closure and where would you use one?",
  },
  {
    id: "currying",
    slug: "currying",
    title: "Currying",
    section: "core",
    order: 17,
    visibility: "later",
    simpleDescription:
      "Currying turns a function that takes many arguments into a chain of functions that each take one argument at a time.",
    technicalDescription:
      "Currying transforms a function of arity N into a sequence of N unary functions, each closing over the arguments supplied so far until all are collected and the original function is invoked.",
    difficulty: "intermediate",
    prerequisites: ["closures"],
    interviewQuestion: "What is currying, and how would you implement multiply(2)(3)?",
  },
  {
    id: "debounce",
    slug: "debounce",
    title: "Debounce",
    section: "core",
    order: 18,
    visibility: "later",
    simpleDescription:
      "Debounce waits until someone stops doing something (like typing) before reacting, resetting the timer every time they act again.",
    technicalDescription:
      "A debounced function clears any pending timer on each invocation and schedules a new setTimeout, so the wrapped function only executes once the calls have stopped arriving for the full delay window.",
    difficulty: "intermediate",
    prerequisites: ["closures"],
    interviewQuestion: "How would you implement debounce from scratch, and when would you use it?",
  },
  {
    id: "throttle",
    slug: "throttle",
    title: "Throttle",
    section: "core",
    order: 19,
    visibility: "later",
    simpleDescription:
      "Throttle lets a function run at most once every fixed interval, no matter how many times it's triggered in between.",
    technicalDescription:
      "A throttled function tracks whether it's currently within a cooldown window; calls during that window are dropped (or trailing-queued, depending on implementation) until the interval elapses and the guard resets.",
    difficulty: "intermediate",
    prerequisites: ["debounce"],
    interviewQuestion: "What's the difference between debounce and throttle?",
  },

  // ───────────────────────── Working with DOM ─────────────────────────
  {
    id: "add-a-link",
    slug: "add-a-link",
    title: "Add a Link",
    section: "dom",
    order: 1,
    visibility: "later",
    simpleDescription:
      "Building an element in JavaScript is a few separate steps: create it, set its properties, then attach it to the page.",
    technicalDescription:
      "document.createElement() builds a detached node; setting properties like href and textContent configures it; appendChild() (or append()) inserts it into the live DOM tree, triggering layout/paint only at that final step.",
    difficulty: "beginner",
    prerequisites: ["highlight-long-words"],
    interviewQuestion: "What's the difference between setting innerHTML and using createElement + appendChild?",
  },
  {
    id: "highlight-long-words",
    slug: "highlight-long-words",
    title: "Highlight Long Words",
    section: "dom",
    order: 2,
    visibility: "later",
    simpleDescription:
      "You can scan a block of text word by word and wrap the long ones in a <mark> tag so the browser highlights them.",
    technicalDescription:
      "Splitting text on whitespace, testing each token's length against a threshold, and rebuilding the string with <mark> wrappers before assigning it via innerHTML re-renders the DOM subtree with the new markup.",
    difficulty: "beginner",
    interviewQuestion: "How would you highlight every word longer than N characters in a paragraph?",
  },
  {
    id: "split-sentences",
    slug: "split-sentences",
    title: "Split Sentences",
    section: "dom",
    order: 3,
    visibility: "later",
    simpleDescription:
      "A block of text can be broken into individual sentences by looking for punctuation like periods and question marks.",
    technicalDescription:
      "A regular expression lookbehind/split on sentence-ending punctuation (e.g. /(?<=[.?!])\\s+/) divides text into sentence tokens, which are then rendered as separate DOM nodes.",
    difficulty: "beginner",
    prerequisites: ["highlight-long-words"],
    interviewQuestion: "How would you split a paragraph into an array of sentences?",
  },
  {
    id: "event-delegation",
    slug: "event-delegation",
    title: "Event Delegation",
    section: "dom",
    order: 4,
    visibility: "later",
    simpleDescription:
      "Instead of listening for clicks on every single item, you can listen once on their shared parent and figure out which item was clicked when the event arrives.",
    technicalDescription:
      "Because DOM events bubble from the target upward through ancestors, a single listener on a common parent can inspect event.target to handle clicks from any current or future child, avoiding per-element listener registration.",
    difficulty: "intermediate",
    prerequisites: ["add-a-link"],
    interviewQuestion: "What is event delegation and why is it more efficient than attaching a listener to every item?",
  },

  // ───────────────────────── Asynchronous JavaScript ─────────────────────────
  {
    id: "callbacks",
    slug: "callbacks",
    title: "Callbacks",
    section: "async",
    order: 1,
    mvpOrder: 1,
    visibility: "mvp",
    simpleDescription:
      "A callback is just a function you hand to another function, to be called later once some work finishes.",
    technicalDescription:
      "Callback-based async APIs invoke a caller-supplied function upon completion (success or error), predating Promises; deeply nested callbacks for sequential async steps produce the well-known \"callback hell\" pattern.",
    difficulty: "beginner",
    prerequisites: ["closures"],
    interviewQuestion: "What problem do Promises solve that callbacks don't handle well?",
  },
  {
    id: "callback-hell",
    slug: "callback-hell",
    title: "Callback Hell",
    section: "async",
    order: 9,
    mvpOrder: 2,
    visibility: "mvp",
    simpleDescription:
      "Nesting callback inside callback inside callback to run steps in order quickly turns into deeply indented, hard-to-follow code.",
    technicalDescription:
      "Sequencing async steps by nesting each callback inside the previous one's completion handler produces \"callback hell\" — indentation grows with every step, error handling is duplicated at each level, and control flow becomes hard to trace.",
    difficulty: "beginner",
    prerequisites: ["callbacks"],
    interviewQuestion: "What makes deeply nested callbacks hard to maintain, and what replaced this pattern?",
  },
  {
    id: "xhr",
    slug: "xhr",
    title: "XMLHttpRequest",
    section: "async",
    order: 2,
    visibility: "later",
    simpleDescription:
      "XMLHttpRequest is the original way browsers made network requests from JavaScript, before fetch() existed.",
    technicalDescription:
      "XHR exposes a stateful, event-driven request lifecycle (open → send → readystatechange/load) predating Promises; it's still used under the hood by some libraries but fetch() is preferred for new code.",
    difficulty: "beginner",
    interviewQuestion: "What are the main lifecycle events of an XMLHttpRequest?",
  },
  {
    id: "fetch",
    slug: "fetch",
    title: "Fetch API",
    section: "async",
    order: 3,
    visibility: "later",
    simpleDescription:
      "fetch() sends a network request and gives you back a Promise that eventually resolves with the response, or rejects if something goes wrong.",
    technicalDescription:
      "fetch() returns a Promise that resolves once response headers arrive (not the body), moving through pending → fulfilled/rejected states; parsing the body (e.g. .json()) is itself a second asynchronous step.",
    difficulty: "beginner",
    prerequisites: ["closures"],
    interviewQuestion: "Does fetch()'s promise reject on a 404 response?",
  },
  {
    id: "callback-to-promise",
    slug: "callback-to-promise",
    title: "Promises",
    section: "async",
    order: 4,
    mvpOrder: 3,
    visibility: "mvp",
    simpleDescription:
      "Any callback-based function can be wrapped so it returns a Promise instead, by resolving or rejecting inside the callback.",
    technicalDescription:
      "\"Promisifying\" wraps a callback-style API in new Promise((resolve, reject) => { ... }), calling resolve on success and reject on error, giving asynchronous work an object representing its future result.",
    difficulty: "intermediate",
    prerequisites: ["callbacks"],
    interviewQuestion: "How would you convert a callback-based function into one that returns a Promise?",
  },
  {
    id: "event-loop",
    slug: "event-loop",
    title: "Event Loop & Task Queue",
    section: "async",
    order: 10,
    mvpOrder: 4,
    visibility: "mvp",
    simpleDescription:
      "When code finishes running, the event loop checks the task queue for waiting work, like a timer that has finished, and runs it next.",
    technicalDescription:
      "Once the call stack empties, the event loop pulls the next callback from the task queue (setTimeout, I/O, UI events) — the runtime's Web APIs handle the waiting, then hand the callback back to the queue once it's ready to run.",
    difficulty: "intermediate",
    prerequisites: ["callback-to-promise"],
    interviewQuestion: "What is the event loop, and how does it decide when a setTimeout callback actually runs?",
  },
  {
    id: "microtask-queue",
    slug: "microtask-queue",
    title: "Microtask Queue & Promise Ordering",
    section: "async",
    order: 11,
    mvpOrder: 5,
    visibility: "mvp",
    simpleDescription:
      "Promise callbacks always run before the next timer callback, because they're placed in a separate microtask queue that gets fully drained first.",
    technicalDescription:
      "After each task, the event loop drains the entire microtask queue (Promise .then/.catch/.finally callbacks, queueMicrotask) before picking up the next item from the task queue — this is why a resolved Promise's callback runs before a setTimeout(fn, 0) callback.",
    difficulty: "intermediate",
    prerequisites: ["event-loop"],
    interviewQuestion:
      "Why does a Promise.then() callback run before a setTimeout(fn, 0) callback, even if the promise resolves later in the code?",
  },
  {
    id: "async-await",
    slug: "async-await",
    title: "Async / Await",
    section: "async",
    order: 5,
    mvpOrder: 6,
    visibility: "mvp",
    simpleDescription:
      "async/await lets you write asynchronous code that reads top-to-bottom like synchronous code, without JavaScript actually stopping and waiting.",
    technicalDescription:
      "await pauses execution of the async function (not the JS thread) until the awaited Promise settles, yielding control back to the event loop so other work can run; it is syntactic sugar over Promise chaining, not a different concurrency model.",
    difficulty: "intermediate",
    prerequisites: ["microtask-queue"],
    interviewQuestion: "Does await block the JavaScript thread while waiting for a promise?",
  },
  {
    id: "parallel-async",
    slug: "parallel-async",
    title: "Parallel vs Sequential",
    section: "async",
    order: 6,
    visibility: "later",
    simpleDescription:
      "Running async tasks one after another adds up their times; starting them all at once means you only wait as long as the slowest one.",
    technicalDescription:
      "Awaiting each async call individually serializes them, summing their durations; starting all operations first (e.g. via Promise.all) lets them run concurrently on the event loop, bounding total time by the longest single operation.",
    difficulty: "intermediate",
    prerequisites: ["callbacks"],
    interviewQuestion: "Why is Promise.all([a(), b()]) usually faster than await a(); await b();?",
  },
  {
    id: "promise-all",
    slug: "promise-all",
    title: "Promise.all + Mapping Data",
    section: "async",
    order: 7,
    visibility: "later",
    simpleDescription:
      "Promise.all lets you fire off several requests at once and wait until every single one finishes before moving on.",
    technicalDescription:
      "Promise.all(iterable) returns a single Promise that fulfills with an array of results once every input Promise fulfills, or rejects immediately with the first rejection reason (short-circuiting the rest).",
    difficulty: "intermediate",
    prerequisites: ["parallel-async"],
    interviewQuestion: "What happens to the other promises if one promise passed to Promise.all() rejects?",
  },
  {
    id: "retry",
    slug: "retry",
    title: "Request Manager / Retry",
    section: "async",
    order: 8,
    visibility: "later",
    simpleDescription:
      "A retry system automatically tries a failed request again a few times, usually waiting a little longer between each attempt.",
    technicalDescription:
      "A retry wrapper catches a rejected request, waits a delay (optionally growing exponentially — exponential backoff), and re-attempts up to a maximum count before finally rejecting, reducing the impact of transient failures.",
    difficulty: "intermediate",
    prerequisites: ["callback-to-promise"],
    interviewQuestion: "How would you implement retry-with-backoff around a flaky async function?",
  },

  // ───────────────────────── Comparison & Memoization ─────────────────────────
  {
    id: "shallow-comparison",
    slug: "shallow-comparison",
    title: "Equality & Reference Identity",
    section: "comparison",
    order: 1,
    mvpOrder: 1,
    visibility: "mvp",
    simpleDescription:
      "Two objects can look identical but still be \"different\" to JavaScript, because objects are compared by reference, not by their contents.",
    technicalDescription:
      "Shallow equality checks only compare an object's own enumerable properties one level deep by reference/value; nested objects are compared by reference identity, so two structurally identical but distinct nested objects are considered unequal.",
    difficulty: "intermediate",
    prerequisites: ["immutable-arrays"],
    interviewQuestion: "Why does { a: { b: 1 } } === { a: { b: 1 } } evaluate to false?",
  },
  {
    id: "deep-comparison",
    slug: "deep-comparison",
    title: "Shallow vs Deep Comparison",
    section: "comparison",
    order: 2,
    mvpOrder: 2,
    visibility: "mvp",
    simpleDescription:
      "A deep comparison checks every nested value inside two objects, not just the top level, to see if they're truly equivalent.",
    technicalDescription:
      "Deep equality recursively traverses matching keys/values (and array indices) at every level, comparing primitives by value and only declaring equality once every leaf node matches, which is O(n) in the total number of nodes.",
    difficulty: "intermediate",
    prerequisites: ["shallow-comparison"],
    interviewQuestion: "How would you write a deep-equal function, and what's its time complexity?",
  },
  {
    id: "memoization",
    slug: "memoization",
    title: "Memoization",
    section: "comparison",
    order: 3,
    mvpOrder: 3,
    visibility: "mvp",
    simpleDescription:
      "Memoization remembers the answer to a slow calculation so that asking the same question again gets an instant reply instead of redoing the work.",
    technicalDescription:
      "A memoized function wraps the original in a cache lookup keyed by its arguments: on a hit it returns the stored result directly, on a miss it computes, stores, and then returns — trading memory for repeated-call time.",
    difficulty: "intermediate",
    prerequisites: ["deep-comparison"],
    interviewQuestion: "What is memoization, and when would using it hurt more than help?",
  },
];

export function getConceptBySlug(slug: string): Concept | undefined {
  return concepts.find((c) => c.slug === slug);
}

export function getConceptsBySection(section: Concept["section"]): Concept[] {
  return concepts.filter((c) => c.section === section).sort((a, b) => a.order - b.order);
}

export function getVisibleConceptsBySection(section: Concept["section"]): Concept[] {
  return concepts
    .filter((c) => c.section === section && c.visibility === "mvp")
    .sort((a, b) => (a.mvpOrder ?? a.order) - (b.mvpOrder ?? b.order));
}

export function getMvpConcepts(): Concept[] {
  return SECTION_ORDER.flatMap((section) => getVisibleConceptsBySection(section));
}
