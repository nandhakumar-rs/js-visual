import { IntuitionCard } from "./IntuitionCard";
import type { ExperienceConfig } from "./types";

export interface ExperienceIntroProps extends ExperienceConfig {
  className?: string;
}

/**
 * Renders a guided lesson's "Experience" phase: an optional plain-language
 * prompt followed by a row of IntuitionCards. Reusable by any future lesson
 * that wants a before-any-code, human-language intro.
 */
export function ExperienceIntro({ prompt, cards, className }: ExperienceIntroProps) {
  return (
    <div className={className}>
      {prompt && <p className="mb-3 text-sm text-muted-foreground">{prompt}</p>}
      <div className="grid gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <IntuitionCard
            key={card.id}
            label={card.label}
            value={card.value}
            caption={card.caption}
            tone={card.tone}
          />
        ))}
      </div>
    </div>
  );
}
