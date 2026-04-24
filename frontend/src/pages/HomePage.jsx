import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenSquare } from 'lucide-react';
import { useAllPosts } from '../hooks/usePosts';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import CreatePostModal from '../components/CreatePostModal';
import EditPostModal from '../components/EditPostModal';

// Stagger container — children animate in sequence
const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: [0.25, 0.46, 0.45, 0.94] } },
};

// ── Landing hero (unauthenticated) ───────────────────────────────
const LandingHero = () => (
    <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 gap-6"
    >
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white text-2xl font-black">P</span>
        </div>
        <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Ideas worth sharing.
            </h1>
            <p className="mt-3 text-slate-500 text-base max-w-sm mx-auto leading-relaxed">
                A clean space to write, read, and connect with people who think.
            </p>
        </div>
        <div className="flex items-center gap-3">
            <a href="/login" className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">Sign in</a>
            <a href="/register" className="px-5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors">Create account</a>
        </div>
    </motion.div>
);

// ── Main page ─────────────────────────────────────────────────────
const HomePage = () => {
    const { isAuthenticated } = useAuth();
    const { data: posts, isLoading, isError, error, refetch } = useAllPosts(isAuthenticated);

    const [createOpen, setCreateOpen] = useState(false);
    const [editPost, setEditPost] = useState(null); // post object | null

    if (!isAuthenticated) return <LandingHero />;

    return (
        <>
            <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

                {/* Page header */}
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28 }}
                    className="flex items-center justify-between mb-7"
                >
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Home</h1>

                    <button
                        onClick={() => setCreateOpen(true)}
                        className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    >
                        <PenSquare size={13} />
                        Write
                    </button>
                </motion.div>

                {/* ── Loading ── */}
                {isLoading && <LoadingSkeleton count={5} />}

                {/* ── Error ── */}
                {isError && (
                    <ErrorMessage
                        message={error?.response?.data?.message || 'Failed to load posts.'}
                        onRetry={refetch}
                    />
                )}

                {/* ── Empty ── */}
                {!isLoading && !isError && posts?.length === 0 && (
                    <EmptyState
                        title="Nothing here yet"
                        description="The feed is quiet. Be the first to break the silence."
                        action={
                            <button
                                onClick={() => setCreateOpen(true)}
                                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                Write the first post
                            </button>
                        }
                    />
                )}

                {/* ── Post list — staggered, AnimatePresence for exit ── */}
                <AnimatePresence mode="popLayout">
                    {!isLoading && !isError && posts?.length > 0 && (
                        <motion.div
                            variants={listVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col gap-4"
                        >
                            {posts.map((post) => (
                                <motion.div
                                    key={post._id}
                                    variants={itemVariants}
                                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
                                    layout
                                >
                                    <PostCard post={post} onEdit={setEditPost} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Mobile FAB */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.45, type: 'spring', stiffness: 280, damping: 22 }}
                onClick={() => setCreateOpen(true)}
                className="sm:hidden fixed bottom-6 right-6 z-20 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-200 flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label="Create new post"
            >
                <PenSquare size={21} />
            </motion.button>

            {/* Modals */}
            <CreatePostModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
            <EditPostModal post={editPost} onClose={() => setEditPost(null)} />
        </>
    );
};

export default HomePage;
