import type { HoistingInputs } from "./types";

export function getCode({ declarationType }: HoistingInputs): string[] {
  if (declarationType === "function") {
    return ["sayHello();", "", "function sayHello() {", '  console.log("hi");', "}"];
  }

  return ["console.log(name);", `${declarationType} name = "Sam";`];
}
