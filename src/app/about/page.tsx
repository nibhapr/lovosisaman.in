import { Metadata } from 'next';  
import About from "../Components/about";

export const metadata: Metadata = {
  title: 'About Us - Lovosis Technologies',
  description: 'Learn more about Lovosis Technologies - A leading provider of educational equipment, testing instruments, and digital solutions.',
};

export default function Page() {
  return (
    <>
      <About />
    </>
  );
}