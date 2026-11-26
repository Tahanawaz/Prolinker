import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/Badge';
import type { PageHeroContent } from '@/content';

interface PageHeroProps {
  content: PageHeroContent;
  children?: ReactNode;
}

/** Dark, premium header used at the top of inner pages (navbar overlays it). */
export function PageHero({ content, children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-950 pb-20 pt-36 sm:pb-24 sm:pt-44">
      <div aria-hidden="true" className="bg-grid-dark mask-fade-b absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="absolute -top-32 start-1/4 -z-10 h-[28rem] w-[40rem] animate-blob rounded-full bg-brand-500/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 end-0 -z-10 h-80 w-80 animate-blob-slow rounded-full bg-accent-400/15 blur-3xl"
      />
      <div className="container text-center">
        <div className="animate-fade-up">
          <Badge tone="dark">{content.eyebrow}</Badge>
        </div>
        <h1 className="mx-auto mt-6 max-w-4xl animate-fade-up text-balance text-4xl font-extrabold text-white [animation-delay:80ms] sm:text-5xl lg:text-6xl lg:leading-[1.08]">
          {content.title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-pretty text-lg text-brand-100/80 [animation-delay:160ms]">
          {content.description}
        </p>
        {children ? (
          <div className="mt-10 animate-fade-up [animation-delay:240ms]">{children}</div>
        ) : null}
      </div>
    </section>
  );
}
