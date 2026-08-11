# PRD — JavaScript Visual Lab

## 1. Product Overview

Build an interactive web application that teaches JavaScript concepts visually.

Working product name:

**JavaScript Visual Lab**

The application should cover the technical concepts from Sections 1–4 of the referenced JavaScript interview course:

1. Core JavaScript Concepts
2. Working with DOM
3. Asynchronous JavaScript
4. Comparison Functions

This should NOT feel like:

- a traditional online course
- documentation
- a collection of articles
- a collection of static code snippets
- LeetCode
- a video course

It should feel like:

> A visual playground where users can manipulate JavaScript concepts and literally watch JavaScript execute.

The experience should be understandable even to a high-school student who knows only basic programming.

---

# 2. Primary Learning Philosophy

Every concept should follow this loop:

**Predict → Modify → Run → Watch → Explain → Challenge**

The user should rarely just read something.

They should interact with it.

Example for closures:

Instead of displaying:

```js
function createCounter() {
  let count = 0;

  return () => ++count;
}
```

Show:

```text
createCounter()
       ↓

Outer function executes

┌─────────────────┐
│ Scope           │
│ count = 0       │
└─────────────────┘
       ↓
function returned
       ↓
createCounter() finishes

BUT...

┌─────────────────┐
│ Closure keeps   │
│ count alive     │
└─────────────────┘
```

Then let the user click:

**Call counter()**

Animated result:

```text
count
0 → 1
```

Click again:

```text
1 → 2
```

The code line being executed should highlight simultaneously.

---

# 3. Target User

Primary users:

- beginner JavaScript developers
- students
- frontend developers preparing for interviews
- developers who know syntax but struggle with mental models
- visual learners

Assume the learner knows:

- variables
- basic functions
- arrays
- objects

Do NOT assume they understand:

- scope
- execution context
- closures
- prototypes
- event loop
- promises
- references
- DOM propagation

---

# 4. Technology

Use:

- Next.js
- App Router
- TypeScript
- React
- Tailwind CSS
- shadcn/ui
- Lucide icons

Animations should preferably use:

- CSS transitions for simple transitions
- Motion/Framer Motion for state transitions where appropriate

No backend is required for V1.

Store progress locally using `localStorage`.

Do not add authentication.

Do not add databases.

Do not add APIs unless a particular demo absolutely requires simulation.

Network examples should use a simulated request engine so demonstrations are deterministic.

---

# 5. Important Technical Constraint

Do NOT create an unrestricted `eval()` based JavaScript playground for V1.

Each lesson should instead have:

- controlled inputs
- predefined editable values
- safe interactive actions
- deterministic execution
- predefined execution steps

The displayed JavaScript can update based on the selected inputs.

This makes the visual execution engine reliable.

Architecture should allow adding a real sandboxed editor later.

---

# 6. Main Application Structure

Use routes similar to:

```text
/
  → learning dashboard

/learn/core
/learn/dom
/learn/async
/learn/comparison

/learn/[concept-slug]
```

Example:

```text
/learn/closures
/learn/hoisting
/learn/debounce
/learn/event-delegation
/learn/promises
/learn/deep-comparison
```

---

# 7. Main Dashboard

The home page should introduce the app with something short such as:

# Learn JavaScript by Watching It Work

> Change the code. Run it. Watch what JavaScript does.

Show four learning sections.

### 01
Core JavaScript

### 02
DOM

### 03
Async JavaScript

### 04
Comparison & Memoization

Each section card should show:

- number of labs
- completion progress
- concepts
- Continue Learning button

Example:

```text
┌─────────────────────────────────────┐
│ 01                                  │
│ Core JavaScript                     │
│                                     │
│ Scope, Closures, Arrays, this,      │
│ Prototypes, Debounce...             │
│                                     │
│ ███████░░░  7 / 19                  │
│                                     │
│ Continue →                          │
└─────────────────────────────────────┘
```

Below the sections show:

**Your Learning Journey**

with concepts connected visually.

Example:

```text
Variables
   ↓
Scope
   ↓
Hoisting
   ↓
Closures
   ↓
Currying
   ↓
this
   ↓
Classes
   ↓
Prototypes
```

Do NOT aggressively lock lessons.

Users can jump to any concept.

---

# 8. Universal Lesson Layout

Every concept page should use the same reusable learning shell.

Desktop layout:

