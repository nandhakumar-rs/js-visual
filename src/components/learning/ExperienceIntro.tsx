import { IntuitionCard } from "./IntuitionCard";
import type { ExperienceConfig } from "./types";

export interface ExperienceIntroProps extends ExperienceConfig {
  className?: string;
}

/**
 * Renders a guided lesson's "Experience" phase: an optional plain-language
 * prompt followed by either custom `content` or a row of IntuitionCards.
 * Reusable by any future lesson that wants a before-any-code, human-language
 * intro — `content` is the escape hatch for intros that need more than the
 * flat card-grid shape.
 */
export function ExperienceIntro({ prompt, cards, content, className }: ExperienceIntroProps) {
  return (
    <div className={className}>
      {prompt && <p className="mb-3 text-sm text-muted-foreground">{prompt}</p>}
      {content ??
        (cards && (
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
        ))}
    </div>
  );
}
