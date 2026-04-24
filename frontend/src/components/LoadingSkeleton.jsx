import { motion } from 'framer-motion';

const SkeletonCard = ({ delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay, ease: 'easeOut' }}
        className="bg-white rounded-xl border border-slate-200/50 shadow-sm p-5 flex flex-col gap-3"
    >
        <div className="skeleton h-5 w-2/3 rounded-lg" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-5/6 rounded" />
        <div className="skeleton h-3 w-4/6 rounded" />
        <div className="flex items-center gap-2 pt-3 mt-auto border-t border-slate-100">
            <div className="skeleton w-7 h-7 rounded-full shrink-0" />
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-3 w-16 rounded ml-auto" />
        </div>
    </motion.div>
);

const LoadingSkeleton = ({ count = 5 }) => {
    return (
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} delay={i * 0.06} />
            ))}
        </div>
    );
};

export default LoadingSkeleton;