```text
┌────────────────────────────────────────────────────────────┐
│ ← Core JavaScript            Closures       4 / 19        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Closures                                                   │
│                                                            │
│ A function can remember variables from                     │
│ where it was created.                                      │
│                                                            │
├──────────────────────────┬─────────────────────────────────┤
│                          │                                 │
│ CODE                     │ VISUALIZATION                   │
│                          │                                 │
│ function counter() {     │ Global Scope                    │
│   let count = 0;         │      ↓                          │
│   return () => ++count;  │ createCounter                   │
│ }                        │      ↓                          │
│                          │ Closure                         │
│ ▶ Run                    │ count = 2                       │
│                          │                                 │
├──────────────────────────┴─────────────────────────────────┤
│ Console                                                    │
│ > counter()                                                │
│ 1                                                          │
│ > counter()                                                │
│ 2                                                          │
├────────────────────────────────────────────────────────────┤
│ 🧠 Why did this happen?                                    │
│                                                            │
│ The returned function remembers the scope where it was     │
│ created, even after createCounter finished executing.      │
└────────────────────────────────────────────────────────────┘
```

Responsive mobile layout should stack these sections vertically.

---

# 9. Every Lab Must Contain

Each concept should include these components.

## 9.1 One Sentence Explanation

Explain the idea without jargon first.

Example:

> A closure lets a function remember variables from the place where it was created.

Then optionally show:

**Technical definition**

inside a tooltip/collapsible section.

---

## 9.2 Interactive Controls

Examples:

- buttons
- sliders
- text fields
- switches
- draggable values where useful
- dropdown scenarios

Users should modify something that affects execution.

---

## 9.3 Code Viewer

Use syntax-highlighted JavaScript.

Features:

- line numbers
- highlighted active line
- changed values reflected in code where appropriate
- Copy button
- Reset button
- Run button
- Step button

Example:

```text
1 function createCounter() {
2   let count = 0;
3
4   return function () {
5     count++;
6     return count;
7   };
8 }
```

While executing:

```text
> Line 5 highlighted

count
2 → 3
```

---

# 10. Step Execution Mode

A major feature of the product.

Every important demo should support:

**Run**

and

**Step Through**

Step mode advances one conceptual operation at a time.

Example:

```text
Step 1
Create variable count

Step 2
Assign 0

Step 3
Create inner function

Step 4
Return inner function

Step 5
Outer function removed from call stack

Step 6
Closure still references count
```

Provide:

```text
← Previous
Step 4 of 6
Next →
```

Animate visualization changes between steps.

---

# 11. Console / Logs

Each lab should have an integrated fake console.

Example:

```text
Console

> const counter = createCounter()

> counter()
1

> counter()
2

> counter()
3
```

Differentiate visually:

- commands
- output
- warnings
- errors
- async events

Console should clear when Reset is clicked.

---

# 12. Prediction Interaction

Before certain demos execute, ask:

### What do you think happens?

Example:

```js
console.log(name);
var name = "Sam";
```

Options:

```text
○ Sam
○ undefined
○ ReferenceError
○ null
```

Then:

**Run JavaScript**

After answering:

```text
Your prediction: ReferenceError ❌

Actual result: undefined
```

Then animate WHY.

Prediction should be optional, not an annoying requirement.

---

# 13. "Explain Like I'm 15" Mode

Each lesson should have:

```text
Simple
Technical
```

Simple example:

> A closure is like a backpack a function carries around. The backpack contains variables from the place where the function was created.

Technical:

> A closure is the combination of a function and references to its surrounding lexical environment.

Default to **Simple**.

---

# 14. Shared Visualization Primitives

Create reusable components instead of custom-building every lesson.

Examples:

```text
<VariableBox />
<ArrayVisualizer />
<ObjectVisualizer />
<ScopeBox />
<CallStack />
<ExecutionTimeline />
<ReferenceArrow />
<FunctionNode />
<PrototypeChain />
<DOMTree />
<EventBubble />
<Timer />
<PromiseNode />
<NetworkRequest />
<EventLoop />
<TaskQueue />
<MicrotaskQueue />
<CacheVisualizer />
<ComparisonTree />
<Console />
<CodePanel />
<StepControls />
```

These components are the foundation of the entire application.

---

# 15. Section 1 — Core JavaScript

Create the following interactive labs.

---

## 15.1 Mapping Users

Teach:

```js
users.map(user => user.name)
```

Visualization:

```text
users

┌─────────────┐
│ Alex        │ ────┐
│ age: 20     │     │
└─────────────┘     │
                    │
┌─────────────┐     │    .map(user => user.name)
│ Maya        │ ────┼──────────────→ ["Alex", "Maya", "John"]
│ age: 22     │     │
└─────────────┘     │
                    │
┌─────────────┐     │
│ John        │ ────┘
└─────────────┘
```

Animate each element entering `.map()` individually.

Allow users to:

- add users
- change names
- choose returned property
- run mapping

---

## 15.2 null vs undefined

Visualize variables as boxes.

Examples:

```js
let a;
let b = null;
```

Show:

```text
a
┌─────────────┐
│ undefined   │
└─────────────┘

b
┌─────────────┐
│ null        │
└─────────────┘
```

Explain:

**undefined**
> JavaScript does not currently have a value here.

**null**
> The programmer intentionally placed an empty value here.

Include:

```js
typeof undefined
typeof null
```

Explain the historical `typeof null === "object"` behavior.

---

## 15.3 Hoisting

This should be one of the strongest visual demos.

Allow switching:

```text
var
let
const
function
```

Show two stages:

### Creation Phase

```text
Global Environment

name → undefined
sayHello → function
```

### Execution Phase

Execute line-by-line.

Important:

Teach technically accurate JavaScript.

Do NOT say "`let` and `const` aren't hoisted."

Explain that their bindings are created but are inaccessible before initialization because of the **Temporal Dead Zone**.

Example visualization:

```text
VAR

Creation
name → undefined

Execution
console.log(name)
        ↓
undefined
```

vs

```text
LET

Creation
name → <uninitialized>

Temporal Dead Zone

console.log(name)
        ↓
ReferenceError
```

---

## 15.4 Closures

Interactive counter.

Controls:

```text
Create Counter
Call Counter
Create Second Counter
Reset
```

Visualization:

```text
Global
│
├── counterA
│       ↓
│   Closure
│   count = 3
│
└── counterB
        ↓
    Closure
    count = 1
```

Demonstrate that counters maintain independent closures.

---

## 15.5 Currying

Start with:

```js
multiply(2, 3)
```

Transform visually into:

```js
multiply(2)(3)
```

Show:

```text
multiply(2)
     ↓
creates function remembering
a = 2
     ↓
(3)
     ↓
2 × 3
     ↓
6
```

Allow changing both numbers.

Include practical example:

```js
const double = multiply(2);
double(4);
double(10);
```

---

## 15.6 Adding Elements Without Mutation

Compare:

```js
array.push(4)
```

vs:

```js
const newArray = [...array, 4]
```

Visualization should show object/reference identity.

Mutation:

```text
array ─────→ [1,2,3]
                ↓
             [1,2,3,4]
```

Immutable:

```text
array ───────→ [1,2,3]

newArray ────→ [1,2,3,4]
```

---

## 15.7 Concatenating Arrays

Visualize:

```js
a.concat(b)
```

and

```js
[...a, ...b]
```

Allow arrays to be edited.

Show whether original arrays changed.

---

## 15.8 Checking If User Exists

Compare:

```js
for
some()
find()
findIndex()
```

Let user search for a name.

Visualization should animate traversal:

```text
Alex → Maya → John → Priya
 ❌      ❌      ❌      ✅
```

Then show what each method returns.

Example:

```text
some()      → true
find()      → {name: "Priya"}
findIndex() → 3
```

This should clearly teach WHEN to use each method.

---

## 15.9 Removing Duplicates

Example:

```text
[1, 2, 2, 3, 1]
```

Animate values entering a `Set`.

```text
1 → Set {1}
2 → Set {1,2}
2 → already exists
3 → Set {1,2,3}
1 → already exists
```

Compare:

- Set
- filter
- reduce

---

## 15.10 Sorting

Let users arrange:

```text
Numbers
Names
Objects
```

Demonstrate the common mistake:

```js
[10, 2, 5].sort()
```

Then:

```js
numbers.sort((a, b) => a - b)
```

Visualize pair comparisons.

Very importantly, show that:

```js
sort()
```

mutates the original array.

Also show the modern non-mutating alternative where supported conceptually:

```js
toSorted()
```

---

## 15.11 Range Function

Controls:

```text
Start: 2
End: 8
Step: 1
```

Animation:

