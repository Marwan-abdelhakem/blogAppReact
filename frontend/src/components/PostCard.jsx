import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDeletePost } from '../hooks/usePosts';
import { useAuth } from '../context/AuthContext';

// Deterministic avatar accent derived from the first char of the username
const ACCENT_COLORS = [
    { bg: 'bg-blue-100', text: 'text-blue-700' },
    { bg: 'bg-violet-100', text: 'text-violet-700' },
    { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    { bg: 'bg-amber-100', text: 'text-amber-700' },
    { bg: 'bg-rose-100', text: 'text-rose-700' },
    { bg: 'bg-cyan-100', text: 'text-cyan-700' },
];

const getAccent = (name = '') =>
    ACCENT_COLORS[name.charCodeAt(0) % ACCENT_COLORS.length];

/**
 * PostCard
 *
 * Props:
 *   post   — post object (title, content, coverImage, author, createdAt)
 *   onEdit — (post) => void — called when the owner clicks Edit
 *
 * Content is NEVER truncated or hidden. The card expands to its full
 * natural height regardless of how long the text is.
 */
const PostCard = ({ post, onEdit }) => {
    const { user } = useAuth();
    const { mutate: deleteMutate, isPending: isDeleting } = useDeletePost();

    const [menuOpen, setMenuOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const authorName = post.author?.user_name || 'Unknown';
    const authorId = post.author?._id;
    const isOwner = Boolean(user?._id && authorId && user._id === authorId);
    const accent = getAccent(authorName);

    const formattedDate = post.createdAt
        ? new Date(post.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        })
        : null;

    // ── Handlers ────────────────────────────────────────────────────
    const handleEditClick = () => {
        setMenuOpen(false);
        onEdit?.(post);
    };

    const handleDeleteClick = () => {
        setMenuOpen(false);
        setConfirmDelete(true);
    };

    const handleDeleteConfirm = () => {
        setConfirmDelete(false);
        deleteMutate(post._id, {
            onSuccess: () => toast.success('Post deleted.'),
            onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete post.'),
        });
    };

    // ── Render ───────────────────────────────────────────────────────
    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
            whileHover={{ y: -2, boxShadow: '0 6px 24px rgba(0,0,0,0.07)' }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="group relative bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden"
        >
            {/* ── Cover image ─────────────────────────────────────────── */}
            {post.coverImage && (
                <div className="w-full h-52 overflow-hidden bg-slate-100">
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
                    />
                </div>
            )}

            <div className="p-5">
                {/* ── Header: author avatar + name + date + owner menu ──── */}
                <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                        {/* Avatar */}
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase shrink-0 ${accent.bg} ${accent.text}`}
                        >
                            {authorName.charAt(0)}
                        </div>

                        {/* Name + date stacked */}
                        <div className="min-w-0">
                            {authorId ? (
                                <Link
                                    to={`/profile/${authorId}`}
                                    className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors leading-none truncate block"
                                >
                                    {authorName}
                                </Link>
                            ) : (
                                <span className="text-sm font-semibold text-slate-800 leading-none truncate block">
                                    {authorName}
                                </span>
                            )}
                            {formattedDate && (
                                <span className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                                    <Calendar size={10} />
                                    {formattedDate}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* ⋯ menu — visible only to the post owner */}
                    {isOwner && (
                        <div className="relative shrink-0">
                            <button
                                onClick={() => setMenuOpen((v) => !v)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                aria-label="Post options"
                                aria-expanded={menuOpen}
                            >
                                <MoreHorizontal size={16} />
                            </button>

                            <AnimatePresence>
                                {menuOpen && (
                                    <>
                                        {/* Click-away backdrop */}
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setMenuOpen(false)}
                                            aria-hidden="true"
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.92, y: -4 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.92, y: -4 }}
                                            transition={{ duration: 0.12 }}
                                            className="absolute right-0 top-9 z-20 w-36 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden py-1"
                                        >
                                            <button
                                                onClick={handleEditClick}
                                                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                            >
                                                <Pencil size={13} className="text-slate-400" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={handleDeleteClick}
                                                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 size={13} className="text-red-400" />
                                                Delete
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* ── Title ───────────────────────────────────────────────── */}
                <h2 className="text-[15px] font-bold text-slate-900 leading-snug tracking-tight mb-2">
                    {post.title}
                </h2>

                {/* ── Content — full height, no truncation, no toggling ──── */}
                <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-wrap break-words">
                    {post.content}
                </p>
            </div>

            {/* ── Delete confirmation bar ──────────────────────────────── */}
            <AnimatePresence>
                {confirmDelete && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-red-100 bg-red-50"
                    >
                        <div className="flex items-center justify-between px-5 py-3 gap-3">
                            <p className="text-xs text-red-700 font-medium">
                                Delete this post? This can't be undone.
                            </p>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => setConfirmDelete(false)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    disabled={isDeleting}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-60"
                                >
                                    {isDeleting ? 'Deleting…' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.article>
    );
};

export default PostCard;
