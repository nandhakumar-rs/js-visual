import { SectionCard } from "@/components/dashboard/SectionCard";
import { SECTION_ORDER } from "@/types/concept";

const SECTIONS = SECTION_ORDER;

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <section className="max-w-2xl space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Learn JavaScript by Watching It Work
        </h1>
        <p className="text-lg text-muted-foreground">
          Change the code. Run it. Watch what JavaScript does.
        </p>
      </section>

      <section aria-label="Learning sections" className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <SectionCard key={section} section={section} />
        ))}
      </section>
    </div>
  );
}
