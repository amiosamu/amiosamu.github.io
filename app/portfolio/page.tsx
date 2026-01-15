import { Metadata } from "next";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Portfolio - amiosamu",
  description: "My projects and work",
};

interface Project {
  name: string;
  description: string;
  url: string;
  icon: string;
  dates: string;
}

const projects: Project[] = [
  {
    name: "OnTiming",
    description:
      "A free time-tracking application designed to help users build productive habits and achieve goals. Features one-click timers with automatic categorization, intelligent suggestions, and goal-setting capabilities for daily, weekly, and monthly tracking. Includes advanced analytics, customizable reports, data export in CSV/PDF formats, and Pomodoro timer mode.",
    url: "https://ontiming.io",
    icon: "/icons/ontiming.svg",
    dates: "Jun 2025 - Present",
  },
];

export default function PortfolioPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Portfolio</h1>
      <p className="text-muted-foreground mb-12">
        A collection of projects I&apos;ve worked on.
      </p>

      <div className="space-y-8">
        {projects.map((project) => (
          <a
            key={project.name}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <article className="border rounded-lg p-6 transition-colors hover:bg-muted/50">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={project.icon}
                    alt={`${project.name} icon`}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold group-hover:underline">
                      {project.name}
                    </h2>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {project.dates}
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            </article>
          </a>
        ))}
      </div>
    </div>
  );
}
