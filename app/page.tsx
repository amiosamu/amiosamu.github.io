import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="space-y-6">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed">
            Hi, I'm <strong>amiosamu</strong>.
          </p>
          <p className="text-lg leading-relaxed">
            Topic of interest:
          </p>
          <ul>
            <li>computer science</li>
            <li>software engineering</li>
            <li>go</li>
            <li>distributed systems</li>
          </ul>
        </div>

        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-border">
          <Image
            src="/images/Richard_Feynman-1920w.png"
            alt="Richard Feynman quote: What I cannot create, I do not understand"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="pt-4">
          <p className="text-sm text-muted-foreground mb-3">Find me on:</p>
          <div className="flex gap-4 items-center">
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-muted-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/amiosamu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-muted-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-muted-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:your.email@example.com"
              className="text-foreground hover:text-muted-foreground transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

