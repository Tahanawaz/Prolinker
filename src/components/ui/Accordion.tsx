import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';

import { cn } from '@/lib/cn';

export interface AccordionItem {
  q: string;
  a: string;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Index open on first render; -1 for all closed. */
  defaultOpen?: number;
  className?: string;
}

/** Accessible single-open accordion (WAI-ARIA disclosure pattern). */
export function Accordion({ items, defaultOpen = 0, className }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const baseId = useId();

  return (
    <div
      className={cn(
        'divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white',
        className,
      )}
    >
      {items.map((item, index) => {
        const isOpen = open === index;
        const buttonId = `${baseId}-q-${index}`;
        const panelId = `${baseId}-a-${index}`;
        return (
          <div key={item.q}>
            <h3 className="font-sans text-base font-semibold">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  setOpen(isOpen ? -1 : index);
                }}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-start text-ink transition-colors hover:text-brand-800 sm:px-7"
              >
                <span>{item.q}</span>
                <span
                  className={cn(
                    'grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300',
                    isOpen
                      ? 'rotate-180 border-brand-700 bg-brand-700 text-white'
                      : 'border-slate-200 text-ink-muted',
                  )}
                >
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                'grid transition-[grid-template-rows] duration-300 ease-out',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-6 text-ink-muted sm:px-7">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
