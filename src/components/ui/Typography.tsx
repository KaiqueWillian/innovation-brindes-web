import clsx from 'clsx';
import { HTMLAttributes } from 'react';

type TypographyTone = 'default' | 'muted' | 'brand';

const toneClassMap: Record<TypographyTone, string> = {
  default: 'text-slate-900',
  muted: 'text-slate-600',
  brand: 'text-brand-700'
};

interface TypographyBaseProps {
  tone?: TypographyTone;
}

interface TitleProps extends HTMLAttributes<HTMLHeadingElement>, TypographyBaseProps {}
interface SubtitleProps extends HTMLAttributes<HTMLHeadingElement>, TypographyBaseProps {}
interface TextProps extends HTMLAttributes<HTMLParagraphElement>, TypographyBaseProps {}
interface SpanProps extends HTMLAttributes<HTMLSpanElement>, TypographyBaseProps {}

export function Title({ className, tone = 'default', ...props }: TitleProps) {
  return <h1 className={clsx('text-3xl font-bold leading-tight', toneClassMap[tone], className)} {...props} />;
}

export function Subtitle({ className, tone = 'default', ...props }: SubtitleProps) {
  return <h2 className={clsx('text-xl font-semibold leading-tight', toneClassMap[tone], className)} {...props} />;
}

export function Text({ className, tone = 'default', ...props }: TextProps) {
  return <p className={clsx('text-sm leading-relaxed', toneClassMap[tone], className)} {...props} />;
}

export function Span({ className, tone = 'default', ...props }: SpanProps) {
  return <span className={clsx(toneClassMap[tone], className)} {...props} />;
}
