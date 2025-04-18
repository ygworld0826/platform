import React, { useState } from 'react';
import { NFTContractInfo } from '../types/nft';
import { saveNFTContract } from '../services/web3';

interface NFTContractFormProps {
  onContractSaved: () => void;
  initialContract?: NFTContractInfo;
}

const NFTContractForm: React.FC<NFTContractFormProps> = ({
  onContractSaved,
  initialContract
}) => {
  const [name, setName] = useState(initialContract?.name || '');
  const [address, setAddress] = useState(initialContract?.address || '');
  const [network, setNetwork] = useState(initialContract?.network || '');
  const [abiText, setAbiText] = useState(
    initialContract ? JSON.stringify(initialContract.abi, null, 2) : ''
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError('Contract name is required');
      return;
    }

    if (!address.trim()) {
      setError('Contract address is required');
      return;
    }

    if (!network.trim()) {
      setError('Network is required');
      return;
    }

    if (!abiText.trim()) {
      setError('ABI is required');
      return;
    }

    try {
      // Parse ABI from string to JSON
      const abi = JSON.parse(abiText);
      
      // Create contract object
      const contract: NFTContractInfo = {
        name,
        address,
        network,
        abi
      };
      
      // Save contract
      saveNFTContract(contract);
      
      // Notify parent
      onContractSaved();
      
      // Reset form if it's a new contract (not editing)
      if (!initialContract) {
        setName('');
        setAddress('');
        setNetwork('');
        setAbiText('');
      }
    } catch (error) {
      console.error('Error parsing ABI:', error);
      setError('Invalid ABI JSON format');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contract-name" className="block text-sm font-medium text-gray-700">
          Contract Name
        </label>
        <input
          type="text"
          id="contract-name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="My NFT Collection"
        />
      </div>

      <div>
        <label htmlFor="contract-address" className="block text-sm font-medium text-gray-700">
          Contract Address
        </label>
        <input
          type="text"
          id="contract-address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="0x..."
        />
      </div>

      <div>
        <label htmlFor="network" className="block text-sm font-medium text-gray-700">
          Network
        </label>
        <select
          id="network"
          value={network}
          onChange={e => setNetwork(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select Network</option>
          <option value="Ethereum Mainnet">Ethereum Mainnet</option>
          <option value="Goerli Testnet">Goerli Testnet</option>
          <option value="Sepolia Testnet">Sepolia Testnet</option>
          <option value="Polygon Mainnet">Polygon Mainnet</option>
          <option value="Mumbai Testnet">Mumbai Testnet</option>
          <option value="Kairos Testnet">Kairos Testnet</option>
        </select>
      </div>

      <div>
        <label htmlFor="contract-abi" className="block text-sm font-medium text-gray-700">
          Contract ABI
        </label>
        <textarea
          id="contract-abi"
          rows={10}
          value={abiText}
          onChange={e => setAbiText(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
          placeholder="[{...}]"
        />
        <p className="mt-1 text-xs text-gray-500">
          Paste the JSON ABI from your smart contract
        </p>
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

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {initialContract ? 'Update Contract' : 'Save Contract'}
        </button>
      </div>
    </form>
  );
};

export default NFTContractForm;