```text
2
2 3
2 3 4
...
2 3 4 5 6 7
```

Show loop progression.

---

## 15.12 Shuffle

Do NOT teach random `.sort()` as the correct shuffle algorithm.

Use Fisher–Yates as the primary implementation.

Visualize:

```text
[A B C D E]

Choose random index
        ↓
Swap

[A D C B E]
```

Progress one swap at a time.

Optionally show:

**Common but flawed approach**

```js
array.sort(() => Math.random() - 0.5)
```

Explain briefly why it produces biased results.

---

## 15.13 Count Occurrences of Minimum Value

Example:

```text
[3, 1, 4, 1, 5, 1]
```

Stage 1:

```text
Find minimum
→ 1
```

Stage 2:

```text
3 ❌
1 ✅
4 ❌
1 ✅
5 ❌
1 ✅
```

Result:

```text
Minimum: 1
Occurrences: 3
```

---

## 15.14 `this`

Create scenario switcher:

```text
Object Method
Regular Function
Arrow Function
Class Method
Detached Method
```

Show what `this` points to.

Visualization:

```text
person
┌──────────────────┐
│ name: "Maya"     │
│ sayHello()       │
└──────────────────┘
       ↑
      this
```

Include a detached-method example and demonstrate:

```js
bind()
```

Do not oversimplify `this`.

Explain that its behavior depends on HOW a function is called.

---

## 15.15 Classes

Create interactive class builder.

Example:

```js
class Employee {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello ${this.name}`;
  }
}
```

Click:

**Create Employee**

Animate:

```text
Employee Class
      ↓ new
Employee Instance
name = Maya
```

Then demonstrate inheritance:

```text
Employee
   ↑
Manager
```

Include:

- constructor
- instance
- methods
- getters/setters
- extends
- super

---

## 15.16 Prototypes

Make this one extremely visual.

Example:

```text
maya
 │
 │ [[Prototype]]
 ↓
Employee.prototype
 │
 │ [[Prototype]]
 ↓
Object.prototype
 │
 ↓
null
```

When executing:

```js
maya.greet()
```

Animate property lookup:

```text
maya
greet? ❌
   ↓
Employee.prototype
greet? ✅
```

This visualization is essential.

---

## 15.17 Modules

Create a module graph.

Example:

```text
math.js
 ├── add
 └── multiply
       │
       │ import
       ↓
app.js
```

Toggle between:

```text
Named Export
Default Export
```

Show:

```js
export const add = ...
```

and:

```js
import { add } from "./math";
```

Also provide a small optional explanation of CommonJS:

```js
require()
module.exports
```

but teach ES modules as the primary modern approach.

---

## 15.18 Debounce

This should be highly interactive.

Create a search input.

Every keypress creates a visual event pulse.

Without debounce:

```text
H      → API
He     → API
Hel    → API
Hell   → API
Hello  → API
```

With debounce:

```text
H       timer starts
He      timer reset
Hel     timer reset
Hell    timer reset
Hello   timer reset

wait...

Hello → API
```

Display:

```text
Keystrokes: 5
Function calls: 1
```

Allow changing debounce time with slider:

```text
100ms ─────●───── 1000ms
```

---

## 15.19 Throttle

Use something visually continuous like scroll events.

Without throttle:

```text
event event event event event event
 ↓     ↓     ↓     ↓     ↓     ↓
call  call  call  call  call  call
```

With throttle:

```text
event event event event event event
 ↓
call
        blocked
             blocked
                      ↓
                     call
```

Allow changing throttle interval.

At the end compare:

```text
Debounce
"Wait until things stop."

Throttle
"Allow at most one call per interval."
```

---

# 16. Section 2 — Working With DOM

Add a persistent mini-browser visualization.

Layout:

```text
HTML Code

       ↓

DOM Tree

       ↓

Browser Preview
```

Users should see how manipulating DOM changes the preview.

---

## 16.1 Highlight Long Words

Provide editable paragraph.

Slider:

```text
Highlight words longer than: [8]
```

Show:

```text
Text
 ↓
split
 ↓
inspect each word
 ↓
longer than 8?
 ↓
wrap in <mark>
```

DOM tree should visibly update.

---

## 16.2 Add a Link

Show operations individually:

```text
document.createElement("a")
        ↓
set href
        ↓
set textContent
        ↓
