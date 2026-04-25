import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { glossaryTerms } from '../data/glossary.js';
import Badge from '../components/Badge.jsx';
import Card from '../components/Card.jsx';

const CATEGORIES = ['All', 'Voting', 'Process', 'Security', 'Legal'];

export default function Glossary() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = glossaryTerms.filter((t) => {
    const matchCat = activeCategory === 'All' || t.category === activeCategory;
    const matchSearch =
      !search ||
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.fullForm.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAskAI = (term) =>
    navigate('/assistant', { state: { question: `Can you explain what ${term} means in the context of Indian elections?` } });

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
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search terms (e.g., EVM, VVPAT)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            aria-label="Search glossary terms"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-secondary-container text-on-secondary-container'
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
        <div className="text-center py-16 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl mb-3 block text-slate-300">search_off</span>
          <p className="font-semibold">No terms found</p>
          <p className="text-sm">Try a different search or remove the filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((term) => (
            <Card key={term.id} className="p-5 flex flex-col justify-between">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3
                    className="font-['Public_Sans'] text-xl font-bold text-on-surface cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/glossary/${term.id}`)}
                  >
                    {term.term}
                  </h3>
                  <Badge variant={term.category.toLowerCase()}>{term.category}</Badge>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">{term.definition}</p>
              </div>
              <button
                onClick={() => handleAskAI(term.term)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-full border border-slate-300 text-sm text-on-surface hover:border-primary hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-base">smart_toy</span>
                Ask AI
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
