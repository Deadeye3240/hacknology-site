import { Link } from "react-router-dom";
import { site } from "@/lib/site";
import { footerColumns } from "@/data/footer";
import { Logo } from "@/components/ui/Logo";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { creator } from "@/data/creator";
import { paths } from "@/routes/paths";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-base-950">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="col-span-2 flex flex-col gap-4 md:col-span-2">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-slate-400">
            {site.tagline} A cybersecurity education platform focused on
            authorized, defensive, and controlled training.
          </p>
        </div>

        {footerColumns.map((column) => (
          <div key={column.heading} className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {column.heading}
            </h3>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.to}>
                  {link.external ? (
                    <ExternalLink
                      href={link.to}
                      className="text-sm text-slate-400 hover:text-accent-300"
                    >
                      {link.label}
                    </ExternalLink>
                  ) : (
                    <Link
                      to={link.to}
                      className="text-sm text-slate-400 transition-colors hover:text-accent-300"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>
            &copy; {site.year} {site.nameFormatted}. All rights reserved.
          </p>
          <p className="text-center sm:text-right">
            Maintained by{" "}
            <Link to={paths.support} className="text-slate-400 hover:text-accent-300">
              {creator.name}
            </Link>
            {" · "}
            <ExternalLink href={site.githubUrl} className="text-slate-500 hover:text-accent-300" showIcon={false}>
              GitHub
            </ExternalLink>
          </p>
        </div>
      </div>
    </footer>
  );
}