appendChild
```

Animate the DOM tree growing.

---

## 16.3 Split Sentences

Provide textarea.

Example:

```text
Hello world. How are you? JavaScript is fun.
```

Result:

```text
Hello world.
How are you?
JavaScript is fun.
```

Show transformation visually.

Include regex explanation in Technical mode.

Do NOT overwhelm Simple mode with regex syntax.

---

## 16.4 Event Delegation

Create perhaps 20 clickable list items.

Two modes:

### Individual listeners

```text
Item 1 → listener
Item 2 → listener
Item 3 → listener
...
```

### Event delegation

```text
Item 1 ─┐
Item 2 ─┤
Item 3 ─┤
Item 4 ─┘
        ↓
Parent
ONE listener
```

When an item is clicked, animate event bubbling:

```text
button
  ↓
li
  ↓
ul
  ↓
listener executes
```

Show:

```text
Listeners required

Individual: 20
Delegation: 1
```

---

# 17. Section 3 — Asynchronous JavaScript

This section should have the strongest visualizations in the application.

Create reusable:

```text
Call Stack
Web APIs
Microtask Queue
Task Queue
Event Loop
Console
```

Do not show all of these for every beginner demo if unnecessary.

Introduce complexity progressively.

---

# 18. Async Playground Visualization

Reusable structure:

```text
CALL STACK        WEB APIs

┌──────────┐      ┌────────────┐
│          │      │ setTimeout │
│ main()   │      │ fetch()    │
└──────────┘      └────────────┘


MICROTASK QUEUE

Promise callback


TASK QUEUE

setTimeout callback


                ↺
            EVENT LOOP
```

Users should be able to slow animation speed down.

Controls:

```text
0.5x
1x
2x
Step
```

---

# 19. Async Labs

## 19.1 XMLHttpRequest

Teach the older request lifecycle visually:

```text
Create XHR
   ↓
open()
   ↓
send()
   ↓
request travelling
   ↓
response
   ↓
readystatechange/load
```

Label this:

**Legacy API — useful to understand, but Fetch is preferred for most modern code.**

---

## 19.2 Fetch API

Simulate:

```js
fetch("/users")
  .then(response => response.json())
  .then(users => console.log(users))
  .catch(error => console.error(error));
```

Visualize Promise states:

```text
pending
   ↓
fulfilled
```

or:

```text
pending
   ↓
rejected
```

Allow toggle:

```text
Request succeeds
Request fails
```

---

## 19.3 Callbacks

Start with:

```js
getUser(id, callback)
```

Animate:

```text
getUser()
   ↓
waiting...
   ↓
data returned
   ↓
callback(data)
```

Provide a timing slider.

---

## 19.4 Parallel Async Operations

Show three tasks:

```text
Get User       800ms
Get Posts      1200ms
Get Settings   500ms
```

Sequential mode:

```text
User ────────
            Posts ────────────
                              Settings ─────
```

Parallel mode:

```text
User     ────────
Posts    ────────────
Settings ─────
```

Show:

```text
Sequential total: 2500ms
Parallel total: 1200ms
```

Use simulated timing values.

---

## 19.5 Callback → Promise

Show equivalent implementations side-by-side.

```text
Callback
        ↓ Convert
Promise
```

Animate structural changes.

Explain:

> Promises give asynchronous work an object representing its future result.

---

## 19.6 Promise.all + Mapping Data

Example datasets:

```js
users
```

and:

```js
statuses
```

Start both requests concurrently.

Animate:

```text
getUsers() ─────────────┐
                       │
getStatuses() ──────────┤
                       ↓
                  Promise.all
                       ↓
                      map
                       ↓

[
 { name: "Maya", active: true },
 { name: "Alex", active: false }
]
```

Allow one request to fail.

Show why `Promise.all()` rejects.

---

## 19.7 Async / Await

Use exactly the same scenario as the previous Promise demo.

Allow toggle:

```text
Promises
Async/Await
```

The behavior visualization should remain identical.

Only the code representation changes.

This is important pedagogically:

> Async/await changes how asynchronous code is written, not the underlying asynchronous nature.

Animate:

```text
await getUsers()

function pauses

JavaScript can continue other work

promise resolves

function resumes
```

Avoid implying that the JavaScript thread literally blocks.

---

## 19.8 Request Manager / Retry

Simulate an unreliable API.

Controls:

```text
Failures before success: 2

Max retries: 3

