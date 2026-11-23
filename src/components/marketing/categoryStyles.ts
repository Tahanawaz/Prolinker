import {
  BrickWall,
  Hammer,
  HardHat,
  PaintRoller,
  Snowflake,
  Sparkles,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';

import type { CategorySlug } from '@/content';

export const CATEGORY_ICONS: Record<CategorySlug, LucideIcon> = {
  plumber: Wrench,
  electrician: Zap,
  carpenter: Hammer,
  painter: PaintRoller,
  'ac-technician': Snowflake,
  cleaner: Sparkles,
  mason: BrickWall,
  labourer: HardHat,
};

/** Per-category tint so the grid reads as a colourful, scannable set. */
export const CATEGORY_TINTS: Record<CategorySlug, string> = {
  plumber: 'bg-sky-50 text-sky-700 ring-sky-100',
  electrician: 'bg-amber-50 text-amber-700 ring-amber-100',
  carpenter: 'bg-orange-50 text-orange-700 ring-orange-100',
  painter: 'bg-rose-50 text-rose-700 ring-rose-100',
  'ac-technician': 'bg-cyan-50 text-cyan-700 ring-cyan-100',
  cleaner: 'bg-violet-50 text-violet-700 ring-violet-100',
  mason: 'bg-stone-100 text-stone-700 ring-stone-200',
  labourer: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
};
