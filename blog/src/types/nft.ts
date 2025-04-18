export interface NFTMetadata {
    name: string;
    description: string;
    image: string;
    attributes?: Array<{
      trait_type: string;
      value: string | number;
    }>;
  }
  
  export interface NFTContractInfo {
    name: string;
    address: string;
    abi: any[];
    network: string;
  }
  
  export interface UploadedImage {
    cid: string;
    url: string;
    name: string;
    size: number;
  }
  
  export interface StoredMetadata {
    id: string;
    cid: string;
    url: string;
    metadata: NFTMetadata;
    createdAt: string;
  }