import React, { useState, useEffect } from 'react';
import { NFTContractInfo } from '../types/nft';
import { 
  getNFTContracts, 
  connectWallet, 
  getConnectedAddress, 
  getCurrentNetwork,
  mintNFT
} from '../services/web3';

interface NFTMinterProps {
  tokenURI: string;
}

const NFTMinter: React.FC<NFTMinterProps> = ({ tokenURI }) => {
  const [contracts, setContracts] = useState<NFTContractInfo[]>([]);
  const [selectedContract, setSelectedContract] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [currentNetwork, setCurrentNetwork] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Load contracts and check for connected wallet
  useEffect(() => {
    const loadData = async () => {
      try {
        const allContracts = getNFTContracts();
        setContracts(allContracts);
        
        // Check for connected wallet
        const address = await getConnectedAddress();
        setWalletAddress(address);
        
        if (address) {
          try {
            const network = await getCurrentNetwork();
            setCurrentNetwork(network);
            // Set recipient address to connected wallet by default
            setRecipientAddress(address);
          } catch (err) {
            console.error('Error getting network:', err);
          }
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };
    
    loadData();
  }, []);

  const handleConnect = async () => {
    try {
      const accounts = await connectWallet();
      setWalletAddress(accounts[0]);
      setRecipientAddress(accounts[0]); // Set recipient to connected wallet
      
      const network = await getCurrentNetwork();
      setCurrentNetwork(network);
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setError(error.message || 'Failed to connect wallet');
    }
  };

  const handleContractChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedContract(e.target.value);
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTxHash(null);

    // Validation
    if (!selectedContract) {
      setError('Please select a contract');
      return;
    }

    if (!recipientAddress) {
      setError('Recipient address is required');
      return;
    }

    if (!tokenURI) {
      setError('Token URI is required');
      return;
    }

    // Get the selected contract
    const contract = contracts.find(c => c.address === selectedContract);
    if (!contract) {
      setError('Selected contract not found');
      return;
    }

    setIsMinting(true);

    try {
      const result = await mintNFT(
        contract.address,
        contract.abi,
        tokenURI,
        recipientAddress
      );

      if (result.success && result.txHash) {
        setTxHash(result.txHash);
      } else {
        setError(result.error || 'Failed to mint NFT');
      }
    } catch (error: any) {
      console.error('Error minting NFT:', error);
      setError(error.message || 'Failed to mint NFT');
    } finally {
      setIsMinting(false);
    }
  };

  const getNetworkExplorerURL = (network: string, txHash: string) => {
    if (network.includes('Ethereum Mainnet')) {
      return `https://etherscan.io/tx/${txHash}`;
    } else if (network.includes('Goerli')) {
      return `https://goerli.etherscan.io/tx/${txHash}`;
    } else if (network.includes('Sepolia')) {
      return `https://sepolia.etherscan.io/tx/${txHash}`;
    } else if (network.includes('Polygon Mainnet')) {
      return `https://polygonscan.com/tx/${txHash}`;
    } else if (network.includes('Mumbai')) {
      return `https://mumbai.polygonscan.com/tx/${txHash}`;
    }
    return null;
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Mint NFT
        </h3>
        
        {!walletAddress ? (
          <div className="mt-5">
            <p className="text-sm text-gray-500 mb-3">
              Connect your wallet to start minting NFTs
            </p>
            <button
              type="button"
              onClick={handleConnect}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="mt-5">
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg className="mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                  Connected
                </span>
                <span className="text-sm text-gray-500">{walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}</span>
              </div>
              {currentNetwork && (
                <span className="text-sm text-gray-500 mt-1 block">Network: {currentNetwork}</span>
              )}
            </div>

            {contracts.length === 0 ? (
              <div className="text-center py-4 border border-dashed border-gray-300 rounded-md">
                <p className="text-sm text-gray-500">
                  No NFT contracts found. Please add a contract first.
                </p>
              </div>
            ) : (
              <form onSubmit={handleMint} className="space-y-4">
                <div>
                  <label htmlFor="contract" className="block text-sm font-medium text-gray-700">
                    Select Contract
                  </label>
                  <select
                    id="contract"
                    value={selectedContract}
                    onChange={handleContractChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select a contract</option>
                    {contracts.map((contract) => (
                      <option key={contract.address} value={contract.address}>
                        {contract.name} ({contract.network})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    id="recipient"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="0x..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Token URI
                  </label>
                  <div className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 overflow-x-auto">
                    {tokenURI}
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{error}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {txHash && (
                  <div className="rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Success!</h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>NFT minted successfully!</p>
                          <p className="font-mono mt-1 text-xs break-all">Transaction: {txHash}</p>
                          {currentNetwork && (
                            <a 
                              href={getNetworkExplorerURL(currentNetwork, txHash) || "#"} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-block mt-2 text-green-700 underline"
                            >
                              View on Explorer
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isMinting || !selectedContract || !recipientAddress}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isMinting ? 'Minting...' : 'Mint NFT'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTMinter;