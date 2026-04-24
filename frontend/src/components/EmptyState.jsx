import { motion } from 'framer-motion';

const EmptyState = ({
    title = 'Nothing here yet',
    description = 'Be the first to share something.',
    action = null,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center py-28 text-center select-none"
        >
            {/* Abstract typographic illustration */}
            <div className="relative mb-8">
                <p
                    className="text-[96px] font-black leading-none tracking-tighter text-slate-100 select-none pointer-events-none"
                    aria-hidden="true"
                >
                    EMPTY
                </p>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center">
                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-slate-400"
                        >
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <line x1="10" y1="9" x2="8" y2="9" />
                        </svg>
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
            <p className="mt-2 text-sm text-slate-400 max-w-[260px] leading-relaxed">{description}</p>
            {action && <div className="mt-6">{action}</div>}
        </motion.div>
    );
};

export default EmptyState;
