// Example: Using standard wagmi hooks with Unicorn wallet
// ALL of these hooks now "just work" with Unicorn!

import { 
  useAccount, 
  useSignMessage, 
  useWriteContract,
  useSendTransaction,
  useConnect,
  useDisconnect 
} from 'wagmi';

// ✅ EXAMPLE 1: Basic wallet info (NOW WORKS!)
export function WalletInfo() {
  const { address, connector, isConnected, chain } = useAccount();

  return (
    <div>
      <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
      <p>Address: {address}</p>
      <p>Connector: {connector?.name}</p> {/* Shows "Unicorn Wallet" */}
      <p>Chain: {chain?.name}</p>
    </div>
  );
}

// ✅ EXAMPLE 2: Sign messages (NOW WORKS!)
export function SignMessageButton() {
  const { signMessageAsync } = useSignMessage();

  const handleSign = async () => {
    try {
      const signature = await signMessageAsync({ 
        message: 'Hello from Unicorn!' 
      });
      console.log('Signature:', signature);
    } catch (error) {
      console.error('Sign failed:', error);
    }
  };

  return <button onClick={handleSign}>Sign Message</button>;
}

// ✅ EXAMPLE 3: Write to contracts (NOW WORKS!)
export function MintNFT() {
  const { writeContractAsync } = useWriteContract();

  const handleMint = async () => {
    try {
      const tx = await writeContractAsync({
        address: '0x123...',
        abi: [...],
        functionName: 'mint',
        args: [1],
      });
      console.log('Transaction:', tx);
    } catch (error) {
      console.error('Mint failed:', error);
    }
  };

  return <button onClick={handleMint}>Mint NFT</button>;
}

// ✅ EXAMPLE 4: Send transactions (NOW WORKS!)
export function SendETH() {
  const { sendTransactionAsync } = useSendTransaction();

  const handleSend = async () => {
    try {
      const tx = await sendTransactionAsync({
        to: '0x456...',
        value: '1000000000000000', // 0.001 ETH
      });
      console.log('Transaction:', tx);
    } catch (error) {
      console.error('Send failed:', error);
    }
  };

  return <button onClick={handleSend}>Send ETH</button>;
}

// ✅ EXAMPLE 5: Connect/Disconnect (NOW WORKS!)
export function ConnectButtons() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();

  return (
    <div>
      {!isConnected ? (
        connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            Connect {connector.name}
          </button>
        ))
      ) : (
        <button onClick={() => disconnect()}>Disconnect</button>
      )}
    </div>
  );
}

// ✅ EXAMPLE 6: RainbowKit Integration (NOW WORKS!)
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Header() {
  return (
    <header>
      <h1>My dApp</h1>
      {/* This button now shows Unicorn connections! */}
      <ConnectButton />
    </header>
  );
}

// ✅ EXAMPLE 7: Advanced - Contract interactions
import { useContractRead, useContractWrite } from 'wagmi';

export function TokenBalance() {
  const { address } = useAccount();
  
  // Read from contract (NOW WORKS!)
  const { data: balance } = useContractRead({
    address: '0x789...',
    abi: [...],
    functionName: 'balanceOf',
    args: [address],
  });

  // Write to contract (NOW WORKS!)
  const { write: transfer } = useContractWrite({
    address: '0x789...',
    abi: [...],
    functionName: 'transfer',
  });

  const handleTransfer = () => {
    transfer({
      args: ['0xabc...', 1000],
    });
  };

  return (
    <div>
      <p>Balance: {balance?.toString()}</p>
      <button onClick={handleTransfer}>Transfer</button>
    </div>
  );
}

// ✅ EXAMPLE 8: The OLD broken way (NO LONGER NEEDED!)
/*
// ❌ DON'T DO THIS ANYMORE:
const { isConnected, address } = useUniversalWallet(); // Custom hook
const { sendTransaction } = useUnicornTransaction(); // Custom hook
const { signMessage } = useUnicornSignMessage(); // Custom hook

// ✅ DO THIS INSTEAD:
const { isConnected, address } = useAccount(); // Standard wagmi
const { sendTransactionAsync } = useSendTransaction(); // Standard wagmi
const { signMessageAsync } = useSignMessage(); // Standard wagmi
*/