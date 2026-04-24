import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUpdatePost } from '../hooks/usePosts';

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 14 },
    visible: {
        opacity: 1, scale: 1, y: 0,
        transition: { type: 'spring', stiffness: 340, damping: 30 },
    },
    exit: { opacity: 0, scale: 0.96, y: 14, transition: { duration: 0.16 } },
};

/**
 * EditPostModal
 * Props:
 *   post   — the post object to edit (null = closed)
 *   onClose — callback to close the modal
 */
const EditPostModal = ({ post, onClose }) => {
    const isOpen = Boolean(post);
    const titleRef = useRef(null);
    const { mutate, isPending } = useUpdatePost();

    const [form, setForm] = useState({ title: '', content: '', coverImage: '' });

    // Sync form when a post is passed in
    useEffect(() => {
        if (post) {
            setForm({
                title: post.title ?? '',
                content: post.content ?? '',
                coverImage: post.coverImage ?? '',
            });
            setTimeout(() => titleRef.current?.focus(), 80);
        }
    }, [post]);

    // Escape to close
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            id: post._id,
            title: form.title.trim(),
            content: form.content.trim(),
            coverImage: form.coverImage.trim() || undefined,
        };

        mutate(payload, {
            onSuccess: () => {
                toast.success('Post updated!');
                onClose();
            },
            onError: (err) => {
                const msg = err.response?.data?.message || 'Failed to update post.';
                toast.error(msg);
            },
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="edit-backdrop"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.18 }}
                        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            key="edit-modal"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="edit-modal-title"
                            className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                                <h2 id="edit-modal-title" className="text-sm font-semibold text-slate-900">
                                    Edit Post
                                </h2>
                                <button
                                    onClick={onClose}
                                    disabled={isPending}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-40"
                                    aria-label="Close"
                                >
                                    <X size={17} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
                                {/* Title */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="edit-title" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        Title <span className="text-red-400 normal-case font-normal">*</span>
                                    </label>
                                    <input
                                        ref={titleRef}
                                        id="edit-title"
                                        name="title"
                                        type="text"
                                        required
                                        minLength={3}
                                        value={form.title}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="edit-content" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        Content <span className="text-red-400 normal-case font-normal">*</span>
                                    </label>
                                    <textarea
                                        id="edit-content"
                                        name="content"
                                        required
                                        rows={6}
                                        value={form.content}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition resize-none"
                                    />
                                </div>

                                {/* Cover Image */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="edit-cover" className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                                        <ImageIcon size={12} />
                                        Cover Image URL
                                        <span className="normal-case font-normal text-slate-400">(optional)</span>
                                    </label>
                                    <input
                                        id="edit-cover"
                                        name="coverImage"
                                        type="url"
                                        value={form.coverImage}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={isPending}
                                        className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPending || !form.title.trim() || !form.content.trim()}
                                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isPending && <Loader2 size={13} className="animate-spin" />}
                                        {isPending ? 'Saving…' : 'Save changes'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default EditPostModal;
