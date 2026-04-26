import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { glossaryTerms } from '../data/glossary.js';
import Badge from '../components/Badge.jsx';
import Card from '../components/Card.jsx';

const CATEGORIES = ['All', 'Voting', 'Process', 'Security', 'Legal'];

export default function Glossary() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() => {
    return glossaryTerms.filter((t) => {
      const matchCat = activeCategory === 'All' || t.category === activeCategory;
      const matchSearch =
        !search ||
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.fullForm.toLowerCase().includes(search.toLowerCase()) ||
        t.definition.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  const [askingTerm, setAskingTerm] = useState(null);
  const handleAskAI = (term) => {
    setAskingTerm(term);
    setTimeout(() => {
      navigate(`/assistant?prompt=${encodeURIComponent(`Can you explain what ${term} means in the context of Indian elections?`)}`);
      setAskingTerm(null);
    }, 600);
  };

  const clearFilters = () => {
    setSearch('');
    setActiveCategory('All');
  };

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-['Public_Sans'] text-3xl md:text-4xl font-bold text-on-surface mb-3">Election Glossary</h1>
        <p className="text-on-surface-variant max-w-xl mx-auto text-sm">
          A comprehensive guide to terminology used in the electoral process. Search or filter to find specific terms.
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4 mb-8 flex flex-col md:flex-row gap-4 items-center sticky top-20 z-30">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" aria-hidden="true">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search terms (e.g., EVM, VVPAT)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            aria-label="Search glossary terms"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-sm" aria-hidden="true">close</span>
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-surface-container text-on-surface-variant border border-slate-200 hover:bg-surface-container-high'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Glossary Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-low rounded-2xl border-2 border-dashed border-slate-200">
          <span className="material-symbols-outlined text-6xl mb-4 block text-slate-300" aria-hidden="true">find_in_page</span>
          <p className="font-['Public_Sans'] text-xl font-bold text-on-surface mb-2">No matching terms found</p>
          <p className="text-sm text-on-surface-variant mb-6">We couldn't find any results for your current search or filters.</p>
          <Button variant="outline" onClick={clearFilters}>Clear all filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((term) => (
            <Card key={term.id} className="p-6 flex flex-col justify-between group">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-3">
                  <h3
                    className="font-['Public_Sans'] text-xl font-bold text-on-surface cursor-pointer group-hover:text-primary transition-colors"
                    onClick={() => navigate(`/glossary/${term.id}`)}
                  >
                    {term.term}
                  </h3>
                  <Badge variant={term.category.toLowerCase()}>{term.category}</Badge>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{term.fullForm}</p>
                <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3">{term.definition}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/glossary/${term.id}`)}
                  className="flex-1 py-2 rounded-full border border-slate-300 text-xs font-bold uppercase tracking-wider text-on-surface hover:bg-slate-50 transition-colors"
                >
                  Details
                </button>
                <button
                  onClick={() => handleAskAI(term.term)}
                  disabled={askingTerm === term.term}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary-container disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                >
                  {askingTerm === term.term ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Asking...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm" aria-hidden="true">smart_toy</span>
                      Ask AI
                    </>
                  )}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
