import { FileText } from 'lucide-react';

import { PageHero } from '@/components/marketing/PageHero';
import { useContent } from '@/content';

interface LegalPageProps {
  doc: 'privacy' | 'terms';
}

export function LegalPage({ doc }: LegalPageProps) {
  const content = useContent()[doc];

  return (
    <>
      <PageHero content={content.hero} />
      <section className="section bg-white">
        <div className="container max-w-3xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-ink-muted">{content.updated}</p>
          </div>
          <p className="mt-4 flex items-start gap-3 rounded-2xl bg-accent-50 p-4 text-sm text-accent-700 ring-1 ring-accent-200">
            <FileText className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            {content.draftNotice}
          </p>
          <ol className="mt-12 space-y-10">
            {content.sections.map((section, index) => (
              <li key={section.title}>
                <h2 className="flex items-baseline gap-3 text-2xl font-extrabold text-ink">
                  <span className="font-display text-base text-brand-600" dir="ltr">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {section.title}
                </h2>
                <ul className="mt-4 list-disc space-y-2 ps-12 text-ink-muted marker:text-brand-500">
                  {section.body.map((paragraph) => (
                    <li key={paragraph}>{paragraph}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

export function PrivacyPage() {
  return <LegalPage doc="privacy" />;
}

export function TermsPage() {
  return <LegalPage doc="terms" />;
}
