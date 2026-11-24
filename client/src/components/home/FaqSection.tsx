import { ArrowRight, MessagesSquare } from 'lucide-react';

import { Accordion } from '@/components/ui/Accordion';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useContent } from '@/content';

export function FaqSection() {
  const { home, nav } = useContent();
  const copy = home.faq;
  const contactLabel = nav.links.find((link) => link.to === '/contact')?.label ?? 'Contact';
  const faqLabel = nav.links.find((link) => link.to === '/faq')?.label ?? 'FAQ';

  return (
    <section className="section bg-white" aria-labelledby="faq-heading">
      <div className="container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeading id="faq-heading" align="start" {...copy} />
          <Reveal delay={120} className="mt-8 rounded-3xl bg-brand-50 p-6 ring-1 ring-brand-100">
            <MessagesSquare className="h-8 w-8 text-brand-700" aria-hidden="true" />
            <div className="mt-4 flex flex-wrap gap-3">
              <ButtonLink to="/faq" variant="primary">
                {faqLabel}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink to="/contact" variant="outline">
                {contactLabel}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
        <Reveal delay={100}>
          <Accordion items={copy.items} />
        </Reveal>
      </div>
    </section>
  );
}
