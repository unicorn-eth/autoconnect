// UnicornAutoConnect.jsx
// Zero-impact autoconnect component for existing dApps
// Just add this component and everything works!

import React from 'react';
import { useConnect, useAccount } from 'wagmi';

/**
 * UnicornAutoConnect Component
 * 
 * Automatically connects Unicorn wallet when accessed via URL parameters.
 * Requires NO changes to existing dApp code - just add this component!
 * 
 * Usage:
 * ```jsx
 * <WagmiProvider config={config}>
 *   <RainbowKitProvider>
 *     <UnicornAutoConnect />  // <-- Just add this!
 *     <YourApp />            // <-- No changes needed here!
 *   </RainbowKitProvider>
 * </WagmiProvider>
 * ```
 * 
 * @param {Object} props
 * @param {Function} props.onConnect - Optional callback when connected
 * @param {Function} props.onError - Optional callback on error
 * @param {boolean} props.debug - Enable debug logging
 */
const UnicornAutoConnect = ({ 
  onConnect, 
  onError,
  debug = false,
}) => {
  const { connect, connectors } = useConnect();
  const { isConnected, connector } = useAccount();
  const attemptedRef = React.useRef(false);

  React.useEffect(() => {
    // Skip if already attempted
    if (attemptedRef.current) {
      if (debug) console.log('[UnicornAutoConnect] Already attempted');
      return;
    }

    // Skip if already connected to Unicorn
    if (isConnected && connector?.id === 'unicorn') {
      if (debug) console.log('[UnicornAutoConnect] Already connected to Unicorn');
      attemptedRef.current = true;
      return;
    }

    // Check for Unicorn URL parameters
    console.log('Looking for URL  Params',window.location.search);
    const isUnicornUrl = () => {
      if (typeof window === 'undefined') return false;
      const params = new URLSearchParams(window.location.search);
      const walletId = params.get('walletId');
      const authCookie = params.get('authCookie');

      console.debug('found args');
      return walletId === 'inApp' && !!authCookie;
    };

    // Not a Unicorn URL - skip silently
    if (!isUnicornUrl()) {
      if (debug) console.log('[UnicornAutoConnect] Not a Unicorn URL');
      attemptedRef.current = true;
      console.debug('no connection args');
      return;
    }

    // We're in Unicorn mode - attempt autoconnect
    if (debug) {
      console.log('[UnicornAutoConnect] Unicorn URL detected, attempting autoconnect...');
    }

    const autoConnect = async () => {
      try {
        // Find the Unicorn connector
        const unicornConnector = connectors.find(c => c.id === 'unicorn');
        
        if (!unicornConnector) {
          throw new Error(
            'Unicorn connector not found. ' +
            'Make sure unicornConnector() is added to your wagmi config.'
          );
        }

        if (debug) {
          console.log('[UnicornAutoConnect] Connecting via wagmi...');
        }

        // Connect through wagmi - this updates all wagmi state
        await connect({ connector: unicornConnector });

        if (debug) {
          console.log('[UnicornAutoConnect] ✅ Connected! All wagmi hooks should now work.');
        }

        // Optional: Call onConnect callback
        if (onConnect) {
          try {
            const provider = await unicornConnector.getProvider?.();
            onConnect(provider);
          } catch (err) {
            console.warn('[UnicornAutoConnect] Error in onConnect callback:', err);
          }
        }

        attemptedRef.current = true;

      } catch (error) {
        console.error('[UnicornAutoConnect] Autoconnect failed:', error);
        
        if (onError) {
          onError(error);
        }

        attemptedRef.current = true;
      }
    };

    // Small delay to ensure wagmi is ready
    const timer = setTimeout(autoConnect, 100);

    return () => clearTimeout(timer);

  }, [connect, connectors, isConnected, connector, onConnect, onError, debug]);

  // This component doesn't render anything
  return null;
};

export default UnicornAutoConnect;