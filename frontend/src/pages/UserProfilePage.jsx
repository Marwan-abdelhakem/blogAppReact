import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, FileText } from 'lucide-react';
import { useUserPosts } from '../hooks/usePosts';
import { useUser } from '../hooks/useUser';
import PostCard from '../components/PostCard';
import EditPostModal from '../components/EditPostModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const ACCENT_COLORS = [
    'bg-blue-100 text-blue-700',
    'bg-violet-100 text-violet-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
    'bg-cyan-100 text-cyan-700',
];

const UserProfilePage = () => {
    const { userId } = useParams();
    const [editPost, setEditPost] = useState(null);

    const { data: user, isLoading: userLoading, isError: userError } = useUser(userId);
    const { data: posts, isLoading: postsLoading, isError: postsError, error, refetch } = useUserPosts(userId);

    const isLoading = userLoading || postsLoading;
    const userName = user?.user_name || '?';
    const avatarClass = ACCENT_COLORS[userName.charCodeAt(0) % ACCENT_COLORS.length];

    return (
        <>
            <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

                {/* Back */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-8 group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                    Back to Home
                </Link>

                {/* Profile card */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="bg-white rounded-xl border border-slate-200/50 shadow-sm p-6 mb-8"
                >
                    {userLoading ? (
                        <div className="flex items-center gap-4">
                            <div className="skeleton w-14 h-14 rounded-full shrink-0" />
                            <div className="flex flex-col gap-2 flex-1">
                                <div className="skeleton h-5 w-32 rounded" />
                                <div className="skeleton h-3 w-48 rounded" />
                            </div>
                        </div>
                    ) : userError ? (
                        <p className="text-slate-400 text-sm">Profile unavailable.</p>
                    ) : (
                        <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-black uppercase shrink-0 ${avatarClass}`}>
                                {userName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                                    {user?.user_name || 'Unknown User'}
                                </h1>
                                {user?.bio && (
                                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{user.bio}</p>
                                )}
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                    {user?.email && (
                                        <span className="flex items-center gap-1 text-xs text-slate-400">
                                            <Mail size={11} />
                                            {user.email}
                                        </span>
                                    )}
                                    {!postsLoading && (
                                        <span className="flex items-center gap-1 text-xs text-slate-400">
                                            <FileText size={11} />
                                            {posts?.length ?? 0} post{posts?.length !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Section label */}
                {!isLoading && posts?.length > 0 && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4"
                    >
                        Posts
                    </motion.p>
                )}

                {isLoading && <LoadingSkeleton count={3} />}

                {postsError && (
                    <ErrorMessage
                        message={error?.response?.data?.message || 'Failed to load posts.'}
                        onRetry={refetch}
                    />
                )}

                {!isLoading && !postsError && posts?.length === 0 && (
                    <EmptyState
                        title="No posts yet"
                        description="This user hasn't published anything yet."
                    />
                )}

                <AnimatePresence mode="popLayout">
                    {!isLoading && !postsError && posts?.length > 0 && (
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

            <EditPostModal post={editPost} onClose={() => setEditPost(null)} />
        </>
    );
};

export default UserProfilePage;
