/**
 * LoadingSpinner Component
 * Displays animated loading indicator with Filipino-friendly message
 * 
 * @param {string} message - Optional loading message
 * @param {string} size - Spinner size: 'sm' | 'md' | 'lg'
 */
const LoadingSpinner = ({ 
  message = 'Sandali lang...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-16 h-16 border-4',
    lg: 'w-24 h-24 border-4'
  };

  const containerClasses = {
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12'
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center ${containerClasses[size]}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* Spinner */}
      <div 
        className={`
          ${sizeClasses[size]}
          border-primary-200 
          border-t-primary-600 
          rounded-full 
          animate-spin
        `}
        aria-hidden="true"
      />
      
      {/* Loading Message */}
      {message && (
        <p className="mt-4 text-gray-600 font-medium text-center">
          {message}
        </p>
      )}

      {/* Screen Reader Text */}
      <span className="sr-only">Loading, please wait</span>
    </div>
  );
};

export default LoadingSpinner;
