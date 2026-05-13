/*
 * This file provides route-level UI and page state for the Inkwell frontend.
 * The comments explain what major functions, components, and helpers do and why they are used.
 */
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Compass, Heart, Clock, ArrowRight } from 'lucide-react';
import api from '../../api/client';
import { PostImage } from '../../components/ui/PostImage';

// Defines search page so related behavior stays grouped in one place.
export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const categorySlug = searchParams.get('category') || '';
  const query = searchParams.get('search') || '';

  useEffect(() => {
    api.get('/api/categories/public/categories/active').then((r) => setCategories(r.data.data)).catch(console.error);
  }, []);

  useEffect(() => {
    const params = {};
    if (query) params.search = query;
    if (categorySlug) params.category = categorySlug;

    api.get('/api/posts/explore', { params })
      .then((r) => setPosts(r.data.data.content))
      .catch(() => setPosts([]));
  }, [query, categorySlug]);

  // Provides clear filters wiring so the framework can apply the expected runtime behavior.
  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Performs the update params workflow so callers do not duplicate this logic.
  const updateParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-brand-900 px-4 py-20 text-white md:px-8">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl" />
        
        <div className="mx-auto max-w-7xl relative z-10 text-center">
          <Compass size={48} className="mx-auto mb-6 text-brand-300" />
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">Explore the Extraordinary</h1>
          <p className="mt-4 text-lg text-brand-100 max-w-2xl mx-auto">
            Dive into thousands of thoughtful stories, expert articles, and creative expressions from our global community.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        {/* Search and Filters */}
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800 md:flex-row md:items-center -mt-20 relative z-20 mb-12">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => updateParams('search', e.target.value)}
              placeholder="Search by title, topic, or keyword..."
              className="w-full rounded-2xl border-none bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-500 transition-all"
            />
          </div>
          <div className="h-px bg-slate-200 dark:bg-slate-700 md:h-10 md:w-px" />
          <select
            value={categorySlug}
            onChange={(e) => updateParams('category', e.target.value)}
            className="w-full rounded-2xl border-none bg-slate-50 py-3.5 px-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-brand-500/20 dark:bg-slate-800 dark:text-slate-300 md:w-64 transition-all appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.slug}>{c.name}</option>
            ))}
          </select>
          {(query || categorySlug) && (
            <button onClick={clearFilters} className="rounded-2xl px-6 py-3.5 text-sm font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 transition-all">
              Clear
            </button>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.postId} className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-brand-300 dark:hover:border-brand-700">
              <Link to={`/posts/${post.slug}`} className="block aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                <PostImage src={post.featuredImageUrl || post.coverImage || post.imageUrl} alt={post.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-900 backdrop-blur-md shadow-sm uppercase tracking-wide">
                    {post.categorySlug || 'Article'}
                  </span>
                </div>
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <Link to={`/posts/${post.slug}`} className="block focus:outline-none mb-3">
                  <h2 className="font-display text-xl font-bold leading-tight text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 flex-1 mb-6">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700 dark:bg-brand-900/50 dark:text-brand-300 text-xs shadow-sm">
                      {post.authorName?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{post.authorName || 'Anonymous'}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">{new Date(post.publishedAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={14} className="text-slate-400" /> {post.readTimeMin || 5}m</span>
                    <span className="flex items-center gap-1 text-rose-500"><Heart size={14} fill="currentColor" /> {post.likesCount || 0}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/50 py-24 text-center dark:border-slate-700 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <Search size={28} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No posts found</h3>
            <p className="mt-2 max-w-sm text-slate-500 dark:text-slate-400 text-sm">
              We couldn't find any articles matching your search criteria. Try adjusting your filters or search terms.
            </p>
            <button onClick={clearFilters} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-brand-700">
              Clear All Filters <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
