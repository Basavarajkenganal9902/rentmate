import { useApp } from '../context/AppContext';
import { CATEGORIES, SAMPLE_ITEMS } from '../data/mockData';
import {
  ArrowRight, Shield, Star, Users, TrendingUp, Package,
  Search, Zap, Camera, Wrench, Bike, Laptop, Music, Tent
} from 'lucide-react';
import ItemCard from '../components/ItemCard';

const STATS = [
  { icon: Users,     value: '50K+',  label: 'Happy Renters' },
  { icon: Package,   value: '12K+',  label: 'Items Listed' },
  { icon: Star,      value: '4.9',   label: 'Avg. Rating' },
  { icon: Shield,    value: '100%',  label: 'Secure Payments' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Browse & Find', desc: 'Search thousands of items in your area. Filter by category, price, and availability.', color: '#6366f1', icon: Search },
  { step: '02', title: 'Request & Book', desc: 'Send a rental request with your dates. Owners respond within hours.', color: '#06b6d4', icon: Zap },
  { step: '03', title: 'Pick Up & Enjoy', desc: 'Coordinate pickup with the owner. Use the item for your rental period.', color: '#10b981', icon: Package },
  { step: '04', title: 'Return & Review', desc: 'Return the item and leave a review. Build your trusted renter profile.', color: '#f59e0b', icon: Star },
];

const CAT_ICONS = {
  cameras: Camera, tools: Wrench, bicycles: Bike, electronics: Laptop, music: Music, camping: Tent,
};

export default function HomePage() {
  const { navigate } = useApp();
  const featured = SAMPLE_ITEMS.filter(i => i.featured).slice(0, 4);
  const topRated = [...SAMPLE_ITEMS].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <div>
      {/* ===== HERO ===== */}
      <section style={hero.section}>
        <div style={hero.bg} />
        <div style={hero.circles}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ ...hero.circle, ...hero[`c${i}`] }} />
          ))}
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={hero.content}>
            <div style={hero.pill}>
              <TrendingUp size={13} /> Over 50,000 successful rentals this month
            </div>
            <h1 style={hero.title}>
              Rent Anything You
              <br />
              <span style={hero.titleGrad}>Need, Anytime</span>
            </h1>
            <p style={hero.sub}>
              The smartest peer-to-peer rental marketplace. Borrow cameras, tools, bicycles, electronics and more — from people near you.
            </p>

            {/* Search Bar */}
            <div style={hero.searchBar}>
              <Search size={18} color="var(--gray-400)" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search cameras, tools, bikes, drones..."
                style={hero.searchInput}
                onFocus={() => navigate('browse')}
              />
              <button className="btn btn-primary" onClick={() => navigate('browse')}>
                Search
              </button>
            </div>

            {/* Quick Links */}
            <div style={hero.quickLinks}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Popular:</span>
              {['Camera', 'Bicycle', 'Drone', 'MacBook', 'Tools'].map(tag => (
                <button key={tag} style={hero.tag} onClick={() => navigate('browse')}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Cards */}
          <div style={hero.cards}>
            {SAMPLE_ITEMS.slice(0, 2).map(item => (
              <div key={item.id} style={hero.card} onClick={() => navigate('item-detail', item)}>
                <img src={item.images[0]} alt={item.title} style={hero.cardImage} />
                <div style={hero.cardBody}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)' }}>{item.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary)' }}>₹{item.price.toLocaleString('en-IN')}/{item.unit}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Star size={12} fill="#f59e0b" color="#f59e0b" />
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{item.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section style={{ background: 'white', padding: '48px 0', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} style={statStyle.box}>
                <div style={statStyle.iconBox}>
                  <Icon size={20} color="var(--primary)" />
                </div>
                <div style={statStyle.value}>{value}</div>
                <div style={statStyle.label}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section style={{ padding: '72px 0 48px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
            <div>
              <div style={sectionLabel}>Explore Categories</div>
              <h2 className="section-title">Browse by Category</h2>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate('browse')}>
              View All <ArrowRight size={15} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 12 }}>
            {CATEGORIES.filter(c => c.id !== 'all').map(cat => {
              const Icon = CAT_ICONS[cat.id] || Package;
              return (
                <button key={cat.id} style={catStyle.btn} onClick={() => navigate('browse')}>
                  <div style={{ ...catStyle.icon, background: cat.color + '18', border: `2px solid ${cat.color}30` }}>
                    <span style={{ fontSize: 24 }}>{cat.icon}</span>
                  </div>
                  <span style={catStyle.label}>{cat.label}</span>
                  <span style={catStyle.count}>{SAMPLE_ITEMS.filter(i => i.category === cat.id).length} items</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FEATURED ITEMS ===== */}
      <section style={{ padding: '0 0 72px', background: 'white' }}>
        <div className="container" style={{ paddingTop: 72 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <div>
              <div style={sectionLabel}>Hand-Picked</div>
              <h2 className="section-title">Featured Items</h2>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate('browse')}>
              Browse All <ArrowRight size={15} />
            </button>
          </div>
          <div className="grid-4">
            {featured.map(item => <ItemCard key={item.id} item={item} />)}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section style={{ padding: '72px 0', background: 'linear-gradient(135deg, var(--gray-900) 0%, #1e1b4b 100%)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ ...sectionLabel, color: 'var(--primary-light)' }}>Simple Process</div>
            <h2 style={{ ...sectionTitle, color: 'white' }}>How RentMate Works</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 12, fontSize: 16, maxWidth: 480, margin: '12px auto 0' }}>
              Renting has never been easier. Four simple steps to get the gear you need.
            </p>
          </div>
          <div className="grid-4">
            {HOW_IT_WORKS.map(({ step, title, desc, color, icon: Icon }) => (
              <div key={step} style={hwStyle.card}>
                <div style={{ ...hwStyle.stepNum, color }}>Step {step}</div>
                <div style={{ ...hwStyle.iconBox, background: color + '20', border: `2px solid ${color}40` }}>
                  <Icon size={24} color={color} />
                </div>
                <h3 style={hwStyle.title}>{title}</h3>
                <p style={hwStyle.desc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TOP RATED ===== */}
      <section style={{ padding: '72px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <div>
              <div style={sectionLabel}>Community Favorites</div>
              <h2 className="section-title">Top Rated Items</h2>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate('browse')}>
              See More <ArrowRight size={15} />
            </button>
          </div>
          <div className="grid-4">
            {topRated.map(item => <ItemCard key={item.id} item={item} />)}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={cta.section}>
        <div style={cta.bg} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h2 style={cta.title}>Have something to rent out?</h2>
          <p style={cta.sub}>Earn extra income by listing your idle items. It's free to list!</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-lg" style={cta.btn1} onClick={() => navigate('list-item')}>
              Start Listing <ArrowRight size={18} />
            </button>
            <button className="btn btn-lg btn-secondary" onClick={() => navigate('browse')}>
              Browse Items
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={footer.section}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={16} color="white" />
                </div>
                <span style={{ fontWeight: 800, fontSize: 18 }}>Rent<span style={{ color: 'var(--primary)' }}>Mate</span></span>
              </div>
              <p style={{ color: 'var(--gray-500)', fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
                The smartest peer-to-peer rental platform. Connect with trusted owners and renters in your community.
              </p>
            </div>
            {[
              { title: 'Platform', links: ['Browse Items', 'List an Item', 'How it Works', 'Pricing'] },
              { title: 'Company',  links: ['About Us', 'Blog', 'Careers', 'Press'] },
              { title: 'Support',  links: ['Help Center', 'Safety', 'Terms', 'Privacy'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-800)', marginBottom: 16 }}>{col.title}</div>
                {col.links.map(l => (
                  <div key={l} style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 10, cursor: 'pointer' }}>{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>© 2026 RentMate. All rights reserved.</div>
            <div style={{ display: 'flex', gap: 24 }}>
              {['Twitter', 'Instagram', 'LinkedIn', 'YouTube'].map(s => (
                <span key={s} style={{ fontSize: 13, color: 'var(--gray-400)', cursor: 'pointer' }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const sectionLabel = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--primary)',
  marginBottom: 8,
};
const sectionTitle = {
  fontSize: 32,
  fontWeight: 800,
  color: 'var(--gray-900)',
};

const hero = {
  section: {
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)',
    padding: '100px 0 80px',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  bg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(99,102,241,0.3) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(6,182,212,0.2) 0%, transparent 50%)',
  },
  circles: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  c0: { width: 300, height: 300, top: -100, right: 100, },
  c1: { width: 500, height: 500, bottom: -200, left: -150 },
  c2: { width: 150, height: 150, top: 50, right: 350, background: 'rgba(255,255,255,0.03)' },
  c3: { width: 80, height: 80, bottom: 80, right: 200, background: 'rgba(99,102,241,0.15)' },
  c4: { width: 200, height: 200, top: 200, left: 300, border: '1px solid rgba(255,255,255,0.05)' },
  c5: { width: 60, height: 60, top: 100, left: 100, background: 'rgba(6,182,212,0.15)' },
  content: {
    maxWidth: 640,
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.9)',
    padding: '6px 14px',
    borderRadius: 'var(--radius-full)',
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 24,
    letterSpacing: '0.03em',
  },
  title: {
    fontSize: 56,
    fontWeight: 900,
    color: 'white',
    lineHeight: 1.1,
    marginBottom: 20,
    letterSpacing: '-1px',
  },
  titleGrad: {
    background: 'linear-gradient(135deg, #a5b4fc, #38bdf8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  sub: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 1.6,
    maxWidth: 500,
    marginBottom: 36,
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'white',
    borderRadius: 'var(--radius-xl)',
    padding: '8px 8px 8px 20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    maxWidth: 540,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: 15,
    color: 'var(--gray-700)',
    fontFamily: 'var(--font-sans)',
    background: 'transparent',
    cursor: 'pointer',
  },
  quickLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  tag: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.85)',
    padding: '4px 12px',
    borderRadius: 'var(--radius-full)',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    transition: 'var(--transition)',
  },
  cards: {
    display: 'flex',
    gap: 16,
    marginTop: 48,
    flexWrap: 'wrap',
  },
  card: {
    background: 'white',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    width: 220,
    boxShadow: 'var(--shadow-xl)',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  cardImage: {
    width: '100%',
    height: 130,
    objectFit: 'cover',
  },
  cardBody: {
    padding: '12px 14px 14px',
  },
};

const statStyle = {
  box: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    textAlign: 'center',
    padding: '20px 16px',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--gray-100)',
    background: 'var(--gray-50)',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 'var(--radius-md)',
    background: 'var(--primary-50)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 28,
    fontWeight: 900,
    color: 'var(--gray-900)',
    letterSpacing: '-0.5px',
  },
  label: {
    fontSize: 13,
    color: 'var(--gray-500)',
    fontWeight: 500,
  },
};

const catStyle = {
  btn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    padding: '20px 12px',
    borderRadius: 'var(--radius-lg)',
    border: '1.5px solid var(--gray-200)',
    background: 'white',
    cursor: 'pointer',
    transition: 'var(--transition)',
    fontFamily: 'var(--font-sans)',
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--gray-800)',
  },
  count: {
    fontSize: 11,
    color: 'var(--gray-500)',
  },
};

const hwStyle = {
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 'var(--radius-xl)',
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  stepNum: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 800,
    color: 'white',
  },
  desc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 1.6,
  },
};

const cta = {
  section: {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
    padding: '80px 0',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  bg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(255,255,255,0.05) 0%, transparent 60%)',
  },
  title: { fontSize: 36, fontWeight: 900, color: 'white', marginBottom: 12 },
  sub: { fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 36 },
  btn1: { background: 'white', color: 'var(--primary)', fontWeight: 700, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' },
};

const footer = {
  section: {
    background: 'white',
    borderTop: '1px solid var(--gray-200)',
    padding: '64px 0 32px',
  },
};
