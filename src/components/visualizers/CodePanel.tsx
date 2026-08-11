"use client";

import { useState } from "react";
import { Highlight, themes, type PrismTheme } from "prism-react-renderer";
import { Check, Copy } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface CodePanelProps {
  code: string[];
  activeLines?: number[];
  language?: "javascript" | "jsx" | "text";
  showLineNumbers?: boolean;
  title?: string;
  className?: string;
}

const LIGHT_THEME: PrismTheme = themes.oneLight;
const DARK_THEME: PrismTheme = themes.vsDark;

export function CodePanel({
  code,
  activeLines = [],
  language = "javascript",
  showLineNumbers = true,
  title = "Code",
  className,
}: CodePanelProps) {
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();
  const source = code.join("\n");
  const prismTheme = resolvedTheme === "light" ? LIGHT_THEME : DARK_THEME;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — silently ignore.
    }
  }

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-card", className)}>
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs"
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <Highlight theme={prismTheme} code={source} language={language === "text" ? "javascript" : language}>
        {({ className: hlClassName, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={cn(hlClassName, "overflow-x-auto p-3 text-sm leading-relaxed")}
            style={style}
          >
            {tokens.map((line, i) => {
              const lineNumber = i + 1;
              const isActive = activeLines.includes(lineNumber);
              const { className: lineClassName, ...lineProps } = getLineProps({ line });
              return (
                <div
                  key={i}
                  {...lineProps}
                  className={cn(
                    lineClassName,
                    "px-2 -mx-2 rounded transition-colors duration-200",
                    isActive && "bg-primary/15 ring-1 ring-primary/40"
                  )}
                >
                  {showLineNumbers && (
                    <span className="mr-4 inline-block w-4 select-none text-right text-muted-foreground/50">
                      {lineNumber}
                    </span>
                  )}
                  {line.map((token, key) => {
                    const { className: tokenClassName, ...tokenProps } = getTokenProps({ token });
                    return <span key={key} {...tokenProps} className={tokenClassName} />;
                  })}
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
