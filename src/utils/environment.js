// Environment detection utilities Coded lovingly by @cryptowampum and Claude AI
// Exported so developers can use them if needed

/**
 * Check if the app is running in Unicorn environment
 * @returns {boolean} True if accessed via Unicorn portal
 */
export const isUnicornEnvironment = () => {
  if (typeof window === 'undefined') return false;
  
  const params = new URLSearchParams(window.location.search);
  const walletId = params.get('walletId');
  const authCookie = params.get('authCookie');
  
  return walletId === 'inApp' && !!authCookie;
};

/**
 * Get Unicorn auth cookie from URL
 * @returns {string|null} Auth cookie or null
 */
export const getUnicornAuthCookie = () => {
  if (typeof window === 'undefined') return null;
  
  const params = new URLSearchParams(window.location.search);
  return params.get('authCookie');
};

/**
 * Get chain configuration from environment or parameter
 * @param {string} chainName - Chain name
 * @returns {object} Chain config
 */
export const getChainConfig = (chainName) => {
  // This would import from thirdweb/chains
  // Kept simple for now
  return {
    name: chainName || 'base'
  };
};