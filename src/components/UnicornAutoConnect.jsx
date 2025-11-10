// UnicornAutoConnect.jsx
// Zero-impact autoconnect component for existing dApps
// Just add this component and everything works!

import React from 'react';
import { useConnect, useAccount, useConfig } from 'wagmi';

/**
 * UnicornAutoConnect Component
 *
 * Automatically connects Unicorn wallet when accessed via URL parameters.
 * Requires NO changes to existing dApp code - just add this component!
 * Now includes automatic wagmi state sync for RainbowKit compatibility!
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
 * Features:
 * - Detects Unicorn URL parameters (?walletId=inApp&authCookie=...)
 * - Automatically connects via wagmi's connectAsync()
 * - Manually syncs wagmi state if needed (RainbowKit compatibility)
 * - Works with both basic wagmi and RainbowKit setups
 * - Zero configuration required
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
  const { connectAsync, connectors } = useConnect();
  const { isConnected, connector, address } = useAccount();
  const config = useConfig();
  const attemptedRef = React.useRef(false);

  // Monitor when account state changes after connection
  React.useEffect(() => {
    if (isConnected && connector?.id === 'unicorn' && address) {
      if (debug) {
        console.log('[UnicornAutoConnect] ✅ Wagmi state confirmed:', { address: address.slice(0, 10), connector: connector.id });
      }
    }
  }, [isConnected, connector, address, debug]);

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
  
    const isUnicornUrl = () => {
      if (typeof window === 'undefined') return false;
      const params = new URLSearchParams(window.location.search);
      const walletId = params.get('walletId');
      const authCookie = params.get('authCookie');

      if (debug) console.log('[UnicornAutoConnect] Checking URL params:', { walletId, authCookie: !!authCookie });
      return walletId === 'inApp' && !!authCookie;
    };

    // Not a Unicorn URL - skip silently
    if (!isUnicornUrl()) {
      if (debug) console.log('[UnicornAutoConnect] Not a Unicorn URL');
      attemptedRef.current = true;
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
          console.log('[UnicornAutoConnect] Found Unicorn connector:', unicornConnector);
          console.log('[UnicornAutoConnect] Connector ready:', unicornConnector.ready);
        }

        // Get chainId from wagmi config (first chain)
        const chainId = config.chains[0]?.id;

        if (debug) {
          console.log('[UnicornAutoConnect] Using chainId:', chainId);
          console.log('[UnicornAutoConnect] Connecting via wagmi...');
        }

        // Connect through wagmi using connectAsync for proper promise handling
        const connectResult = await connectAsync({
          connector: unicornConnector,
          chainId: chainId
        });

        if (debug) {
          console.log('[UnicornAutoConnect] ✅ Connect result from wagmi:', connectResult);
          console.log('[UnicornAutoConnect] ✅ Connect call completed');
        }

        // CRITICAL FIX: Wait for wagmi's internal state to propagate
        // Wagmi uses React state updates which are async and batched
        await new Promise(resolve => setTimeout(resolve, 100));

        if (debug) {
          console.log('[UnicornAutoConnect] ✅ Wagmi state propagation complete');
        }

        // ENHANCED: Manual wagmi state sync for RainbowKit compatibility
        // Check if wagmi state properly synced, if not, manually sync it
        const currentState = config.getState();
        const isProperlyConnected = currentState.status === 'connected' &&
                                   currentState.current === unicornConnector.uid;

        if (!isProperlyConnected) {
          if (debug) {
            console.log('[UnicornAutoConnect] Wagmi state not fully synced, manually syncing...');
          }

          try {
            // Get the provider and account info
            const provider = await unicornConnector.getProvider?.();
            if (provider) {
              const account = await provider.getAccount?.();

              if (account?.address) {
                const accountChainId = account.chain?.id || chainId;

                if (debug) {
                  console.log('[UnicornAutoConnect] Manually updating wagmi state:', {
                    address: account.address,
                    chainId: accountChainId
                  });
                }

                // Manually update wagmi's internal state
                await config.setState((state) => {
                  const newConnections = new Map(state.connections);
                  newConnections.set(unicornConnector.uid, {
                    accounts: [account.address],
                    chainId: accountChainId,
                    connector: unicornConnector,
                  });

                  return {
                    ...state,
                    connections: newConnections,
                    current: unicornConnector.uid,
                    status: 'connected',
                  };
                });

                if (debug) {
                  console.log('[UnicornAutoConnect] ✅ Manual wagmi state sync complete');
                }

                // Wait for React to propagate the manual state update
                await new Promise(resolve => setTimeout(resolve, 100));
              }
            }
          } catch (err) {
            console.warn('[UnicornAutoConnect] Manual state sync failed, connection may still work:', err);
          }
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

    // Small delay to ensure wagmi providers are ready
    const timer = setTimeout(autoConnect, 100);

    return () => clearTimeout(timer);

  }, [connectAsync, connectors, isConnected, connector, onConnect, onError, debug, config]);

  // This component doesn't render anything
  return null;
};

export default UnicornAutoConnect;