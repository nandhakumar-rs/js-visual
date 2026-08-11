import type { ExecutionStep } from "@/lib/execution/types";
import type { DOMNode } from "@/components/visualizers/DOMTree";
import type { AddLinkInputs, AddLinkStepState } from "./types";

const BASE_ROOT: DOMNode = {
  id: "container",
  tag: "div",
  attrs: { class: "container" },
  children: [
    {
      id: "existing-p",
      tag: "p",
      children: [{ id: "existing-text", tag: "#text", text: "Some existing content." }],
    },
  ],
};

export function buildInitialSteps({ href, text }: AddLinkInputs): ExecutionStep<AddLinkStepState>[] {
  return [
    {
      id: "create",
      title: 'document.createElement("a")',
      description: "A new <a> element is created in memory — it doesn't exist in the page's DOM tree yet.",
      whyExplanation: "createElement() only builds a detached node. Nothing on the page changes until it's actually inserted somewhere.",
      activeCodeLines: [1],
      state: { root: BASE_ROOT, detachedNode: { id: "link", tag: "a", isNew: true } },
    },
    {
      id: "href",
      title: "link.href = ...",
      description: `The href attribute is set to "${href}".`,
      activeCodeLines: [2],
      state: { root: BASE_ROOT, detachedNode: { id: "link", tag: "a", attrs: { href }, isNew: true } },
    },
    {
      id: "text",
      title: "link.textContent = ...",
      description: `The link's visible text is set to "${text}".`,
      activeCodeLines: [3],
      state: {
        root: BASE_ROOT,
        detachedNode: {
          id: "link",
          tag: "a",
          attrs: { href },
          isNew: true,
          children: [{ id: "link-text", tag: "#text", text }],
        },
      },
    },
    {
      id: "append",
      title: "container.appendChild(link)",
      description: "The fully configured link is inserted into the live DOM — this is the moment the page actually changes.",
      whyExplanation: "Only appendChild() (or similar insertion methods) actually connects a node to the visible document. createElement + property assignments happen entirely off-screen first.",
      activeCodeLines: [5],
      state: {
        root: {
          ...BASE_ROOT,
          children: [
            ...(BASE_ROOT.children ?? []),
            {
              id: "link",
              tag: "a",
              attrs: { href },
              isNew: true,
              isActive: true,
              children: [{ id: "link-text", tag: "#text", text }],
            },
          ],
        },
      },
    },
  ];
}
