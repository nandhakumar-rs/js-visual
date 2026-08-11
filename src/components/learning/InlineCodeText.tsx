import { Fragment } from "react";
import { InlineCode } from "./InlineCode";

export interface InlineCodeTextProps {
  text: string;
}

const BACKTICK_SEGMENT = /(`[^`]+`)/g;

/**
 * Renders a plain string, formatting any `` `backtick-wrapped` `` segments as
 * inline code. Text with no backticks renders unchanged — a safe drop-in
 * replacement anywhere lesson copy is shown as a raw string.
 */
export function InlineCodeText({ text }: InlineCodeTextProps) {
  const parts = text.split(BACKTICK_SEGMENT);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <InlineCode key={index}>{part.slice(1, -1)}</InlineCode>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        )
      )}
    </>
  );
}