Retry delay:
500ms
1000ms
2000ms
```

Visualization:

```text
Attempt #1
   ↓
❌ Failed

wait 500ms

Attempt #2
   ↓
❌ Failed

wait 1000ms

Attempt #3
   ↓
✅ Success
```

Add optional toggle:

```text
Exponential backoff
```

---

# 20. JavaScript Vocabulary

Do not create a full separate lesson for interview vocabulary.

Instead create a small persistent:

**JavaScript Dictionary**

Accessible from the header.

Include:

- function
- method
- object
- instance
- class
- property
- argument
- parameter
- callback
- promise
- scope
- closure
- prototype

Tooltips across the application can link to these definitions.

---

# 21. Section 4 — Comparison Functions

---

## 21.1 Shallow Comparison

Display:

```js
const a = {
  name: "Maya",
  address: {
    city: "Chennai"
  }
};

const b = {
  name: "Maya",
  address: {
    city: "Chennai"
  }
};
```

Visualize references.

```text
a
 ↓
Object A
name: Maya
address ─────→ Object C


b
 ↓
Object B
name: Maya
address ─────→ Object D
```

Walk through properties one level deep.

Highlight where shallow comparison stops.

Allow users to change nested values.

---

## 21.2 Deep Comparison

Reuse the same objects.

Animate recursive traversal:

```text
root
 ↓
name
 ✅

address
 ↓
city
 ✅
```

Display:

```text
Comparisons performed: 3
```

Changing deeply nested property:

```text
city:
Chennai → Bangalore
```

should visibly cause comparison failure at that node.

---

## 21.3 Memoization

Create function:

```js
function slowCalculation(number) {
  ...
}
```

Input:

```text
5
```

First execution:

```text
Input 5
  ↓
calculate
  ↓
result 15
  ↓
CACHE

5 → 15
```

Second execution:

```text
Input 5
 ↓
CACHE LOOKUP
 ↓
HIT
 ↓
15
```

Show metrics:

```text
Calls: 5

Calculations: 2

Cache hits: 3
```

Let user call multiple values.

Cache visualization:

```text
┌────────┬────────┐
│ Input  │ Result │
├────────┼────────┤
│ 5      │ 15     │
│ 8      │ 18     │
└────────┴────────┘
```

---

# 22. Concept Page Footer

Every lesson should end with three things.

## Remember

Example:

> Closures allow functions to keep access to variables from their lexical scope.

## Interview Question

Example:

> What is a closure and where would you use one?

Expandable answer.

## Tiny Challenge

Example:

```js
const counter = createCounter();

counter();
counter();
counter();

What is count now?
```

Options:

```text
1
2
3
undefined
```

After answering:

```text
✅ Correct

Each call uses the same closed-over count variable.
```

---

# 23. Challenge Design

Challenges should be SHORT.

The point is reinforcing the mental model, not solving algorithms.

Types:

### Predict output

```js
console.log(...)
```

### Choose visualization

"Which scope still exists?"

### Fix misconception

"Does `sort()` create a new array?"

### Match

```text
some()       Boolean
find()       Element
findIndex()  Number
```

### Arrange execution

```text
Promise created
Request starts
Promise resolved
.then executes
```

---

# 24. Progress

Track locally.

Store:

```ts
type Progress = {
  completedLessons: string[];
  lessonVisits: Record<string, number>;
  challengeResults: Record<string, boolean>;
};
```

Dashboard:

```text
Your Progress

Core JavaScript
████████░░ 14 / 19

DOM
████░░░░░░ 2 / 4

Async
██░░░░░░░░ 1 / 8

Comparison
░░░░░░░░░░ 0 / 3
```

Do not gamify excessively initially.

No points.

No coins.

No leaderboards.

---

# 25. Navigation

Desktop sidebar:

```text
JavaScript Visual Lab

01 Core JavaScript
   ✓ Mapping
   ✓ null vs undefined
   → Hoisting
   ○ Closures
   ○ Currying
   ...

02 DOM

03 Async

04 Comparison
```

Sidebar should be collapsible.

Mobile should use a Sheet/Drawer.

---

# 26. Header

Header:

```text
JS Visual Lab

