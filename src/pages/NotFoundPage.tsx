import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";

export default function NotFoundPage() {
  return (
    <Section className="min-h-[60vh]">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
        <span className="font-mono text-6xl font-bold text-gradient-accent">
          404
        </span>
        <h1 className="text-2xl font-bold text-white">Page not found</h1>
        <p className="text-slate-400">
          The page you're looking for doesn't exist or has moved. Let's get you
          back on track.
        </p>
        <Button to="/">
          Back to home
          <ArrowRightIcon />
        </Button>
      </div>
    </Section>
  );
}
