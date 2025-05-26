import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${params.slug}`);
    const event = await response.json();

    return {
      title: `${event.title} | Lovosis Technologies Pvt Ltd | Events`,
      description: event.description || 'Join us for this exciting event at Lovosis Technologies',
      keywords: `${event.title}, events, ${event.category}, Lovosis Technologies events`,
      openGraph: {
        title: `${event.title} | Lovosis Technologies Pvt Ltd Events`,
        description: event.description || 'Join us for this exciting event at Lovosis Technologies',
        type: 'website',
        url: `https://lovosis.in/events/${params.slug}`,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    return {
      title: 'Event | Lovosis Technologies',
      description: 'Join us for exciting events at Lovosis Technologies',
    };
  }
}

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
