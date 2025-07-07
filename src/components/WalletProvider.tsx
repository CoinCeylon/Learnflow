import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
  walletName: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

interface WalletProviderProps {
  children: ReactNode;
}

// Declare cardano object for TypeScript
declare global {
  interface Window {
    cardano?: {
      [key: string]: {
        enable: () => Promise<any>;
        isEnabled: () => Promise<boolean>;
        apiVersion: string;
        name: string;
        icon: string;
      };
    };
  }
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing wallet connection on mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      const savedWallet = localStorage.getItem('connectedWallet');
      const savedAddress = localStorage.getItem('walletAddress');
      
      if (savedWallet && savedAddress && window.cardano?.[savedWallet]) {
        try {
          const isEnabled = await window.cardano[savedWallet].isEnabled();
          if (isEnabled) {
            setIsConnected(true);
            setWalletAddress(savedAddress);
            setWalletName(savedWallet);
          } else {
            // Clear saved data if wallet is no longer enabled
            localStorage.removeItem('connectedWallet');
            localStorage.removeItem('walletAddress');
          }
        } catch (error) {
          console.error('Error checking existing wallet connection:', error);
          localStorage.removeItem('connectedWallet');
          localStorage.removeItem('walletAddress');
        }
      }
    };

    checkExistingConnection();
  }, []);

  const getAvailableWallets = () => {
    if (!window.cardano) return [];
    
    const commonWallets = ['nami', 'eternl', 'flint', 'typhon', 'lace', 'yoroi'];
    const availableWallets = [];
    
    for (const walletKey of commonWallets) {
      if (window.cardano[walletKey]) {
        availableWallets.push({
          key: walletKey,
          ...window.cardano[walletKey],
          name: window.cardano[walletKey].name || walletKey
        });
      }
    }
    
    // Add any other wallets not in the common list
    for (const walletKey in window.cardano) {
      if (!commonWallets.includes(walletKey) && typeof window.cardano[walletKey].enable === 'function') {
        availableWallets.push({
          key: walletKey,
          ...window.cardano[walletKey],
          name: window.cardano[walletKey].name || walletKey
        });
      }
    }
    
    return availableWallets;
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const availableWallets = getAvailableWallets();
      
      if (availableWallets.length === 0) {
        throw new Error('No Cardano wallets found. Please install a Cardano wallet like Lace, Nami, or Eternl.');
      }

      // Try to connect to the first available wallet
      // In a production app, you might want to show a wallet selection modal
      const wallet = availableWallets[0];
      
      console.log(`Attempting to connect to ${wallet.name}...`);
      
      const api = await wallet.enable();
      
      // Get wallet address
      const addresses = await api.getUsedAddresses();
      let address = null;
      
      if (addresses && addresses.length > 0) {
        // Use the first used address
        address = addresses[0];
      } else {
        // If no used addresses, get unused addresses
        const unusedAddresses = await api.getUnusedAddresses();
        if (unusedAddresses && unusedAddresses.length > 0) {
          address = unusedAddresses[0];
        }
      }
      
      if (!address) {
        throw new Error('Could not retrieve wallet address');
      }

      // Convert hex address to bech32 if needed
      let bech32Address = address;
      if (address.startsWith('01') || address.startsWith('00')) {
        // This is a hex address, we'll use it as is for now
        // In a production app, you'd want to convert it to bech32
        bech32Address = address;
      }
      
      setWalletAddress(bech32Address);
      setWalletName(wallet.name);
      setIsConnected(true);
      
      // Save connection info to localStorage
      localStorage.setItem('connectedWallet', wallet.key);
      localStorage.setItem('walletAddress', bech32Address);
      
      console.log(`Successfully connected to ${wallet.name}`);
      console.log('Address:', bech32Address);
      
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      
      // Provide user-friendly error messages
      let errorMessage = "Failed to connect wallet";
      if (error instanceof Error) {
        if (error.message.includes('No Cardano wallets found')) {
          errorMessage = error.message;
        } else if (error.message.includes('User declined')) {
          errorMessage = "Wallet connection was declined";
        } else if (error.message.includes('Already processing')) {
          errorMessage = "Wallet is already processing a request";
        }
      }
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress(null);
    setWalletName(null);
    
    // Clear saved connection info
    localStorage.removeItem('connectedWallet');
    localStorage.removeItem('walletAddress');
    
    console.log('Wallet disconnected');
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        walletName,
        connectWallet,
        disconnectWallet,
        isLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
