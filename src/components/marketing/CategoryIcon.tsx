import type { CategorySlug } from '@/content';
import { cn } from '@/lib/cn';

import { CATEGORY_ICONS, CATEGORY_TINTS } from './categoryStyles';

interface CategoryIconProps {
  slug: CategorySlug;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CategoryIcon({ slug, size = 'md', className }: CategoryIconProps) {
  const Icon = CATEGORY_ICONS[slug];
  const box = { sm: 'h-9 w-9 rounded-lg', md: 'h-12 w-12 rounded-xl', lg: 'h-14 w-14 rounded-2xl' }[
    size
  ];
  const icon = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-7 w-7' }[size];
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center ring-1 ring-inset',
        box,
        CATEGORY_TINTS[slug],
        className,
      )}
    >
      <Icon className={icon} aria-hidden="true" strokeWidth={2} />
    </span>
  );
}