[Search concepts]       [Simple / Technical] [Theme]
```

Search should support:

```text
closure
promise
array
prototype
async
```

Selecting result navigates directly to lesson.

---

# 27. Design Direction

Use shadcn design language.

Visual style:

- clean
- educational
- technical
- minimal
- spacious
- modern
- not childish
- not overly corporate

Think:

**Developer tool + interactive textbook + science laboratory**

Avoid:

- excessive gradients
- huge marketing cards
- excessive shadows
- cartoon graphics
- gamification clutter

The visualization itself should be the visual personality of the app.

---

# 28. Dark / Light Mode

Support both.

Dark mode will likely feel best for code execution.

Code blocks should have excellent contrast.

The visual diagrams must remain clearly understandable in both themes.

---

# 29. Animation Principles

Animations are not decoration.

Every animation must answer:

> "What did JavaScript just do?"

Examples:

When `.map()` executes:

```text
element
  ↓
callback
  ↓
returned value
  ↓
new array
```

When closure executes:

```text
function
   ↓
reference arrow appears
   ↓
outer scope retained
```

When Promise resolves:

```text
pending
   ↓
fulfilled
   ↓
callback enters microtask queue
```

When event bubbles:

```text
button
 ↑
li
 ↑
ul
 ↑
document
```

Keep animation duration readable.

Allow replay.

---

# 30. Visualization State

Each lab should expose deterministic execution steps.

Suggested interface:

```ts
type ExecutionStep = {
  id: string;
  title: string;
  description: string;
  activeCodeLines?: number[];
  consoleOutput?: ConsoleEntry[];
  state?: Record<string, unknown>;
};
```

A generic lesson engine should control:

```text
Current step
Next
Previous
Play
Pause
Reset
Execution speed
```

---

# 31. Lesson Configuration Architecture

Avoid putting every lesson inside a gigantic component.

Suggested structure:

```text
src/
  app/
    page.tsx

    learn/
      [slug]/
        page.tsx

  components/
    learning/
      LessonShell.tsx
      CodePanel.tsx
      ConsolePanel.tsx
      ExplanationPanel.tsx
      StepController.tsx
      PredictionCard.tsx
      ChallengeCard.tsx
      ProgressIndicator.tsx

    visualizers/
      ScopeVisualizer.tsx
      ArrayVisualizer.tsx
      ReferenceVisualizer.tsx
      CallStackVisualizer.tsx
      PrototypeVisualizer.tsx
      DOMVisualizer.tsx
      EventLoopVisualizer.tsx
      PromiseVisualizer.tsx
      CacheVisualizer.tsx

    labs/
      closures/
      hoisting/
      currying/
      debounce/
      ...

  data/
    concepts.ts

  lib/
    execution/
    progress/
