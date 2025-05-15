import { Metadata } from 'next';
import Gallery from '../Components/Gallery';

export const metadata: Metadata = {
  title: 'Gallery - Lovosis Technologies Pvt Ltd',
  description: 'Explore our gallery of products, events, and projects at Lovosis Technologies Pvt Ltd.',
};

export default function GalleryPage() {
  return <Gallery />;
}