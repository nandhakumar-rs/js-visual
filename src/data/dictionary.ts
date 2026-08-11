export interface DictionaryTerm {
  term: string;
  definition: string;
}

export const dictionary: DictionaryTerm[] = [
  { term: "Function", definition: "A reusable block of code that can be called by name, optionally with inputs, and can return a value." },
  { term: "Method", definition: "A function that lives on an object and is called through that object, e.g. user.greet()." },
  { term: "Object", definition: "A collection of key/value pairs (properties), used to group related data and behavior together." },
  { term: "Instance", definition: "A specific object created from a class or constructor function, e.g. maya is an instance of Employee." },
  { term: "Class", definition: "A template for creating objects that share the same shape and methods." },
  { term: "Property", definition: "A named value stored on an object, e.g. name in { name: \"Maya\" }." },
  { term: "Argument", definition: "The actual value you pass into a function call, e.g. the 5 in add(5)." },
  { term: "Parameter", definition: "The named placeholder a function declares to receive an argument, e.g. the n in function add(n)." },
  { term: "Callback", definition: "A function passed into another function, to be called later once some work is done." },
  { term: "Promise", definition: "An object representing the eventual result (or failure) of an asynchronous operation." },
  { term: "Scope", definition: "The region of code where a particular variable name can be accessed." },
  { term: "Closure", definition: "A function bundled together with references to the variables from where it was created." },
  { term: "Prototype", definition: "An object that another object automatically falls back to when a property lookup fails." },
];
