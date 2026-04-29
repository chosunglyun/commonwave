import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: '소개 | COMMON WAVE',
  description: 'COMMON WAVE는 강진·고흥·보성·장흥 4개 군의 이야기를 직접 쓰는 협동조합 언론입니다.',
  openGraph: {
    title: '소개 | COMMON WAVE',
    description: 'COMMON WAVE는 강진·고흥·보성·장흥 4개 군의 이야기를 직접 쓰는 협동조합 언론입니다.',
  }
};

export default function AboutPage() {
  return (
    <main style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Header />
      
      {/* 1. 히어로 섹션 */}
      <section className="about-hero">
        <div className="container" style={{ maxWidth: '900px' }}>
          <small className="hero-hanja-decor">COMMON WAVE</small>
          <h1 className="hero-headline">
            김포, 파주, 고양, 의정부 4개 시의 이야기를,<br/>
            직접 씁니다.
          </h1>
          <div className="hero-wordmark">
            <span className="hangul">COMMON WAVE</span>
          </div>
          <p className="hero-subtext">
            COMMON WAVE는 시민이 함께 만드는 협동조합 언론입니다.<br/>
            광고주·정치 세력·자본의 압력에 굴하지 않고,<br/>
            시민의 말을 듣고 시민의 이야기를 전합니다.
          </p>
        </div>
      </section>

      {/* 2. 왜 만들었나 섹션 */}
      <section className="about-section bg-white">
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="section-heading">왜 COMMON WAVE를 만들었나</h2>
          
          <div className="why-grid">
            <div className="why-card">
              <div className="why-number">1</div>
              <h3>서울 편중</h3>
              <p>전국 뉴스는 서울 이야기로 가득합니다.<br/>지역의 일은 지역 매체에서도 찾기 어렵습니다.</p>
            </div>
            <div className="why-card">
              <div className="why-number">2</div>
              <h3>포털 부재</h3>
              <p>포털에서는 우리 4개 시 소식이 검색되지 않거나,<br/>외부 매체의 짧은 토막 기사로만 보입니다.</p>
            </div>
            <div className="why-card">
              <div className="why-number">3</div>
              <h3>보도자료 그대로</h3>
              <p>시청 보도자료가 여과 없이 그대로 올라옵니다.<br/>행정의 시각이 곧 매체의 시각이 됩니다.</p>
            </div>
            <div className="why-card">
              <div className="why-number">4</div>
              <h3>불편한 진실 외면</h3>
              <p>지역의 불편한 진실은 외면받기 일쑤입니다.<br/>누구도 책임지지 않는 사안이 쌓여갑니다.</p>
            </div>
          </div>

          <div className="why-conclusion">
            <p><strong>전문 기자만 매체를 쓰던 시대는 끝났습니다.</strong><br/>
            농민도, 교사도, 자영업자도, 어부도, 학생도<br/>
            — 동네에서 일어난 일을 가장 먼저 보고 가장 잘 아는 사람이<br/>
            직접 알릴 수 있는 시대입니다.</p>
            <p className="mt-4">COMMON WAVE는 그 가능성을 지역 매체 운영의 중심에 둡니다.<br/>
            시민의 말을 듣고, 사실을 확인해, 시민에게 알립니다.</p>
          </div>
        </div>
      </section>



      <Footer />

      <style dangerouslySetInnerHTML={{__html: `
        /* Common */
        .bg-white { background: #ffffff; }
        .bg-gray { background: #f8fafc; }
        .about-section { padding: 5rem 0; }
        .section-heading { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin-bottom: 2.5rem; font-family: 'Nanum Myeongjo', serif; }
        .text-link { color: #1F5946; font-weight: 600; text-decoration: none; border-bottom: 1px solid currentColor; padding-bottom: 2px; }
        .text-link:hover { opacity: 0.8; }
        
        /* 1. Hero */
        .about-hero { padding: 6rem 0 5rem; background: #1F5946; color: #fff; text-align: center; }
        .hero-hanja-decor { display: block; font-size: 1.2rem; opacity: 0.4; letter-spacing: 0.5rem; margin-bottom: 1rem; font-family: 'Batang', serif; }
        .hero-headline { font-size: 2.6rem; font-weight: 800; line-height: 1.4; margin-bottom: 2rem; color: #fff; letter-spacing: -1px; }
        .hero-wordmark { margin-bottom: 2.5rem; display: inline-flex; align-items: baseline; gap: 0.5rem; background: rgba(255,255,255,0.1); padding: 0.5rem 1.2rem; border-radius: 50px; }
        .hero-wordmark .hangul { font-weight: 700; font-size: 1.1rem; }
        .hero-wordmark .hanja { font-family: 'Batang', serif; font-size: 1rem; opacity: 0.8; }
        .hero-subtext { font-size: 1.2rem; line-height: 1.8; opacity: 0.9; }

        /* 2. Why */
        .why-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 3rem; }
        .why-card { background: #f1f5f9; padding: 2rem; border-radius: 12px; }
        .why-number { width: 32px; height: 32px; background: #1F5946; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 1rem; }
        .why-card h3 { font-size: 1.2rem; font-weight: 700; color: #14322A; margin-bottom: 0.8rem; }
        .why-card p { color: #3A4A42; line-height: 1.6; margin: 0; font-size: 0.95rem; }
        .why-conclusion { background: #e6f0ed; padding: 2.5rem; border-radius: 12px; color: #14322A; line-height: 1.8; font-size: 1.1rem; border-left: 4px solid #1F5946; }

        /* 3. Name */
        .title-hanja { font-family: 'Batang', serif; font-size: 2rem; color: rgba(20, 50, 42, 0.7); font-weight: 400; margin-left: 0.5rem; }
        .name-content { font-size: 1.1rem; line-height: 1.8; color: #3A4A42; }
        .hanja-highlight { font-family: 'Batang', serif; font-size: 1.3em; font-weight: bold; color: #1F5946; padding: 0 2px; }

        /* 4. Model */
        .model-intro { font-size: 1.1rem; line-height: 1.8; color: #334155; margin-bottom: 2rem; }
        .model-principles { padding-left: 1.5rem; }
        .model-principles li { margin-bottom: 0.8rem; font-size: 1.05rem; color: #1e293b; line-height: 1.6; }

        /* 5. Greeting */
        .greeting-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }
        .greeting-card { background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
        .greeting-name { font-size: 1.3rem; font-weight: 800; color: #1e293b; margin-bottom: 1rem; }
        .greeting-role { font-size: 0.9rem; color: #64748b; font-weight: 500; }
        .greeting-text { color: #475569; line-height: 1.8; margin: 0; }

        /* 6. Org */
        .org-table-wrapper { background: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
        .org-table { width: 100%; border-collapse: collapse; text-align: left; }
        .org-table th { padding: 1.2rem; background: #f1f5f9; color: #334155; font-weight: 600; width: 30%; border-bottom: 1px solid #e2e8f0; }
        .org-table td { padding: 1.2rem; color: #1e293b; border-bottom: 1px solid #e2e8f0; }
        .org-table tr:last-child th, .org-table tr:last-child td { border-bottom: none; }

        /* 7. Timeline */
        .timeline { border-left: 2px solid #cbd5e1; padding-left: 2rem; margin-left: 1rem; }
        .timeline-item { position: relative; margin-bottom: 2rem; }
        .timeline-item:last-child { margin-bottom: 0; }
        .timeline-item::before { content: ''; position: absolute; left: -2.4rem; top: 0.4rem; width: 12px; height: 12px; border-radius: 50%; background: #1F5946; border: 3px solid #f8fafc; }
        .timeline-date { font-weight: 700; color: #1F5946; margin-bottom: 0.3rem; font-size: 1.1rem; }
        .timeline-content { color: #334155; font-size: 1.05rem; line-height: 1.6; }

        /* 8. Join */
        .join-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; }
        .join-card { display: block; background: #f8fafc; padding: 1.5rem; border-radius: 12px; text-decoration: none; border: 1px solid #e2e8f0; transition: all 0.2s; }
        .join-card:hover { border-color: #1F5946; transform: translateY(-3px); box-shadow: 0 4px 12px rgba(31,89,70,0.1); }
        .join-icon { width: 28px; height: 28px; background: #e2e8f0; color: #475569; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.9rem; margin-bottom: 1rem; }
        .join-card:hover .join-icon { background: #1F5946; color: white; }
        .join-card h3 { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem; }
        .join-card p { font-size: 0.85rem; color: #64748b; line-height: 1.5; margin: 0; }

        /* 9. Contact */
        .contact-info p { margin: 0 0 0.8rem; font-size: 1.05rem; color: #334155; }
        .contact-info strong { color: #1e293b; display: inline-block; width: 80px; }

        /* Utilities */
        .mt-4 { margin-top: 1rem; }
        .mt-6 { margin-top: 1.5rem; }
        .text-sm { font-size: 0.9rem; }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-headline { font-size: 1.8rem; }
          .why-grid { grid-template-columns: 1fr; }
          .greeting-grid { grid-template-columns: 1fr; }
          .join-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .join-grid { grid-template-columns: 1fr; }
          .org-table th, .org-table td { display: block; width: 100%; padding: 0.8rem; }
          .org-table th { background: transparent; padding-bottom: 0; color: #64748b; font-size: 0.9rem; }
          .org-table td { border-bottom: 1px solid #e2e8f0; padding-top: 0.3rem; }
        }
      `}} />
    </main>
  );
}
