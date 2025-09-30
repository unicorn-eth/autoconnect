// coded lovingly by @cryptowampum and Claude AI
// @unicorn/autoconnect - Main export file
export { default as UnicornAutoConnect } from './components/UnicornAutoConnect';
export { useUniversalWallet } from './hooks/useUniversalWallet';
export { 
  isUnicornEnvironment,
  getUnicornAuthCookie,
  getChainConfig 
} from './utils/environment';