/**
 * Reusable error state component.
 */
const ErrorMessage = ({ message = 'Something went wrong. Please try again.', onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="text-5xl">⚠️</div>
            <p className="text-gray-500 text-sm max-w-xs">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-2 px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                    Try again
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;
