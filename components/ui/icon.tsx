import { type LucideProps } from 'lucide-react';
import { forwardRef } from 'react';

declare module 'react' {
  interface CSSProperties {
    '--darkreader-inline-stroke'?: string;
    '--darkreader-inline-fill'?: string;
  }
}

// Komponen wrapper untuk ikon yang aman dari ekstensi browser
const SafeSvg = forwardRef<SVGSVGElement, LucideProps>(({ children, className, ...props }, ref) => (
  <svg
    ref={ref}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    suppressHydrationWarning
    data-no-darkreader="true"
    style={{
      // Mencegah dark reader mengubah warna stroke
      '--darkreader-inline-stroke': 'currentColor',
      '--darkreader-inline-fill': 'none',
      ...props.style,
    }}
    {...props}
  >
    {children}
  </svg>
));

SafeSvg.displayName = 'SafeSvg';

export const Plus = forwardRef<SVGSVGElement, Omit<LucideProps, 'ref'>>((props, ref) => (
  <SafeSvg ref={ref} {...props}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </SafeSvg>
));

Plus.displayName = 'Plus';

export const Search = forwardRef<SVGSVGElement, Omit<LucideProps, 'ref'>>((props, ref) => (
  <SafeSvg ref={ref} {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </SafeSvg>
));

Search.displayName = 'Search';

export const Phone = forwardRef<SVGSVGElement, Omit<LucideProps, 'ref'>>((props, ref) => (
  <SafeSvg ref={ref} {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </SafeSvg>
));

Phone.displayName = 'Phone';

export const Mail = forwardRef<SVGSVGElement, Omit<LucideProps, 'ref'>>((props, ref) => (
  <SafeSvg ref={ref} {...props}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </SafeSvg>
));

Mail.displayName = 'Mail';

export const MapPin = forwardRef<SVGSVGElement, Omit<LucideProps, 'ref'>>((props, ref) => (
  <SafeSvg ref={ref} {...props}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </SafeSvg>
));

MapPin.displayName = 'MapPin';

export const MoreVertical = forwardRef<SVGSVGElement, Omit<LucideProps, 'ref'>>((props, ref) => (
  <SafeSvg ref={ref} {...props}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </SafeSvg>
));

MoreVertical.displayName = 'MoreVertical';

export const FileText = forwardRef<SVGSVGElement, Omit<LucideProps, 'ref'>>((props, ref) => (
  <SafeSvg ref={ref} {...props}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </SafeSvg>
));

FileText.displayName = 'FileText';

export const Edit2 = forwardRef<SVGSVGElement, Omit<LucideProps, 'ref'>>((props, ref) => (
  <SafeSvg ref={ref} {...props}>
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </SafeSvg>
));

Edit2.displayName = 'Edit2';

export const Trash2 = forwardRef<SVGSVGElement, Omit<LucideProps, 'ref'>>((props, ref) => (
  <SafeSvg ref={ref} {...props}>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </SafeSvg>
));

Trash2.displayName = 'Trash2';

export const History = forwardRef<SVGSVGElement, Omit<LucideProps, 'ref'>>((props, ref) => (
  <SafeSvg ref={ref} {...props}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l3 3" />
  </SafeSvg>
));

History.displayName = 'History';
