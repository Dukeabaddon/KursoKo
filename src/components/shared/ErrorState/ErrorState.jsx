/**
 * ErrorState Component
 * Displays user-friendly error messages with recovery options
 * 
 * @param {string} title - Error title
 * @param {string} message - Error description
 * @param {function} onRetry - Retry callback
 * @param {function} onHome - Go home callback
 */
const ErrorState = ({ 
  title = 'Hindi ma-load ang page',
  message = 'May problema sa pagload ng page. Subukan ulit.',
  onRetry,
  onHome 
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg 
            className="w-10 h-10 text-red-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>

        {/* Error Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h2>

        {/* Error Message */}
        <p className="text-gray-600 mb-8">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="Try again"
            >
              Subukan Ulit
            </button>
          )}
          
          {onHome && (
            <button
              onClick={onHome}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              aria-label="Go back to homepage"
            >
              Bumalik sa Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
