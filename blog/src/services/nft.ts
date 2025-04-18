import axios, { AxiosError } from 'axios';
import { NFTMetadata, StoredMetadata } from '../types/nft';

// Local storage key for metadata items
const METADATA_STORAGE_KEY = 'nft_stored_metadata';

// 하드코딩된 API 키
const FALLBACK_API_KEY = "4f5eb1e973348c67f7db";
const FALLBACK_API_SECRET = "76c752db760ae75231ea6e7c2729da9f9318c44671c46b292c64e5855c4d9884";

// Function to get the Pinata API configuration
export const getPinataConfig = () => {
  // 하드코딩된 API 키만 사용
  return {
    headers: {
      pinata_api_key: FALLBACK_API_KEY,
      pinata_secret_api_key: FALLBACK_API_SECRET
    }
  };
};

// Function to retrieve all stored metadata
export const getStoredMetadata = (): StoredMetadata[] => {
  try {
    const storedData = localStorage.getItem(METADATA_STORAGE_KEY);
    if (!storedData) {
      return [];
    }
    
    return JSON.parse(storedData) as StoredMetadata[];
  } catch (error) {
    console.error('Error retrieving stored metadata:', error);
    return [];
  }
};

// Function to save a new metadata item
export const saveStoredMetadata = (metadata: StoredMetadata): void => {
  try {
    const existingMetadata = getStoredMetadata();
    existingMetadata.push(metadata);
    localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(existingMetadata));
  } catch (error) {
    console.error('Error saving metadata:', error);
    throw new Error('Failed to save metadata to local storage');
  }
};

// Function to delete a metadata item by ID
export const deleteStoredMetadata = (id: string): void => {
  try {
    const existingMetadata = getStoredMetadata();
    const updatedMetadata = existingMetadata.filter(item => item.id !== id);
    localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(updatedMetadata));
  } catch (error) {
    console.error('Error deleting metadata:', error);
    throw new Error('Failed to delete metadata from local storage');
  }
};

// Function to upload an image to Pinata
export const uploadImageToPinata = async (file: File) => {
  try {
    console.log('이미지 업로드 시작:', file.name);
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    // Add metadata
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        type: 'nft-image',
        timestamp: Date.now().toString()
      }
    });
    formData.append('pinataMetadata', metadata);
    
    // Add pinata options
    const pinataOptions = JSON.stringify({
      cidVersion: 1
    });
    formData.append('pinataOptions', pinataOptions);
    
    // 하드코딩된 API 키로 직접 요청
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          pinata_api_key: FALLBACK_API_KEY,
          pinata_secret_api_key: FALLBACK_API_SECRET,
          'Content-Type': 'multipart/form-data'
        },
        maxContentLength: Infinity as any,
        maxBodyLength: Infinity as any
      }
    );
    
    console.log('Pinata 응답:', response.data);
    
    // If successful, return the IPFS URL
    if (response.data && response.data.IpfsHash) {
      return {
        url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
        ipfsHash: response.data.IpfsHash
      };
    } else {
      throw new Error('Invalid response from Pinata');
    }
  } catch (error: any) {
    console.error('이미지 업로드 에러 세부 정보:', error);
    
    // 구체적인 에러 메시지 생성
    let errorMessage = "Unknown upload error";
    
    if (axios.isAxiosError(error)) {
      // AxiosError 타입으로 처리
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // 타입스크립트에 맞게 명시적 타입 변환
        const responseData = axiosError.response.data as any;
        errorMessage = responseData?.error || `Server error: ${axiosError.response.status}`;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }
    } else if (error && typeof error === 'object' && 'message' in error) {
      // 일반 Error 객체 처리
      errorMessage = String(error.message);
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    // 표준 Error 객체로 던지기
    throw new Error(errorMessage);
  }
};

// Function to store metadata to Pinata
export const storeMetadataToPinata = async (metadata: NFTMetadata) => {
  try {
    console.log('메타데이터 저장 시작:', metadata.name);
    
    // Prepare the JSON to be pinned
    const data = {
      pinataOptions: {
        cidVersion: 1
      },
      pinataMetadata: {
        name: `${metadata.name}-metadata`,
        keyvalues: {
          type: 'nft-metadata',
          timestamp: Date.now().toString()
        }
      },
      pinataContent: metadata
    };
    
    // 하드코딩된 API 키로 직접 요청
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      data,
      {
        headers: {
          pinata_api_key: FALLBACK_API_KEY,
          pinata_secret_api_key: FALLBACK_API_SECRET,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('메타데이터 저장 응답:', response.data);
    
    // If successful, return the IPFS URL and save to local storage
    if (response.data && response.data.IpfsHash) {
      const result = {
        url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
        ipfsHash: response.data.IpfsHash
      };
      
      // Create a StoredMetadata object
      const storedMetadata: StoredMetadata = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        cid: response.data.IpfsHash,
        url: result.url,
        metadata: metadata,
        createdAt: new Date().toISOString()
      };
      
      // Save to local storage
      saveStoredMetadata(storedMetadata);
      
      return result;
    } else {
      throw new Error('Invalid response from Pinata');
    }
  } catch (error: any) {
    console.error('메타데이터 저장 에러 세부 정보:', error);
    
    // 구체적인 에러 메시지 생성
    let errorMessage = "Unknown metadata storage error";
    
    if (axios.isAxiosError(error)) {
      // AxiosError 타입으로 처리
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // 타입스크립트에 맞게 명시적 타입 변환
        const responseData = axiosError.response.data as any;
        errorMessage = responseData?.error || `Server error: ${axiosError.response.status}`;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }
    } else if (error && typeof error === 'object' && 'message' in error) {
      // 일반 Error 객체 처리
      errorMessage = String(error.message);
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    // 표준 Error 객체로 던지기
    throw new Error(errorMessage);
  }
};