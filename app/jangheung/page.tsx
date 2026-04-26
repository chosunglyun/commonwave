import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewspaperLayout from '@/components/NewspaperLayout';
export const metadata = { title: '장흥 뉴스 | COMMON WAVE' };

export default function JangheungPage() {
  return (
    <main>
      <Header />
      <NewspaperLayout title="장흥 뉴스" type="region" value="장흥" />
      <Footer />
    </main>
  );
}
