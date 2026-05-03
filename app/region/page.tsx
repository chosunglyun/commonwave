import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewspaperLayout from '@/components/NewspaperLayout';

export default async function RegionAllPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1;
  return (
    <main>
      <Header />
      <NewspaperLayout title="전체 기사" type="region" value="all" page={page} />
      <Footer />
    </main>
  );
}
