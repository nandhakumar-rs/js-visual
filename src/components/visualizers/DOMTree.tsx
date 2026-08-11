"use client";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface DOMNode {
  id: string;
  tag: string;
  attrs?: Record<string, string>;
  text?: string;
  children?: DOMNode[];
  isNew?: boolean;
  isActive?: boolean;
}

export interface DOMTreeProps {
  root: DOMNode;
  className?: string;
}

function NodeLabel({ node }: { node: DOMNode }) {
  if (node.tag === "#text") {
    return <span className="italic text-muted-foreground">&quot;{node.text}&quot;</span>;
  }
  const attrs = node.attrs
    ? Object.entries(node.attrs)
        .map(([k, v]) => ` ${k}="${v}"`)
        .join("")
    : "";
  return (
    <span>
      &lt;{node.tag}
      {attrs}&gt;
    </span>
  );
}

function TreeNode({ node, depth }: { node: DOMNode; depth: number }) {
  return (
    <div style={{ marginLeft: depth === 0 ? 0 : 16 }}>
      <motion.div
        layout
        initial={node.isNew ? { opacity: 0, x: -8 } : false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
        className={cn(
          "inline-flex items-center rounded px-1.5 py-0.5 font-mono text-xs",
          node.isActive && "bg-primary/15 ring-1 ring-primary/40",
          node.isNew && !node.isActive && "bg-sky-500/10"
        )}
      >
        <NodeLabel node={node} />
      </motion.div>
      {node.children && node.children.length > 0 && (
        <div className="border-l border-border/60 pl-2">
          <AnimatePresence initial={false}>
            {node.children.map((child) => (
              <TreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export function DOMTree({ root, className }: DOMTreeProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card/50 p-3", className)}>
      <p className="mb-2 text-xs font-medium text-muted-foreground">DOM Tree</p>
      <TreeNode node={root} depth={0} />
    </div>
  );
}
