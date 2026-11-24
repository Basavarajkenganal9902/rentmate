import { useState, useMemo } from 'react';
import { SAMPLE_ITEMS, CATEGORIES } from '../data/mockData';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';
import {
  Search, SlidersHorizontal, Grid3X3, List, X, ChevronDown, ChevronUp
} from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Highest Rated' },
  { value: 'newest',     label: 'Newest First' },
];

export default function BrowsePage() {
  const { navigate } = useApp();
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('all');
  const [sort,     setSort]     = useState('featured');
  const [layout,   setLayout]   = useState('grid');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [availOnly, setAvailOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [minRating, setMinRating] = useState(0);

  const filtered = useMemo(() => {
    let items = [...SAMPLE_ITEMS];
    if (search)       items = items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()) || i.tags.some(t => t.includes(search.toLowerCase())));
    if (category !== 'all') items = items.filter(i => i.category === category);
    if (priceMin)     items = items.filter(i => i.price >= Number(priceMin));
    if (priceMax)     items = items.filter(i => i.price <= Number(priceMax));
    if (availOnly)    items = items.filter(i => i.available);
    if (verifiedOnly) items = items.filter(i => i.owner.verified);
    if (minRating > 0) items = items.filter(i => i.rating >= minRating);

    switch (sort) {
      case 'price-asc':  items.sort((a, b) => a.price - b.price);  break;
      case 'price-desc': items.sort((a, b) => b.price - a.price);  break;
      case 'rating':     items.sort((a, b) => b.rating - a.rating); break;
      case 'newest':     items.sort((a, b) => b.id - a.id);         break;
      default:           items.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return items;
  }, [search, category, sort, priceMin, priceMax, availOnly, verifiedOnly, minRating]);

  const clearFilters = () => {
    setSearch(''); setCategory('all'); setPriceMin(''); setPriceMax('');
    setAvailOnly(false); setVerifiedOnly(false); setMinRating(0); setSort('featured');
  };

  const hasFilters = search || category !== 'all' || priceMin || priceMax || availOnly || verifiedOnly || minRating > 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      {/* Header */}
      <div style={styles.header}>
        <div className="container">
          <div style={styles.headerInner}>
            <div>
              <h1 style={styles.title}>Browse Items</h1>
              <p style={styles.sub}>{filtered.length} items available to rent</p>
            </div>
            {hasFilters && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                <X size={14} /> Clear All Filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '24px' }}>
        {/* Search Bar */}
        <div style={styles.searchRow}>
          <div style={styles.searchWrap}>
            <Search size={18} color="var(--gray-400)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by name, category, or tag..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            {search && (
              <button onClick={() => setSearch('')} style={styles.clearBtn}>
                <X size={14} />
              </button>
            )}
          </div>
          <div style={styles.sortWrap}>
            <select value={sort} onChange={e => setSort(e.target.value)} className="form-select" style={{ minWidth: 180 }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div style={styles.layoutToggle}>
            <button onClick={() => setLayout('grid')} style={{ ...styles.layoutBtn, ...(layout === 'grid' ? styles.layoutBtnActive : {}) }}>
              <Grid3X3 size={16} />
            </button>
            <button onClick={() => setLayout('list')} style={{ ...styles.layoutBtn, ...(layout === 'list' ? styles.layoutBtnActive : {}) }}>
              <List size={16} />
            </button>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowFilters(o => !o)}
          >
            <SlidersHorizontal size={15} />
            Filters
            {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Category Tabs */}
        <div style={styles.catScroll}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                ...styles.catTab,
                ...(category === cat.id ? styles.catTabActive : {}),
              }}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>

        <div style={styles.mainLayout}>
          {/* Sidebar Filters */}
          {showFilters && (
            <aside style={styles.sidebar}>
              <div style={styles.filterSection}>
                <div style={styles.filterTitle}>Price per Day (₹)</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="number" placeholder="Min ₹" value={priceMin} onChange={e => setPriceMin(e.target.value)} className="form-input" style={{ flex: 1 }} />
                  <span style={{ color: 'var(--gray-400)' }}>–</span>
                  <input type="number" placeholder="Max ₹" value={priceMax} onChange={e => setPriceMax(e.target.value)} className="form-input" style={{ flex: 1 }} />
                </div>
                <div style={{ marginTop: 8 }}>
                  {[500, 1000, 2500, 5000].map(p => (
                    <button key={p} style={styles.quickPriceBtn} onClick={() => setPriceMax(String(p))}>
                      Under ₹{p.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.filterSection}>
                <div style={styles.filterTitle}>Minimum Rating</div>
                {[4.5, 4.0, 3.5, 0].map(r => (
                  <label key={r} style={styles.radioLabel}>
                    <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)} style={{ accentColor: 'var(--primary)' }} />
                    {r === 0 ? 'Any Rating' : `${r}+ Stars`}
                  </label>
                ))}
              </div>

              <div style={styles.filterSection}>
                <div style={styles.filterTitle}>Filters</div>
                <label style={styles.checkLabel}>
                  <input type="checkbox" checked={availOnly} onChange={e => setAvailOnly(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
                  Available Only
                </label>
                <label style={styles.checkLabel}>
                  <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
                  Verified Owners
                </label>
              </div>

              {hasFilters && (
                <button className="btn btn-ghost btn-sm" style={{ width: '100%' }} onClick={clearFilters}>
                  <X size={14} /> Clear All
                </button>
              )}
            </aside>
          )}

          {/* Results Grid */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {filtered.length === 0 ? (
              <div className="empty-state">
                <Search size={48} />
                <h3>No items found</h3>
                <p>Try adjusting your search terms or filters to find what you're looking for.</p>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : layout === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: showFilters ? 'repeat(3,1fr)' : 'repeat(4,1fr)', gap: 20 }}>
                {filtered.map(item => <ItemCard key={item.id} item={item} />)}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {filtered.map(item => <ItemCard key={item.id} item={item} layout="list" />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    background: 'white',
    borderBottom: '1px solid var(--gray-200)',
    padding: '28px 0',
  },
  headerInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    color: 'var(--gray-900)',
  },
  sub: {
    fontSize: 14,
    color: 'var(--gray-500)',
    marginTop: 4,
  },
  searchRow: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  searchWrap: {
    position: 'relative',
    flex: 1,
    minWidth: 240,
  },
  searchInput: {
    width: '100%',
    padding: '10px 40px 10px 44px',
    border: '1.5px solid var(--gray-200)',
    borderRadius: 'var(--radius)',
    fontSize: 14,
    fontFamily: 'var(--font-sans)',
    color: 'var(--gray-800)',
    background: 'white',
    outline: 'none',
    transition: 'var(--transition)',
  },
  clearBtn: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--gray-400)',
    display: 'flex',
  },
  sortWrap: { display: 'flex', gap: 8 },
  layoutToggle: {
    display: 'flex',
    border: '1.5px solid var(--gray-200)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
  },
  layoutBtn: {
    padding: '9px 12px',
    border: 'none',
    background: 'white',
    cursor: 'pointer',
    color: 'var(--gray-500)',
    transition: 'var(--transition)',
    display: 'flex',
  },
  layoutBtnActive: {
    background: 'var(--primary-50)',
    color: 'var(--primary)',
  },
  catScroll: {
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    paddingBottom: 4,
    marginBottom: 24,
    scrollbarWidth: 'none',
  },
  catTab: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    borderRadius: 'var(--radius-full)',
    border: '1.5px solid var(--gray-200)',
    background: 'white',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--gray-600)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'var(--transition)',
    fontFamily: 'var(--font-sans)',
  },
  catTabActive: {
    background: 'var(--primary)',
    color: 'white',
    border: '1.5px solid var(--primary)',
    fontWeight: 600,
  },
  mainLayout: {
    display: 'flex',
    gap: 24,
    alignItems: 'flex-start',
  },
  sidebar: {
    width: 240,
    flexShrink: 0,
    background: 'white',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    border: '1px solid var(--gray-200)',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    position: 'sticky',
    top: 84,
  },
  filterSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  filterTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--gray-700)',
    paddingBottom: 8,
    borderBottom: '1px solid var(--gray-100)',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: 'var(--gray-600)',
    cursor: 'pointer',
  },
  checkLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: 'var(--gray-600)',
    cursor: 'pointer',
  },
  quickPriceBtn: {
    display: 'inline-flex',
    marginRight: 6,
    marginBottom: 6,
    padding: '3px 10px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--gray-200)',
    background: 'var(--gray-50)',
    fontSize: 12,
    color: 'var(--gray-600)',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    transition: 'var(--transition)',
  },
};
