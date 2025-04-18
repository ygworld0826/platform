import { NFTContractInfo } from '../types/nft';

// Declare the ethereum property on the window object for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

const CONTRACTS_STORAGE_KEY = 'nft_contracts';

// Save NFT Contract Information
export const saveNFTContract = (contract: NFTContractInfo): void => {
  const contracts = getNFTContracts();
  
  // Check if contract with same address already exists
  const existingIndex = contracts.findIndex(c => c.address === contract.address);
  
  if (existingIndex >= 0) {
    // Update existing contract
    contracts[existingIndex] = contract;
  } else {
    // Add new contract
    contracts.push(contract);
  }
  
  localStorage.setItem(CONTRACTS_STORAGE_KEY, JSON.stringify(contracts));
};

// Get all NFT Contracts
export const getNFTContracts = (): NFTContractInfo[] => {
  const contractsStr = localStorage.getItem(CONTRACTS_STORAGE_KEY);
  return contractsStr ? JSON.parse(contractsStr) : [];
};

// Get NFT Contract by address
export const getNFTContractByAddress = (address: string): NFTContractInfo | undefined => {
  const contracts = getNFTContracts();
  return contracts.find(contract => contract.address.toLowerCase() === address.toLowerCase());
};

// Delete NFT Contract
export const deleteNFTContract = (address: string): void => {
  const contracts = getNFTContracts();
  const filteredContracts = contracts.filter(contract => 
    contract.address.toLowerCase() !== address.toLowerCase()
  );
  localStorage.setItem(CONTRACTS_STORAGE_KEY, JSON.stringify(filteredContracts));
};

/**
 * Check if MetaMask is installed
 */
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && !!window.ethereum;
};

/**
 * Connect to Web3 Provider (MetaMask)
 */
export const connectWallet = async (): Promise<string[]> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to use this feature.');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts as string[];
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
    throw error;
  }
};

/**
 * Get connected wallet address
 */
export const getConnectedAddress = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled()) {
    return null;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error('Error getting connected address:', error);
    return null;
  }
};

/**
 * Get current network
 */
export const getCurrentNetwork = async (): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    
    // Convert chainId to network name
    switch (chainId) {
      case '0x1':
        return 'Ethereum Mainnet';
      case '0x5':
        return 'Goerli Testnet';
      case '0xaa36a7':
        return 'Sepolia Testnet';
      case '0x89':
        return 'Polygon Mainnet';
      case '0x13881':
        return 'Kairos Testnet';
      default:
        return `Chain ID: ${chainId}`;
    }
  } catch (error) {
    console.error('Error getting current network:', error);
    throw error;
  }
};

/**
 * Mint NFT using contract ABI
 */
export const mintNFT = async (
  contractAddress: string,
  abi: any[],
  tokenURI: string,
  toAddress: string
): Promise<{ success: boolean; txHash?: string; error?: string }> => {
  if (!isMetaMaskInstalled()) {
    return { success: false, error: 'MetaMask is not installed' };
  }

  try {
    // Dynamically import ethers to avoid issues with SSR
    const { ethers } = await import('ethers');
    
    // Create Web3Provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    // Get the signer (current user's account)
    const signer = provider.getSigner();
    
    // Create a contract instance
    const contract = new ethers.Contract(contractAddress, abi, signer);
    
    // Call mint function - adjust this based on your contract's actual function
    // Most NFT contracts use one of these patterns:
    let tx;
    
    // Try different minting patterns based on the contract
    try {
      // Pattern 1: mint(to, tokenURI)
      tx = await contract.mint(toAddress, tokenURI);
    } catch (error) {
      try {
        // Pattern 2: safeMint(to, tokenURI)
        tx = await contract.safeMint(toAddress, tokenURI);
      } catch (innerError) {
        try {
          // Pattern 3: mintNFT(to, tokenURI)
          tx = await contract.mintNFT(toAddress, tokenURI);
        } catch (deepError) {
          // If all patterns fail, try just calling 'mint' with only the tokenURI
          // This is common for contracts where msg.sender is the recipient
          tx = await contract.mint(tokenURI);
        }
      }
    }
    
    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    
    return {
      success: true,
      txHash: receipt.transactionHash
    };
  } catch (error) {
    console.error('Error minting NFT:', error);
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message
      };
    }
    
    return {
      success: false,
      error: 'Unknown error occurred while minting NFT'
    };
  }
};