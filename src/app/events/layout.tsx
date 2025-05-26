import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events | Lovosis Technologies Pvt. Ltd.',
  description: 'Stay updated with the latest events, workshops, and gatherings at Lovosis Technologies. Join us for technology, innovation, education, and manufacturing events.',
  keywords: 'events, technology events, innovation workshops, education seminars, manufacturing events, Lovosis Technologies events',
  openGraph: {
    title: 'Events | Lovosis Technologies Pvt. Ltd.',
    description: 'Stay updated with the latest events, workshops, and gatherings at Lovosis Technologies.',
    type: 'website',
    url: 'https://lovosis.in/events',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
