import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { labs } from "@/data/labs";
import { paths } from "@/routes/paths";

/** Labs are statically defined; admin can review and link to related CMS content. */
export default function AdminLabsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-white">Labs</h2>
      <p className="text-sm text-slate-400">
        Hands-on labs (including ScanMe and Vulnerable Lab) are defined in code for safety isolation.
        Attach resources or pages to labs via the Resources and Pages sections.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {labs.slice(0, 8).map((lab) => (
          <Card key={lab.id} className="flex flex-col gap-2 p-4">
            <h3 className="font-medium text-white">{lab.title}</h3>
            <p className="text-sm text-slate-400 line-clamp-2">{lab.description}</p>
            <Button to={`${paths.labs}/${lab.id}`} variant="ghost" size="sm">View lab</Button>
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <h3 className="mb-2 text-sm font-semibold text-white">Isolated lab environments</h3>
        <div className="flex flex-wrap gap-2">
          <Button to={paths.scanme} variant="secondary" size="sm">ScanMe</Button>
          <Button to={paths.vulnerableLab} variant="secondary" size="sm">Vulnerable Lab</Button>
          <Button to={paths.games} variant="secondary" size="sm">Nerd Games</Button>
        </div>
      </Card>
    </div>
  );
}
