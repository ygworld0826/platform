import React, { useState } from 'react';

// Define the NFTMetadata type
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  // Add other fields as needed
}

// Define the props interface for MetadataForm
interface MetadataFormProps {
  onMetadataStored: (uri: string) => void;
}

// Direct metadata storage function that bypasses the service
// Mock IPFS storage function for testing (simulates Pinata)
const storeMetadataDirectly = async (metadata: NFTMetadata): Promise<string> => {
  try {
    console.log("Mock IPFS: Processing metadata:", metadata);
    
    // Generate a mock IPFS hash (this would normally come from Pinata)
    // For testing purposes, we'll generate a hash based on the current timestamp and metadata
    const timestamp = Date.now();
    const mockHash = `Qm${timestamp.toString(16)}${metadata.name.replace(/\s+/g, '')}`;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Mock IPFS: Generated hash:", mockHash);
    
    // Return a mock IPFS URI
    return `ipfs://${mockHash}`;
  } catch (error) {
    console.error('Error in mock IPFS storage:', error);
    throw error;
  }
};

const MetadataForm: React.FC<MetadataFormProps> = ({ onMetadataStored }) => {
  const [metadata, setMetadata] = useState<NFTMetadata>({
    name: '',
    description: '',
    image: '',
    attributes: []
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);
    
    try {
      // Call the storeMetadataDirectly function and get the URI
      const metadataUri = await storeMetadataDirectly(metadata);
      
      // Call the callback with the returned URI
      onMetadataStored(metadataUri);
      
    } catch (error) {
      // Handle error
      console.error("Error storing metadata:", error);
      setError("Failed to store metadata. Please check console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle adding new attributes
  const [newTraitType, setNewTraitType] = useState('');
  const [newTraitValue, setNewTraitValue] = useState('');

  const addAttribute = () => {
    if (newTraitType && newTraitValue) {
      setMetadata({
        ...metadata,
        attributes: [
          ...(metadata.attributes || []),
          { trait_type: newTraitType, value: newTraitValue }
        ]
      });
      // Reset inputs
      setNewTraitType('');
      setNewTraitValue('');
    }
  };

  const removeAttribute = (index: number) => {
    const updatedAttributes = [...(metadata.attributes || [])];
    updatedAttributes.splice(index, 1);
    setMetadata({
      ...metadata,
      attributes: updatedAttributes
    });
  };

  // Your form JSX here
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={metadata.name}
          onChange={(e) => setMetadata({...metadata, name: e.target.value})}
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={metadata.description}
          onChange={(e) => setMetadata({...metadata, description: e.target.value})}
          rows={4}
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={metadata.image}
          onChange={(e) => setMetadata({...metadata, image: e.target.value})}
          placeholder="ipfs:// or https:// URL to your image"
          required
        />
      </div>
      
      {/* Attributes section */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Attributes</label>
        
        {/* Display existing attributes */}
        {metadata.attributes && metadata.attributes.length > 0 && (
          <div className="mb-4 space-y-2">
            {metadata.attributes.map((attr, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                <div className="flex-1">
                  <span className="font-medium">{attr.trait_type}:</span> {attr.value}
                </div>
                <button
                  type="button"
                  onClick={() => removeAttribute(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Add new attribute */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500">Trait Type</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={newTraitType}
              onChange={(e) => setNewTraitType(e.target.value)}
              placeholder="e.g. Color, Size, Rarity"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Value</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={newTraitValue}
              onChange={(e) => setNewTraitValue(e.target.value)}
              placeholder="e.g. Blue, Large, Legendary"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={addAttribute}
          disabled={!newTraitType || !newTraitValue}
          className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          Add Attribute
        </button>
      </div>
      
      <button
        type="submit"
        disabled={isUploading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
      >
        {isUploading ? 'Storing Metadata...' : 'Store Metadata'}
      </button>
    </form>
  );
};

export default MetadataForm;