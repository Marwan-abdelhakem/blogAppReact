import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreatePost } from '../hooks/usePosts';

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 16 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 28 } },
    exit: { opacity: 0, scale: 0.95, y: 16, transition: { duration: 0.18 } },
};

const CreatePostModal = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({ title: '', content: '', coverImage: '' });
    const titleRef = useRef(null);
    const { mutate, isPending } = useCreatePost();

    // Auto-focus title when modal opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => titleRef.current?.focus(), 80);
        } else {
            setForm({ title: '', content: '', coverImage: '' });
        }
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            title: form.title.trim(),
            content: form.content.trim(),
            ...(form.coverImage.trim() && { coverImage: form.coverImage.trim() }),
        };

        mutate(payload, {
            onSuccess: () => {
                toast.success('Post published successfully!');
                onClose();
            },
            onError: (err) => {
                const msg = err.response?.data?.message || 'Failed to create post. Try again.';
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
                        key="backdrop"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            key="modal"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="modal-title"
                            className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <h2 id="modal-title" className="text-base font-semibold text-gray-900">
                                    New Post
                                </h2>
                                <button
                                    onClick={onClose}
                                    disabled={isPending}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-40"
                                    aria-label="Close modal"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
                                {/* Title */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="post-title" className="text-sm font-medium text-gray-700">
                                        Title <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        ref={titleRef}
                                        id="post-title"
                                        name="title"
                                        type="text"
                                        required
                                        minLength={3}
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="Give your post a title…"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="post-content" className="text-sm font-medium text-gray-700">
                                        Content <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        id="post-content"
                                        name="content"
                                        required
                                        rows={5}
                                        value={form.content}
                                        onChange={handleChange}
                                        placeholder="Write something worth reading…"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition resize-none"
                                    />
                                </div>

                                {/* Cover Image URL (optional) */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="post-cover" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                        <ImageIcon size={14} className="text-gray-400" />
                                        Cover Image URL
                                        <span className="text-gray-400 font-normal">(optional)</span>
                                    </label>
                                    <input
                                        id="post-cover"
                                        name="coverImage"
                                        type="url"
                                        value={form.coverImage}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3 pt-1">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={isPending}
                                        className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPending || !form.title.trim() || !form.content.trim()}
                                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isPending && <Loader2 size={14} className="animate-spin" />}
                                        {isPending ? 'Publishing…' : 'Publish'}
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

export default CreatePostModal;
