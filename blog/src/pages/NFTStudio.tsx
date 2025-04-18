import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import NFTContractForm from '../components/NFTContractForm';
import MetadataForm from '../components/MetadataForm';
import NFTMinter from '../components/NFTMinter';
import MetadataViewer from '../components/MetadataViewer';
import PinataSettings from '../components/PinataSettings';
import { MyNFTAbi } from '../abis/MyNFTabi';

// We'll use this for internal reference but not directly in the component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const exampleContractFormat = {
  name: "My NFT Collection",
  address: "0x5f2A098d1A2F39c3119bFa1d4B250ccCf10597B1",
  abi: MyNFTAbi,
  network: "Kairos Testnet"
};

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

const NFTStudio = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tokenURI, setTokenURI] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(true);

  // Add state for tracking minted NFTs
  const [mintedNFT, setMintedNFT] = useState<{
    contractAddress: string;
    tokenId: number;
  } | null>(null);

  // Add refs for tracking NFT minting data
  const [lastMintedContractAddress, setLastMintedContractAddress] = useState('');
  const [lastMintedTokenId, setLastMintedTokenId] = useState<number | null>(null);

  // Monitor the NFTMinter component's rendered output for token IDs
  // This is a workaround since we can't modify NFTMinter's interface
  useEffect(() => {
    // Check for minted token elements in the DOM
    const tokenElement = document.querySelector('span.font-mono');
    if (tokenElement && tokenElement.textContent) {
      const tokenId = parseInt(tokenElement.textContent.trim(), 10);
      if (!isNaN(tokenId) && tokenId !== lastMintedTokenId) {
        setLastMintedTokenId(tokenId);
        
        // Try to find the contract address input value
        const contractInput = document.querySelector('input[placeholder="Enter the deployed NFT contract address"]') as HTMLInputElement;
        if (contractInput && contractInput.value) {
          setLastMintedContractAddress(contractInput.value);
          
          // Update our minted NFT state
          setMintedNFT({
            contractAddress: contractInput.value,
            tokenId: tokenId
          });
        }
      }
    }
  }, [selectedIndex, lastMintedTokenId]);

  const handleMetadataStored = (uri: string): void => {
    setTokenURI(uri);
    setSelectedIndex(2); // Switch to the Minting tab
  };

  const handleContractSaved = (): void => {
    // After contract is saved, switch to metadata tab if no token URI yet
    if (!tokenURI) {
      setSelectedIndex(1);
    }
  };

  const tabs = [
    { name: 'Contracts', current: selectedIndex === 0 },
    { name: 'Create Metadata', current: selectedIndex === 1 },
    { name: 'Mint NFT', current: selectedIndex === 2 },
    { name: 'Metadata Library', current: selectedIndex === 3 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">NFT Studio</h1>
        <p className="mt-2 text-gray-600">
          Create, store, and mint NFTs with ease
        </p>
      </div>

      {/* Toggle for settings */}
      <div className="mb-6">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          {showSettings ? 'Hide API Settings' : 'Show API Settings'}
        </button>
      </div>

      {/* Conditionally show Pinata Settings */}
      {showSettings && <PinataSettings />}

      <div className="w-full">
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-blue-700 shadow'
                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-6">
            {/* Contracts Panel */}
            <Tab.Panel className="rounded-xl bg-white p-6 shadow">
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                NFT Contracts
              </h2>
              <p className="text-gray-600 mb-6">
                Add your NFT smart contract details here. You'll need the contract address and ABI.
              </p>
              <NFTContractForm onContractSaved={handleContractSaved} />
            </Tab.Panel>

            {/* Create Metadata Panel */}
            <Tab.Panel className="rounded-xl bg-white p-6 shadow">
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                Create NFT Metadata
              </h2>
              <p className="text-gray-600 mb-6">
                Upload an image and create metadata for your NFT
              </p>
              <MetadataForm onMetadataStored={handleMetadataStored} />
            </Tab.Panel>

            {/* Mint NFT Panel */}
            <Tab.Panel className="rounded-xl bg-white p-6 shadow">
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                Mint NFT
              </h2>
              <p className="text-gray-600 mb-6">
                Mint your NFT using the metadata you created
              </p>
              {tokenURI ? (
                <div>
                  <NFTMinter tokenURI={tokenURI} />
                </div>
              ) : (
                <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">
                    No metadata created yet. Please go to the "Create Metadata" tab first.
                  </p>
                  <button
                    onClick={() => setSelectedIndex(1)}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Create Metadata
                  </button>
                </div>
              )}
            </Tab.Panel>

            {/* Metadata Library Panel */}
            <Tab.Panel className="rounded-xl bg-white p-6 shadow">
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                Metadata Library
              </h2>
              <p className="text-gray-600 mb-6">
                View and manage all your stored metadata
              </p>
              <MetadataViewer />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      
      {/* Add minted NFT information section */}
      {mintedNFT && (
        <div className="mt-8 border-t pt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Last Minted NFT</h2>
          <div className="space-y-2">
            <p><strong>Contract Address:</strong> {mintedNFT.contractAddress}</p>
            <p><strong>Token ID:</strong> {mintedNFT.tokenId}</p>
            <p className="mt-4">To view this NFT on the blockchain, use the "View NFT on Explorer" button after minting.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTStudio;