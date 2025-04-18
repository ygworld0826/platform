import React, { useState } from 'react';
import { ethers } from 'ethers';
import { MyNFTAbi } from '../abis/MyNFTabi';

interface NFTMinterProps {
  tokenURI: string;
  onMinted?: (contractAddress: string, tokenId: number) => void;
}

interface TransferEvent {
  event: string;
  args?: {
    tokenId: {
      toNumber: () => number;
    };
    [key: string]: any;
  };
  [key: string]: any;
}

const NFTMinter: React.FC<NFTMinterProps> = ({ tokenURI, onMinted }) => {
  const [contractAddress, setContractAddress] = useState('');
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mintedTokenId, setMintedTokenId] = useState<number | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [network, setNetwork] = useState('');

  // Get the current network from connected wallet
  const detectNetwork = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        console.log("Connected to network:", network);
        
        // Set network name for explorer
        if (network.name === 'kovan') {
          setNetwork('kovan');
        } else if (network.name === 'ropsten') {
          setNetwork('ropsten');
        } else if (network.name === 'rinkeby') {
          setNetwork('rinkeby');
        } else if (network.name === 'goerli') {
          setNetwork('goerli');
        } else if (network.name === 'sepolia') {
          setNetwork('sepolia');
        } else if (network.chainId === 80001) {
          setNetwork('mumbai');
        } else if (network.chainId === 137) {
          setNetwork('polygon');
        } else if (network.chainId === 5780) {
          setNetwork('kairos');
        } else {
          setNetwork(network.name);
        }
      } catch (error) {
        console.error("Error detecting network:", error);
      }
    }
  };

  const mint = async () => {
    if (!contractAddress) {
      setError('Please enter a contract address');
      return;
    }
    
    if (!tokenURI) {
      setError('No token URI provided');
      return;
    }

    setMinting(true);
    setError(null);
    
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not detected. Please install MetaMask.');
      }

      await detectNetwork();
      
      // Request access to the user's accounts
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create a provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Create contract instance
      const nftContract = new ethers.Contract(contractAddress, MyNFTAbi, signer);
      
      // Mint the NFT
      console.log(`Minting NFT with URI: ${tokenURI}`);
      const transaction = await nftContract.mint(await signer.getAddress(), tokenURI);
      
      // Wait for the transaction to be mined
      const receipt = await transaction.wait();
      console.log('Transaction receipt:', receipt);
      
      // Store transaction hash for explorer link
      setTxHash(receipt.transactionHash);
      
      // Try to get the minted token ID from events
      if (receipt.events && receipt.events.length > 0) {
        // Look for Transfer event (standard for ERC-721)
        const transferEvent = receipt.events.find((e: TransferEvent) => e.event === 'Transfer');
        if (transferEvent && transferEvent.args) {
          const tokenId = transferEvent.args.tokenId.toNumber();
          setMintedTokenId(tokenId);
          console.log(`Minted token ID: ${tokenId}`);
          
          // Call the onMinted callback if provided
          if (onMinted) {
            onMinted(contractAddress, tokenId);
          }
        }
      }
      
    } catch (err: unknown) {
      console.error('Error minting NFT:', err);
      setError(
        err && typeof err === 'object' && 'message' in err && typeof err.message === 'string'
          ? err.message
          : 'Error minting NFT'
      );
    } finally {
      setMinting(false);
    }
  };

  // Get the appropriate explorer URL based on network
  const getExplorerUrl = (type: 'tx' | 'token'): string => {
    let baseUrl = '';
    
    if (network === 'kairos') {
      // Kairos Testnet
      baseUrl = 'https://explorer.kairos.network';
    } else if (network === 'mumbai') {
      // Polygon Mumbai
      baseUrl = 'https://mumbai.polygonscan.com';
    } else if (network === 'polygon') {
      // Polygon Mainnet
      baseUrl = 'https://polygonscan.com';
    } else {
      // Default to Ethereum networks
      baseUrl = `https://${network}.etherscan.io`;
    }
    
    if (type === 'tx' && txHash) {
      return `${baseUrl}/tx/${txHash}`;
    } else if (type === 'token' && mintedTokenId !== null) {
      return `${baseUrl}/token/${contractAddress}?a=${mintedTokenId}`;
    }
    
    return '#'; // Default fallback URL
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Contract Address</label>
        <input
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          placeholder="Enter the deployed NFT contract address"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Token URI</label>
        <input
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
          value={tokenURI}
          readOnly
        />
      </div>
      
      <button
        onClick={mint}
        disabled={minting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
      >
        {minting ? 'Minting...' : 'Mint NFT'}
      </button>
      
      {/* Display information after successful minting */}
      {(txHash || mintedTokenId !== null) && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-medium text-green-800 mb-2">NFT Minted Successfully!</h3>
          
          {mintedTokenId !== null && (
            <p className="text-sm text-green-700 mb-4">
              Token ID: <span className="font-mono">{mintedTokenId}</span>
            </p>
          )}
          
          <div className="space-y-2">
            {txHash && (
              <a
                href={getExplorerUrl('tx')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                View Transaction on Explorer
              </a>
            )}
            
            {mintedTokenId !== null && (
              <a
                href={getExplorerUrl('token')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ml-2"
              >
                View NFT on Explorer
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTMinter;