import type { AnyLabDefinition } from "@/types/lab";
import { hoistingLab } from "./hoisting";
import { closuresLab } from "./closures";
import { debounceLab } from "./debounce";
import { mappingUsersLab } from "./mapping-users";
import { nullVsUndefinedLab } from "./null-vs-undefined";
import { curryingLab } from "./currying";
import { immutableArraysLab } from "./immutable-arrays";
import { concatenatingArraysLab } from "./concatenating-arrays";
import { userExistenceLab } from "./user-existence";
import { removingDuplicatesLab } from "./removing-duplicates";
import { sortingLab } from "./sorting";
import { rangeLab } from "./range";
import { shuffleLab } from "./shuffle";
import { minimumOccurrencesLab } from "./minimum-occurrences";
import { thisLab } from "./this";
import { classesLab } from "./classes";
import { prototypesLab } from "./prototypes";
import { modulesLab } from "./modules";
import { throttleLab } from "./throttle";
import { highlightLongWordsLab } from "./highlight-long-words";
import { addLinkLab } from "./add-a-link";
import { splitSentencesLab } from "./split-sentences";
import { eventDelegationLab } from "./event-delegation";
import { xhrLab } from "./xhr";
import { fetchLab } from "./fetch";
import { callbacksLab } from "./callbacks";
import { parallelAsyncLab } from "./parallel-async";
import { callbackToPromiseLab } from "./callback-to-promise";
import { promiseAllLab } from "./promise-all";
import { asyncAwaitLab } from "./async-await";
import { retryLab } from "./retry";
import { shallowComparisonLab } from "./shallow-comparison";
import { deepComparisonLab } from "./deep-comparison";
import { memoizationLab } from "./memoization";

// Populated incrementally, one lab module per concept slug. A concept without
// an entry here renders ComingSoonPanel instead of a broken/fake interaction.
export const labRegistry: Partial<Record<string, AnyLabDefinition>> = {
  hoisting: hoistingLab,
  closures: closuresLab,
  debounce: debounceLab,
  "mapping-users": mappingUsersLab,
  "null-vs-undefined": nullVsUndefinedLab,
  currying: curryingLab,
  "immutable-arrays": immutableArraysLab,
  "concatenating-arrays": concatenatingArraysLab,
  "user-existence": userExistenceLab,
  "removing-duplicates": removingDuplicatesLab,
  sorting: sortingLab,
  range: rangeLab,
  shuffle: shuffleLab,
  "minimum-occurrences": minimumOccurrencesLab,
  this: thisLab,
  classes: classesLab,
  prototypes: prototypesLab,
  modules: modulesLab,
  throttle: throttleLab,
  "highlight-long-words": highlightLongWordsLab,
  "add-a-link": addLinkLab,
  "split-sentences": splitSentencesLab,
  "event-delegation": eventDelegationLab,
  xhr: xhrLab,
  fetch: fetchLab,
  callbacks: callbacksLab,
  "parallel-async": parallelAsyncLab,
  "callback-to-promise": callbackToPromiseLab,
  "promise-all": promiseAllLab,
  "async-await": asyncAwaitLab,
  retry: retryLab,
  "shallow-comparison": shallowComparisonLab,
  "deep-comparison": deepComparisonLab,
  memoization: memoizationLab,
};

export function isLabImplemented(slug: string): boolean {
  return slug in labRegistry;
}
