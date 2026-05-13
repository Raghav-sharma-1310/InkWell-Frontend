/*
 * This file provides route-level UI and page state for the Inkwell frontend.
 * The comments explain what major functions, components, and helpers do and why they are used.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Tag, Sparkles, Heart, Zap,
  Users, Bookmark, LayoutGrid, ShieldCheck, PenTool,
  MessageCircle, BarChart3, Star, Compass, UserPlus,
  CheckCircle2, ChevronRight, Eye
} from 'lucide-react';
import api from '../../api/client';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import { PostImage } from '../../components/ui/PostImage';

// Defines home page so related behavior stays grouped in one place.
export function HomePage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [stats, setStats] = useState({ totalPublishedPosts: 0, totalViews: 0, activeAuthors: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/posts/public').then((r) => r.data.data.content).catch(() => []),
      api.get('/api/categories/public/categories/top').then((r) => r.data.data).catch(() => []),
      api.get('/api/categories/public/tags/trending').then((r) => r.data.data).catch(() => []),
      api.get('/api/posts/public/stats').then((r) => r.data.data).catch(() => ({ totalPublishedPosts: 0, totalViews: 0 })),
      // Fetching users to calculate actual author analytics as fallback or primary data source if specific analytics API is absent
      api.get('/api/auth/public/search', { params: { query: '' } }).then((r) => r.data.data || []).catch(() => []),
    ]).then(([postsData, catsData, tagsData, statsData, usersData]) => {
      setPosts(postsData);
      setCategories(catsData);
      setTags(tagsData);
      setStats({
        totalPublishedPosts: statsData?.totalPublishedPosts || 0,
        totalViews: statsData?.totalViews || 0,
        activeAuthors: usersData.filter(u => u.role === 'AUTHOR' || u.role === 'ADMIN').length || 0,
      });
      setLoading(false);
    });
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-body transition-colors duration-300 selection:bg-brand-500/30 overflow-x-hidden">
      
      {/* 1. Fancy Hero Section */}
      <section className="relative pt-24 pb-32">
        {/* Advanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-gradient-to-br from-brand-400/30 to-purple-400/20 blur-[140px] rounded-[100%] mix-blend-multiply dark:mix-blend-color-dodge dark:from-brand-600/20 dark:to-purple-600/20 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-[10%] right-[-10%] w-[40%] h-[60%] bg-gradient-to-bl from-teal-400/30 to-emerald-400/20 blur-[120px] rounded-[100%] mix-blend-multiply dark:mix-blend-color-dodge dark:from-teal-600/20 dark:to-emerald-600/20 animate-pulse" style={{ animationDuration: '12s' }} />
          <div className="absolute bottom-[-10%] left-[30%] w-[40%] h-[40%] bg-gradient-to-t from-blue-400/20 to-transparent blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-color-dodge dark:from-blue-600/20" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
        </div>

        <div className="mx-auto max-w-7xl px-4 relative z-10 md:px-8 flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          <div className="flex-1 text-center lg:text-left pt-10">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-slate-200/60 bg-white/60 px-4 py-2 text-sm font-semibold backdrop-blur-md shadow-sm dark:border-slate-700/60 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 mb-8 animate-fade-in-up hover:scale-105 transition-transform cursor-default">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/60">
                <Sparkles size={12} className="text-brand-600 dark:text-brand-400" />
              </span>
              <span>The premier platform for authors & readers</span>
            </div>
            
            <h1 className="font-display text-5xl font-extrabold leading-[1.1] tracking-tight text-slate-900 md:text-6xl lg:text-7xl dark:text-white animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Where great <span className="relative whitespace-nowrap"><span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-teal-500 to-brand-500 dark:from-brand-400 dark:via-teal-300 dark:to-brand-400">ideas</span><svg aria-hidden="true" viewBox="0 0 418 42" className="absolute top-2/3 left-0 h-[0.58em] w-full fill-brand-300/40 dark:fill-brand-700/40" preserveAspectRatio="none"><path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.804 33.087-10.447 35.432-9.449 1.576.671-6.85 4.516-22.846 10.4-18.995 6.988-34.939 12.062-38.38 12.193-2.164.082-2.146-.381.164-3.869 3.036-4.593 11.026-9.141 23.953-13.622C167.925 5.761 184.28 2.66 203.371.916z" /></svg></span> find their audience.
            </h1>
            <p className="mt-8 text-xl leading-relaxed text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Inkwell is a polished publishing OS that connects passionate writers with curious readers. Discover compelling articles, build your community, and share your voice.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <Link to="/register?role=AUTHOR" className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-8 py-4 text-lg font-bold text-white shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] transition-all hover:-translate-y-1 hover:bg-brand-700 hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.7)] dark:bg-brand-500 dark:hover:bg-brand-400">
                Start Writing <ArrowRight size={20} />
              </Link>
              <Link to="/search" className="inline-flex items-center gap-2 rounded-2xl bg-white/80 backdrop-blur-md px-8 py-4 text-lg font-bold text-slate-700 shadow-sm ring-1 ring-slate-200/50 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-md dark:bg-slate-900/80 dark:text-slate-200 dark:ring-slate-700/50 dark:hover:bg-slate-800">
                <Compass size={20} /> Explore Blogs
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`h-10 w-10 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center text-xs font-bold text-white shadow-sm z-[${4-i}] bg-gradient-to-br from-brand-${400+i*100} to-teal-${400+i*100}`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Join <strong className="text-slate-900 dark:text-white">{stats.activeAuthors > 0 ? stats.activeAuthors.toLocaleString() : '500'}+</strong> creators <br/>publishing daily.
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-xl lg:max-w-none animate-fade-in-up relative perspective-1000" style={{ animationDelay: '400ms' }}>
            {/* Floating UI Mockup */}
            <div className="relative rounded-3xl border border-white/40 bg-white/40 p-3 backdrop-blur-2xl shadow-2xl dark:border-slate-700/40 dark:bg-slate-800/40 transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-brand-500/30 via-teal-500/30 to-purple-500/30 blur-xl -z-10" />
              <div className="rounded-2xl overflow-hidden bg-white/95 dark:bg-slate-900/95 shadow-inner backdrop-blur-xl">
                {/* Mockup Top Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400 shadow-sm" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400 shadow-sm" />
                    <div className="h-3 w-3 rounded-full bg-green-400 shadow-sm" />
                  </div>
                  <div className="h-4 w-32 rounded-full bg-slate-200/50 dark:bg-slate-800/50" />
                  <div className="h-6 w-6 rounded-full bg-brand-100 dark:bg-brand-900/50" />
                </div>
                {/* Mockup Content */}
                <div className="p-6">
                  {/* Mockup post 1 */}
                  <div className="flex gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800/60">
                    <div className="w-1/3 h-24 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 overflow-hidden relative">
                       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                    </div>
                    <div className="w-2/3 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2">
                         <span className="h-5 w-16 rounded-md bg-brand-50 dark:bg-brand-500/10" />
                         <span className="h-3 w-12 rounded bg-slate-100 dark:bg-slate-800" />
                      </div>
                      <div className="h-5 w-full rounded bg-slate-200 dark:bg-slate-700 mb-2" />
                      <div className="h-5 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />
                    </div>
                  </div>
                  {/* Mockup post 2 */}
                  <div className="flex gap-4 mb-2">
                    <div className="w-1/3 h-24 rounded-xl bg-gradient-to-br from-teal-200 to-teal-300 dark:from-teal-800/50 dark:to-teal-900/50" />
                    <div className="w-2/3 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2">
                         <span className="h-5 w-20 rounded-md bg-teal-50 dark:bg-teal-500/10" />
                         <span className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800" />
                      </div>
                      <div className="h-5 w-11/12 rounded bg-slate-200 dark:bg-slate-700 mb-2" />
                      <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating badges */}
            <div className="absolute -left-8 top-12 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-md dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700 animate-float">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Views</p>
                  <p className="font-display text-lg font-bold text-slate-900 dark:text-white">{stats.totalViews > 0 ? stats.totalViews.toLocaleString() : '2.4M'}</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -right-4 bottom-20 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-md dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700 animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">
                  <Heart size={20} fill="currentColor" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Engagement</p>
                  <p className="font-display text-lg font-bold text-slate-900 dark:text-white">+48% This Week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trending/Featured Blogs Preview Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 relative z-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-4">Trending Articles</h2>
              <p className="text-slate-600 dark:text-slate-400">Discover what the community is reading right now.</p>
            </div>
            <Link to="/search" className="inline-flex items-center gap-2 text-brand-600 font-bold hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors group">
              Explore All Posts <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.length > 0 ? posts.slice(0, 3).map((post) => (
              <article key={post.postId} className="group relative flex flex-col bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] overflow-hidden border border-slate-200/80 dark:border-slate-700/80 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-2 hover:border-brand-300 dark:hover:border-brand-700">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <PostImage src={post.featuredImageUrl || post.coverImage || post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex flex-col flex-1 p-6 lg:p-8 bg-white dark:bg-slate-900 relative">
                  <div className="absolute -top-6 right-6">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform">
                      <ArrowRight size={20} className="-rotate-45" />
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 dark:bg-brand-500/10 dark:text-brand-400 tracking-wide uppercase">
                      {post.categorySlug || 'Article'}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    <Link to={`/posts/${post.slug}`} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-8 flex-1 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-200 to-teal-200 flex items-center justify-center text-sm font-bold text-brand-800 shadow-inner">
                         {post.authorName ? post.authorName[0].toUpperCase() : 'A'}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{post.authorName || 'Author'}</p>
                        <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{new Date(post.publishedAt || Date.now()).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                      <span>{post.readTimeMin || 5} min read</span>
                      <span className="flex items-center gap-1 text-rose-500"><Heart size={12} fill="currentColor" /> {post.likesCount || 0} likes</span>
                    </div>
                  </div>
                </div>
              </article>
            )) : (
              // Refined Static Placeholders
              [1, 2, 3].map((i) => (
                <article key={i} className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center animate-pulse">
                     <BookOpen className="text-slate-300 dark:text-slate-700 w-12 h-12" />
                  </div>
                  <div className="p-6 lg:p-8">
                    <div className="h-6 w-24 bg-brand-50 dark:bg-brand-900/30 rounded-full mb-6 animate-pulse" />
                    <div className="h-8 w-full bg-slate-100 dark:bg-slate-800/50 rounded-lg mb-3 animate-pulse" />
                    <div className="h-8 w-2/3 bg-slate-100 dark:bg-slate-800/50 rounded-lg mb-8 animate-pulse" />
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
                        <div className="h-4 w-20 bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-600 dark:text-brand-400 font-bold tracking-wider uppercase text-sm mb-4 block">Capabilities</span>
            <h2 className="font-display text-4xl font-extrabold text-slate-900 dark:text-white md:text-5xl">Everything you need to succeed</h2>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">A complete toolset designed for modern writers and engaged readers.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: PenTool, title: "Publish blogs easily", desc: "Intuitive editor with rich text, markdown support, and seamless media integration.", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-100 dark:border-blue-500/20" },
              { icon: BookOpen, title: "High-quality content", desc: "Discover thoughtfully crafted stories and articles across diverse topics.", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-100 dark:border-emerald-500/20" },
              { icon: UserPlus, title: "Follow authors", desc: "Build a feed of your favorite writers and never miss a new post.", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10", border: "border-purple-100 dark:border-purple-500/20" },
              { icon: Bookmark, title: "Save & Like posts", desc: "Curate your personal library of inspiring content for future reference.", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/10", border: "border-rose-100 dark:border-rose-500/20" },
              { icon: LayoutGrid, title: "Category discovery", desc: "Find exactly what you're looking for with organized, trending tags.", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-100 dark:border-amber-500/20" },
              { icon: ShieldCheck, title: "Managed platform", desc: "A safe, secure, and moderated environment free from spam.", color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/10", border: "border-indigo-100 dark:border-indigo-500/20" }
            ].map((feature, idx) => (
              <div key={idx} className={`group rounded-3xl bg-white dark:bg-slate-900/50 p-8 border ${feature.border} transition-all duration-300 hover:shadow-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:-translate-y-1`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.bg} ${feature.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Author/Reader Benefits Section - Premium Redesign */}
      <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* For Authors Card */}
            <div className="group relative rounded-[2.5rem] bg-slate-900 text-white overflow-hidden shadow-2xl transition-transform hover:-translate-y-2 duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-600/40 via-purple-600/20 to-transparent opacity-80" />
              <div className="absolute top-0 right-0 p-12 opacity-5 transform translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform duration-1000 group-hover:opacity-10">
                <PenTool size={250} />
              </div>
              <div className="relative z-10 p-10 lg:p-14 h-full flex flex-col">
                <div className="mb-8 inline-flex items-center rounded-full bg-brand-500/20 border border-brand-400/30 px-4 py-1.5 text-sm font-bold text-brand-200 backdrop-blur-md">
                  <PenTool size={14} className="mr-2" /> For Creators
                </div>
                <h2 className="font-display text-4xl lg:text-5xl font-extrabold mb-6 leading-tight text-white">
                  Your stage, <br/>your voice.
                </h2>
                <p className="text-slate-300 text-lg mb-10 max-w-md leading-relaxed">
                  Publish beautifully formatted articles, manage your portfolio, track deep analytics, and reach a passionate global audience.
                </p>
                <div className="space-y-5 mb-12 flex-1">
                  {[
                    'Advanced rich-text & Markdown editor', 
                    'Deep audience insights & analytics', 
                    'Flexible monetization options', 
                    'Direct feedback from engaged readers'
                  ].map((li, i) => (
                    <div key={i} className="flex items-center gap-4 text-slate-200">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-500/30 flex items-center justify-center border border-brand-400/50">
                        <CheckCircle2 size={12} className="text-brand-300" />
                      </div>
                      <span className="font-medium text-sm lg:text-base">{li}</span>
                    </div>
                  ))}
                </div>
                <Link to="/register?role=AUTHOR" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-slate-900 transition-all hover:bg-brand-50 hover:scale-105 shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]">
                  Become an Author <ChevronRight size={20} />
                </Link>
              </div>
            </div>

            {/* For Readers Card */}
            <div className="group relative rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700 transition-transform hover:-translate-y-2 duration-500">
              <div className="absolute inset-0 bg-gradient-to-tl from-teal-500/10 via-emerald-500/5 to-transparent dark:from-teal-500/20 dark:via-emerald-500/10" />
              <div className="absolute bottom-0 right-0 p-12 opacity-5 transform translate-x-12 translate-y-12 group-hover:scale-125 transition-transform duration-1000 group-hover:opacity-10 dark:opacity-10 dark:group-hover:opacity-20 text-slate-900 dark:text-white">
                <BookOpen size={250} />
              </div>
              <div className="relative z-10 p-10 lg:p-14 h-full flex flex-col">
                <div className="mb-8 inline-flex items-center rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 text-sm font-bold text-teal-700 dark:text-teal-300 backdrop-blur-md">
                  <BookOpen size={14} className="mr-2" /> For Readers
                </div>
                <h2 className="font-display text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                  Curated for <br/>your mind.
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-lg mb-10 max-w-md leading-relaxed">
                  Discover insightful stories, save premium articles for later, engage with top authors, and tailor your daily reading experience.
                </p>
                <div className="space-y-5 mb-12 flex-1">
                  {[
                    'Personalized algorithm-free content feed', 
                    'Save posts to infinite custom bookmarks', 
                    'Follow your favorite emerging creators', 
                    'Distraction-free zen reading mode'
                  ].map((li, i) => (
                    <div key={i} className="flex items-center gap-4 text-slate-700 dark:text-slate-200">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-500/30 flex items-center justify-center border border-teal-200 dark:border-teal-400/50">
                        <CheckCircle2 size={12} className="text-teal-600 dark:text-teal-300" />
                      </div>
                      <span className="font-medium text-sm lg:text-base">{li}</span>
                    </div>
                  ))}
                </div>
                <Link to="/register?role=READER" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 dark:bg-teal-600 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-slate-800 dark:hover:bg-teal-500 hover:scale-105 shadow-lg shadow-slate-900/20 dark:shadow-teal-900/30">
                  Start Exploring <ChevronRight size={20} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Real Analytics Statistics Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { label: 'Published Blogs', value: stats.totalPublishedPosts > 0 ? stats.totalPublishedPosts.toLocaleString() : '—', icon: BookOpen, color: 'text-brand-600 dark:text-brand-400', bg: 'bg-brand-100 dark:bg-brand-900/40' },
              { label: 'Total Read Views', value: stats.totalViews > 0 ? stats.totalViews.toLocaleString() : '—', icon: Eye, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-100 dark:bg-teal-900/40' },
              { label: 'Live Categories', value: categories.length > 0 ? categories.length.toLocaleString() : '—', icon: Tag, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/40' },
              { label: 'Active Authors', value: stats.activeAuthors > 0 ? stats.activeAuthors.toLocaleString() : '—', icon: Users, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/40' },
            ].map((stat, idx) => (
              <div key={idx} className="group bg-white dark:bg-slate-900 rounded-[2rem] p-8 text-center border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                <div className={`mx-auto w-16 h-16 rounded-full ${stat.bg} flex items-center justify-center ${stat.color} mb-6 transition-transform group-hover:scale-110`}>
                  <stat.icon size={28} strokeWidth={2.5} />
                </div>
                <div className="font-display text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final CTA Section */}
      <section className="py-32 relative overflow-hidden bg-brand-900 text-white">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-brand-600/40 via-teal-500/20 to-transparent blur-3xl mix-blend-color-dodge pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-gradient-to-tr from-purple-600/40 to-transparent blur-3xl mix-blend-color-dodge pointer-events-none" />
        
        <div className="mx-auto max-w-4xl px-4 relative z-10 text-center">
          <h2 className="font-display text-5xl md:text-6xl font-extrabold mb-8 tracking-tight leading-tight">
            Ready to share your <br className="hidden md:block" />thoughts with the world?
          </h2>
          <p className="text-brand-100 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium">
            Join the community today. Whether you want to write the next great piece or just read it, you belong here.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link to="/register" className="w-full sm:w-auto rounded-2xl bg-white px-10 py-5 text-lg font-extrabold text-brand-900 transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)]">
              Get Started for Free
            </Link>
            <Link to="/search" className="w-full sm:w-auto rounded-2xl border-2 border-white/20 bg-white/5 backdrop-blur-md px-10 py-5 text-lg font-bold text-white transition-all hover:bg-white/10 hover:border-white/40">
              Browse Articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
