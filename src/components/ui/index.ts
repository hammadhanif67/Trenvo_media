/**
 * Primitives barrel — master.md §26.1's nine.
 * One import surface keeps §26.3's composition rules easy to hold.
 */
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize, ButtonSurface } from './Button';
export { Badge } from './Badge';
export type { BadgeProps, BadgeTone } from './Badge';
export { Container } from './Container';
export type { ContainerProps, ContainerWidth } from './Container';
export { Section } from './Section';
export type { SectionProps, SectionTone, SectionPadding } from './Section';
export { Eyebrow } from './Eyebrow';
export type { EyebrowProps } from './Eyebrow';
export { Heading } from './Heading';
export type { HeadingProps, HeadingLevel, HeadingSize } from './Heading';
export { Prose } from './Prose';
export type { ProseProps } from './Prose';
export { Rule } from './Rule';
export type { RuleProps, RuleTone } from './Rule';
export { Icon } from './Icon';
export type { IconProps } from './Icon';
export { SurfaceContext, useSurface } from './surface';
export type { Surface } from './surface';
