import type { Concept } from "@/types/concept";

export const concepts: Concept[] = [
  // ───────────────────────── Core JavaScript ─────────────────────────
  {
    id: "mapping-users",
    slug: "mapping-users",
    title: "Mapping Users",
    section: "core",
    order: 1,
    simpleDescription:
      "array.map() walks through every item in a list and builds a brand new list out of whatever you return for each one.",
    technicalDescription:
      "Array.prototype.map() creates a new array by invoking a callback once per element (in order, skipping holes) and collecting its return values, leaving the original array untouched.",
    difficulty: "beginner",
    interviewQuestion: "What does .map() return, and does it change the original array?",
  },
  {
    id: "null-vs-undefined",
    slug: "null-vs-undefined",
    title: "null vs undefined",
    section: "core",
    order: 2,
    simpleDescription:
      "undefined means JavaScript hasn't given a variable a value yet. null means a person deliberately set it to \"nothing.\"",
    technicalDescription:
      "undefined is the default value of unassigned bindings, missing object properties, and functions without a return; null is a primitive value programmers assign explicitly. typeof null === \"object\" is a long-standing language bug kept for backwards compatibility.",
    difficulty: "beginner",
    prerequisites: ["mapping-users"],
    interviewQuestion: "What's the difference between null and undefined, and why does typeof null return \"object\"?",
  },
  {
    id: "hoisting",
    slug: "hoisting",
    title: "Hoisting",
    section: "core",
    order: 3,
    simpleDescription:
      "Before your code runs, JavaScript scans it and sets up all the variable and function names first — that's why some things seem to work before they're declared.",
    technicalDescription:
      "During the creation phase, var declarations are initialized to undefined and function declarations are fully hoisted; let and const bindings are created but left uninitialized, remaining inaccessible in the Temporal Dead Zone until their declaration executes.",
    difficulty: "beginner",
    prerequisites: ["null-vs-undefined"],
    interviewQuestion: "Are let and const hoisted? What happens if you access them before their declaration?",
  },
  {
    id: "closures",
    slug: "closures",
    title: "Closures",
    section: "core",
    order: 4,
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
    order: 5,
    simpleDescription:
      "Currying turns a function that takes many arguments into a chain of functions that each take one argument at a time.",
    technicalDescription:
      "Currying transforms a function of arity N into a sequence of N unary functions, each closing over the arguments supplied so far until all are collected and the original function is invoked.",
    difficulty: "intermediate",
    prerequisites: ["closures"],
    interviewQuestion: "What is currying, and how would you implement multiply(2)(3)?",
  },
  {
    id: "immutable-arrays",
    slug: "immutable-arrays",
    title: "Adding Without Mutation",
    section: "core",
    order: 6,
    simpleDescription:
      "push() changes the original array. Spreading into a new array ([...array, item]) leaves the original alone and hands you a fresh one.",
    technicalDescription:
      "push() mutates the array in place and returns the new length, keeping the same reference; the spread operator copies existing elements into a new array object, preserving reference identity of the original for frameworks that rely on it (e.g. React).",
    difficulty: "beginner",
    prerequisites: ["mapping-users"],
    interviewQuestion: "Why might you prefer [...array, item] over array.push(item)?",
  },
  {
    id: "concatenating-arrays",
    slug: "concatenating-arrays",
    title: "Concatenating Arrays",
    section: "core",
    order: 7,
    simpleDescription:
      "Both .concat() and [...a, ...b] combine two arrays into a new one — neither changes the arrays you started with.",
    technicalDescription:
      "Array.prototype.concat() and spread syntax both perform a shallow copy merge, producing a new array reference while the source arrays' references are left untouched.",
    difficulty: "beginner",
    prerequisites: ["immutable-arrays"],
    interviewQuestion: "Does a.concat(b) modify a or b?",
  },
  {
    id: "user-existence",
    slug: "user-existence",
    title: "Checking If a User Exists",
    section: "core",
    order: 8,
    simpleDescription:
      "for loops, some(), find(), and findIndex() can all search a list — the difference is what each one hands you back.",
    technicalDescription:
      "some() short-circuits on the first truthy predicate result and returns a boolean; find() returns the first matching element (or undefined); findIndex() returns the first matching index (or -1); a manual for loop gives full control but requires explicit break logic.",
    difficulty: "beginner",
    prerequisites: ["mapping-users"],
    interviewQuestion: "When would you use find() instead of filter()[0]?",
  },
  {
    id: "removing-duplicates",
    slug: "removing-duplicates",
    title: "Removing Duplicates",
    section: "core",
    order: 9,
    simpleDescription:
      "A Set can only hold unique values, so dropping an array's items into one instantly removes duplicates.",
    technicalDescription:
      "Set stores values by SameValueZero equality; [...new Set(array)] is the idiomatic O(n) dedup, while filter()+indexOf() achieves the same result in O(n²) and reduce() offers a manually accumulated equivalent.",
    difficulty: "beginner",
    prerequisites: ["user-existence"],
    interviewQuestion: "How would you remove duplicates from an array of numbers?",
  },
  {
    id: "sorting",
    slug: "sorting",
    title: "Sorting",
    section: "core",
    order: 10,
    simpleDescription:
      "array.sort() compares items as text by default, so [10, 2, 5].sort() gives a surprising order — you need to tell it how to compare numbers.",
    technicalDescription:
      "Without a comparator, sort() converts elements to strings and compares UTF-16 code units; a comparator function (a, b) => a - b defines numeric ordering. sort() mutates and returns the original array; toSorted() (ES2023) returns a new sorted copy.",
    difficulty: "beginner",
    prerequisites: ["removing-duplicates"],
    interviewQuestion: "Why does [10, 2, 5].sort() not return [2, 5, 10], and does sort() mutate the array?",
  },
  {
    id: "range",
    slug: "range",
    title: "Range Function",
    section: "core",
    order: 11,
    simpleDescription:
      "A range function builds a list of numbers between a start and an end, counting by a chosen step.",
    technicalDescription:
      "A range generator is typically implemented as a loop (or Array.from({ length }, (_, i) => start + i * step)) that accumulates values while the current value remains within the bound, respecting the sign of the step.",
    difficulty: "beginner",
    prerequisites: ["sorting"],
    interviewQuestion: "How would you implement range(2, 8, 1) without a library?",
  },
  {
    id: "shuffle",
    slug: "shuffle",
    title: "Shuffle",
    section: "core",
    order: 12,
    simpleDescription:
      "To shuffle a list fairly, walk backward through it and repeatedly swap the current item with a random earlier one — that's the Fisher–Yates algorithm.",
    technicalDescription:
      "Fisher–Yates produces a uniformly random permutation in O(n) by iterating from the last index to the first, swapping each element with one at a uniformly random index ≤ its own. array.sort(() => Math.random() - 0.5) is a common but statistically biased alternative, because Array.prototype.sort()'s comparator isn't guaranteed to be called on every pair.",
    difficulty: "intermediate",
    prerequisites: ["sorting"],
    interviewQuestion: "Why is array.sort(() => Math.random() - 0.5) not a correct shuffle?",
  },
  {
    id: "minimum-occurrences",
    slug: "minimum-occurrences",
    title: "Minimum Value Occurrences",
    section: "core",
    order: 13,
    simpleDescription:
      "First find the smallest number in a list, then count how many times that exact number shows up.",
    technicalDescription:
      "A single reduce (or two-pass loop) can compute Math.min(...array) and then filter the array against that minimum, counting matches — an O(n) two-phase traversal.",
    difficulty: "beginner",
    prerequisites: ["user-existence"],
    interviewQuestion: "How would you count how many times the minimum value appears in an array?",
  },
  {
    id: "this",
    slug: "this",
    title: "this",
    section: "core",
    order: 14,
    simpleDescription:
      "this doesn't mean \"the current object\" — it depends entirely on how a function was called, not where it was written.",
    technicalDescription:
      "this is determined by a function's call-site: implicit binding for object-method calls, undefined/global for plain calls (strict/non-strict), explicit binding via call/apply/bind, new-binding for constructors, and lexical binding (inherited from the enclosing scope) for arrow functions.",
    difficulty: "intermediate",
    prerequisites: ["closures"],
    interviewQuestion: "What determines the value of this inside a regular function versus an arrow function?",
  },
  {
    id: "classes",
    slug: "classes",
    title: "Classes",
    section: "core",
    order: 15,
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
    order: 16,
    simpleDescription:
      "When you access a property JavaScript can't find on an object, it keeps looking up a chain of \"parent\" objects called prototypes until it finds it or runs out.",
    technicalDescription:
      "Every object has an internal [[Prototype]] link (exposed via Object.getPrototypeOf / __proto__). Property lookup walks this prototype chain until the property is found or the chain ends at null; this is the mechanism classes are built on top of.",
    difficulty: "intermediate",
    prerequisites: ["classes"],
    interviewQuestion: "Walk through what happens when you call maya.greet() and greet isn't an own property.",
  },
  {
    id: "modules",
    slug: "modules",
    title: "Modules",
    section: "core",
    order: 17,
    simpleDescription:
      "Modules let you split code across files and explicitly choose what to share (export) and what to use from elsewhere (import).",
    technicalDescription:
      "ES Modules are statically analyzable: import/export bindings are resolved at parse time (enabling tree-shaking) and are live read-only views onto the exporting module's bindings, unlike CommonJS's require()/module.exports, which copies values at runtime.",
    difficulty: "beginner",
    prerequisites: ["closures"],
    interviewQuestion: "What's the difference between a named export and a default export?",
  },
  {
    id: "debounce",
    slug: "debounce",
    title: "Debounce",
    section: "core",
    order: 18,
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
    id: "highlight-long-words",
    slug: "highlight-long-words",
    title: "Highlight Long Words",
    section: "dom",
    order: 1,
    simpleDescription:
      "You can scan a block of text word by word and wrap the long ones in a <mark> tag so the browser highlights them.",
    technicalDescription:
      "Splitting text on whitespace, testing each token's length against a threshold, and rebuilding the string with <mark> wrappers before assigning it via innerHTML re-renders the DOM subtree with the new markup.",
    difficulty: "beginner",
    interviewQuestion: "How would you highlight every word longer than N characters in a paragraph?",
  },
  {
    id: "add-a-link",
    slug: "add-a-link",
    title: "Add a Link",
    section: "dom",
    order: 2,
    simpleDescription:
      "Building an element in JavaScript is a few separate steps: create it, set its properties, then attach it to the page.",
    technicalDescription:
      "document.createElement() builds a detached node; setting properties like href and textContent configures it; appendChild() (or append()) inserts it into the live DOM tree, triggering layout/paint only at that final step.",
    difficulty: "beginner",
    prerequisites: ["highlight-long-words"],
    interviewQuestion: "What's the difference between setting innerHTML and using createElement + appendChild?",
  },
  {
    id: "split-sentences",
    slug: "split-sentences",
    title: "Split Sentences",
    section: "dom",
    order: 3,
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
    id: "xhr",
    slug: "xhr",
    title: "XMLHttpRequest",
    section: "async",
    order: 1,
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
    order: 2,
    simpleDescription:
      "fetch() sends a network request and gives you back a Promise that eventually resolves with the response, or rejects if something goes wrong.",
    technicalDescription:
      "fetch() returns a Promise that resolves once response headers arrive (not the body), moving through pending → fulfilled/rejected states; parsing the body (e.g. .json()) is itself a second asynchronous step.",
    difficulty: "beginner",
    prerequisites: ["closures"],
    interviewQuestion: "Does fetch()'s promise reject on a 404 response?",
  },
  {
    id: "callbacks",
    slug: "callbacks",
    title: "Callbacks",
    section: "async",
    order: 3,
    simpleDescription:
      "A callback is just a function you hand to another function, to be called later once some work finishes.",
    technicalDescription:
      "Callback-based async APIs invoke a caller-supplied function upon completion (success or error), predating Promises; deeply nested callbacks for sequential async steps produce the well-known \"callback hell\" pattern.",
    difficulty: "beginner",
    prerequisites: ["closures"],
    interviewQuestion: "What problem do Promises solve that callbacks don't handle well?",
  },
  {
    id: "parallel-async",
    slug: "parallel-async",
    title: "Parallel vs Sequential",
    section: "async",
    order: 4,
    simpleDescription:
      "Running async tasks one after another adds up their times; starting them all at once means you only wait as long as the slowest one.",
    technicalDescription:
      "Awaiting each async call individually serializes them, summing their durations; starting all operations first (e.g. via Promise.all) lets them run concurrently on the event loop, bounding total time by the longest single operation.",
    difficulty: "intermediate",
    prerequisites: ["callbacks"],
    interviewQuestion: "Why is Promise.all([a(), b()]) usually faster than await a(); await b();?",
  },
  {
    id: "callback-to-promise",
    slug: "callback-to-promise",
    title: "Callback → Promise",
    section: "async",
    order: 5,
    simpleDescription:
      "Any callback-based function can be wrapped so it returns a Promise instead, by resolving or rejecting inside the callback.",
    technicalDescription:
      "\"Promisifying\" wraps a callback-style API in new Promise((resolve, reject) => { ... }), calling resolve on success and reject on error, giving asynchronous work an object representing its future result.",
    difficulty: "intermediate",
    prerequisites: ["callbacks"],
    interviewQuestion: "How would you convert a callback-based function into one that returns a Promise?",
  },
  {
    id: "promise-all",
    slug: "promise-all",
    title: "Promise.all + Mapping Data",
    section: "async",
    order: 6,
    simpleDescription:
      "Promise.all lets you fire off several requests at once and wait until every single one finishes before moving on.",
    technicalDescription:
      "Promise.all(iterable) returns a single Promise that fulfills with an array of results once every input Promise fulfills, or rejects immediately with the first rejection reason (short-circuiting the rest).",
    difficulty: "intermediate",
    prerequisites: ["parallel-async"],
    interviewQuestion: "What happens to the other promises if one promise passed to Promise.all() rejects?",
  },
  {
    id: "async-await",
    slug: "async-await",
    title: "Async / Await",
    section: "async",
    order: 7,
    simpleDescription:
      "async/await lets you write asynchronous code that reads top-to-bottom like synchronous code, without JavaScript actually stopping and waiting.",
    technicalDescription:
      "await pauses execution of the async function (not the JS thread) until the awaited Promise settles, yielding control back to the event loop so other work can run; it is syntactic sugar over Promise chaining, not a different concurrency model.",
    difficulty: "intermediate",
    prerequisites: ["promise-all"],
    interviewQuestion: "Does await block the JavaScript thread while waiting for a promise?",
  },
  {
    id: "retry",
    slug: "retry",
    title: "Request Manager / Retry",
    section: "async",
    order: 8,
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
    title: "Shallow Comparison",
    section: "comparison",
    order: 1,
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
    title: "Deep Comparison",
    section: "comparison",
    order: 2,
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