```

---

# 32. Concept Metadata

Create configuration similar to:

```ts
type Concept = {
  id: string;
  slug: string;
  title: string;
  section:
    | "core"
    | "dom"
    | "async"
    | "comparison";

  order: number;

  simpleDescription: string;
  technicalDescription: string;

  difficulty:
    | "beginner"
    | "intermediate";

  prerequisites?: string[];

  interviewQuestion?: string;
};
```

The content navigation should be driven by this configuration.

---

# 33. No Fake UI

This is important.

Do NOT create visualization cards that merely look interactive.

Every visible:

- Run button
- Reset button
- Step button
- slider
- toggle
- code state
- console
- animation
- input

must actually work.

If a feature isn't implemented yet, don't render a fake version of it.

---

# 34. Accessibility

Use:

- keyboard navigable controls
- semantic buttons
- accessible tooltips
- visible focus states
- appropriate ARIA labels

Animations should not be required to understand the lesson.

Provide textual state descriptions alongside visual animations.

Respect reduced-motion preferences.

---

# 35. Responsive Behaviour

Desktop:

```text
Explanation
Code + Visualization
Console
Challenge
```

Tablet:

```text
Code
Visualization
Console
```

Mobile:

Use tabs if required:

```text
[Code] [Visual] [Console]
```

Never make the user horizontally scroll the entire application.

Code blocks themselves may horizontally scroll.

---

# 36. Out of Scope for V1

Do NOT build:

- authentication
- backend
- database
- accounts
- social features
- leaderboards
- AI tutor
- arbitrary JavaScript execution
- Monaco IDE
- user-created lessons
- video hosting
- payment
- certification

Focus entirely on making JavaScript understandable visually.

---

# 37. Build Strategy

Do NOT immediately create 34 independent, duplicated lesson implementations.

Build in versions.

---

## V0 — Foundation

Build:

- project shell
- sidebar
- dashboard
- concept navigation
- LessonShell
- code panel
- console
- execution controller
- progress system
- Simple/Technical toggle
- theme
- reusable visualizer primitives

Then implement three proof-of-concept labs:

1. Hoisting
2. Closures
3. Debounce

These three are deliberately different and should validate whether the architecture can handle the full product.

### V0 exit criteria

I should be able to:

- open Hoisting
- change `var` → `let`
- predict output
- run code
- step execution
- see active code lines
- watch scope visualization
- see console result

For Closures:

- create multiple counters
- execute each independently
- visually see separate retained scopes

For Debounce:

- type into input
- see each input event
- see timers reset
- adjust debounce delay
- compare raw vs debounced calls

If these work properly, proceed.

---

# 38. V1 — Core JavaScript

Implement:

1. Mapping users
2. null vs undefined
3. Hoisting
4. Closures
5. Currying
6. Immutable array addition
7. Concatenating arrays
8. User existence
9. Removing duplicates
10. Sorting
11. Range
12. Shuffle
13. Minimum occurrences
14. this
15. Classes
16. Prototypes
17. Modules
18. Debounce
19. Throttle

Do not proceed to DOM until all labs actually work.

---

# 39. V2 — DOM

Implement:

1. Highlight long words
2. Add link
3. Split sentences
4. Event delegation

Build reusable DOM-tree visualization.

---

# 40. V3 — Async

Implement:

1. XMLHttpRequest
2. Fetch
3. Callbacks
4. Parallel async operations
5. Callback → Promise
6. Promise.all data mapping
7. Async/Await
8. Request manager/retries

The Event Loop visualizer should be reusable across these lessons.

---

# 41. V4 — Comparison

Implement:

1. Shallow comparison
2. Deep comparison
3. Memoization

Then polish:

- lesson challenges
- progress
- search
- accessibility
- animations
- responsive design

---

# 42. Critical Educational Accuracy

The application should teach accurate JavaScript rather than blindly reproduce examples from another course.

Examples:

### Hoisting

Do not say:

> let and const aren't hoisted.

Explain Temporal Dead Zone accurately.

### Shuffle

Do not present:

```js
array.sort(() => Math.random() - 0.5)
```

as a correct unbiased shuffle.

Teach Fisher–Yates.

### Async/Await

Do not imply `await` blocks the JavaScript thread.

### this

Do not define `this` simply as:

> the current object.

Its value depends on invocation semantics.

### Objects

Clearly distinguish:

```text
value equality
```

from:

```text
reference identity
```

---

# 43. Learning Outcome

After using the application, someone should be able to mentally visualize things like:

### Closure

```text
function → retained lexical scope
```

### Prototype

```text
instance → prototype → Object.prototype → null
```

### Promise

```text
request
↓
pending
↓
resolved
↓
microtask
↓
call stack
```

### Event delegation

```text
child click
↓
event bubbles
↓
parent listener
```

### Memoization

```text
input
↓
cache lookup
├── hit → return cached value
└── miss → calculate → cache → return
```

The most important product test is:

> Can someone understand the mental model without needing a teacher beside them?

---

# 44. Definition of Done for Every Lab

A lesson is NOT complete unless all of these work:

- concept introduction exists
- simple explanation exists
- technical explanation exists
- runnable interaction exists
- user can modify at least one meaningful variable/input
- code is shown
- relevant code line highlights during execution
- execution can be replayed
- console/log output is visible where appropriate
- visualization changes during execution
- Reset works
- Step mode works where relevant
- "Why did this happen?" explanation exists
- at least one mini challenge exists
- responsive layout works
- light/dark themes work
- no console errors
- no fake interactions

---

# 45. Initial Claude Task

Start by implementing **V0 only**.

Do not attempt all 34 labs immediately.

First establish the visual language and reusable execution architecture.

Build these three complete labs:

### Hoisting
Tests execution-context/scope visualization.

### Closures
Tests persistent/reference-based visualization.

### Debounce
Tests time-based animated visualization.

These three labs should feel polished enough that the architecture can later support every other concept without redesigning the application.

Before adding additional concepts, ensure common functionality has been extracted into reusable components.

The quality bar is:

> I should be able to hand the Hoisting, Closure, or Debounce page to someone who has never understood the concept, let them play with it for five minutes, and have the visualization explain what JavaScript is actually doing.