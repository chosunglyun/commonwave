import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewspaperLayout from '@/components/NewspaperLayout';

export default async function LocalPeoplePage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1;
  return (
    <main>
      <Header />
      <NewspaperLayout title="지역사람들" type="category" value="지역사람들" page={page} />
      <Footer />
    </main>
  );
}
