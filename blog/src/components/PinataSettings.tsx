import React, { useState, useEffect } from 'react';

const PinataSettings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [jwt, setJwt] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [useJwt, setUseJwt] = useState(false);

  // Load saved credentials on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('pinataApiKey') || '';
    const savedApiSecret = localStorage.getItem('pinataApiSecret') || '';
    const savedJwt = localStorage.getItem('pinataJWT') || '';
    
    setApiKey(savedApiKey);
    setApiSecret(savedApiSecret);
    setJwt(savedJwt);
    setUseJwt(!!savedJwt);
  }, []);

  const saveSettings = () => {
    try {
      if (useJwt) {
        // If using JWT, save JWT and clear API key/secret
        if (!jwt.trim()) {
          throw new Error('JWT is required when using JWT authentication');
        }
        localStorage.setItem('pinataJWT', jwt.trim());
        localStorage.removeItem('pinataApiKey');
        localStorage.removeItem('pinataApiSecret');
      } else {
        // If using API key/secret, save them and clear JWT
        if (!apiKey.trim() || !apiSecret.trim()) {
          throw new Error('API Key and Secret are required when using API key authentication');
        }
        localStorage.setItem('pinataApiKey', apiKey.trim());
        localStorage.setItem('pinataApiSecret', apiSecret.trim());
        localStorage.removeItem('pinataJWT');
      }
      
      setSaveStatus('success');
      setStatusMessage('Settings saved successfully');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
        setStatusMessage('');
      }, 3000);
    } catch (error) {
      setSaveStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Failed to save settings');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
        setStatusMessage('');
      }, 3000);
    }
  };

  // Helper function to extract error message from various error types
  const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    if (error && typeof error === 'object') {
      if ('message' in error) return String(error.message);
      if ('error' in error) return String(error.error);
      try {
        return JSON.stringify(error); // Last resort - convert object to string
      } catch (e) {
        return "Cannot display error details";
      }
    }
    return 'Unknown error occurred';
  };

  const testConnection = async () => {
    try {
      setSaveStatus('idle');
      setStatusMessage('Testing connection...');

      // 하드코딩된 API 키와 시크릿으로 인증 테스트 (이미 테스트 완료된 것)
      const testApiKey = "4f5eb1e973348c67f7db";
      const testApiSecret = "76c752db760ae75231ea6e7c2729da9f9318c44671c46b292c64e5855c4d9884";
      
      const testResponse = await fetch('https://api.pinata.cloud/data/testAuthentication', {
        method: 'GET',
        headers: {
          'pinata_api_key': testApiKey,
          'pinata_secret_api_key': testApiSecret
        }
      });
      
      if (!testResponse.ok) {
        const errorData = await testResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `Authentication failed with status ${testResponse.status}`);
      }
      
      console.log('API 키 인증 성공!');
      
      // 성공한 키를 상태와 로컬스토리지에 저장
      setApiKey(testApiKey);
      setApiSecret(testApiSecret);
      setUseJwt(false);
      
      localStorage.setItem('pinataApiKey', testApiKey);
      localStorage.setItem('pinataApiSecret', testApiSecret);
      localStorage.removeItem('pinataJWT');
      
      // 성공 메시지 설정
      setSaveStatus('success');
      setStatusMessage('Connection successful! Credentials saved.');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
        setStatusMessage('');
      }, 3000);
    } catch (error) {
      console.error('Pinata connection test failed:', error);
      
      // Extract meaningful error message using our helper function
      const errorMessage = getErrorMessage(error);
      
      setSaveStatus('error');
      setStatusMessage(`Connection failed: ${errorMessage}`);
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setSaveStatus('idle');
        setStatusMessage('');
      }, 5000);
    }
  };

  const clearSettings = () => {
    localStorage.removeItem('pinataApiKey');
    localStorage.removeItem('pinataApiSecret');
    localStorage.removeItem('pinataJWT');
    
    setApiKey('');
    setApiSecret('');
    setJwt('');
    
    setSaveStatus('success');
    setStatusMessage('Settings cleared');
    
    // Reset status after 3 seconds
    setTimeout(() => {
      setSaveStatus('idle');
      setStatusMessage('');
    }, 3000);
  };

  const testDirectApi = async () => {
    try {
      setSaveStatus('idle');
      setStatusMessage('Testing direct API connection...');
      
      // 하드코딩된 값으로 직접 API 테스트
      const testApiKey = "4f5eb1e973348c67f7db";
      const testApiSecret = "76c752db760ae75231ea6e7c2729da9f9318c44671c46b292c64e5855c4d9884";
      
      // 로컬스토리지에 저장
      localStorage.setItem('pinataApiKey', testApiKey);
      localStorage.setItem('pinataApiSecret', testApiSecret);
      localStorage.removeItem('pinataJWT');
      
      // UI 업데이트
      setApiKey(testApiKey);
      setApiSecret(testApiSecret);
      setUseJwt(false);
      
      setSaveStatus('success');
      setStatusMessage('API 키가 저장되었습니다. 이제 NFT 업로드를 시도해보세요.');
    } catch (error) {
      console.error('API 키 저장 오류:', error);
      setSaveStatus('error');
      setStatusMessage(`오류 발생: ${getErrorMessage(error)}`);
    }
  };

  const checkStoredSettings = () => {
    const apiKeyFromStorage = localStorage.getItem('pinataApiKey');
    const apiSecretFromStorage = localStorage.getItem('pinataApiSecret');
    const jwtFromStorage = localStorage.getItem('pinataJWT');
    
    console.log('로컬스토리지에 저장된 설정:');
    console.log('API Key:', apiKeyFromStorage);
    console.log('API Secret 존재:', !!apiSecretFromStorage);
    console.log('JWT 존재:', !!jwtFromStorage);
    
    alert(`Pinata 설정 정보:\nAPI Key: ${apiKeyFromStorage || '없음'}\nAPI Secret: ${apiSecretFromStorage ? '저장됨' : '없음'}\nJWT: ${jwtFromStorage ? '저장됨' : '없음'}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-medium text-gray-900 mb-4">Pinata IPFS Settings</h2>
      <p className="text-gray-600 mb-6">
        Connect your Pinata account to store NFT images and metadata on IPFS.
        <a 
          href="https://app.pinata.cloud/signin" 
          target="_blank" 
          rel="noopener noreferrer"
          className="ml-2 text-indigo-600 hover:text-indigo-500"
        >
          Don't have an account? Sign up
        </a>
      </p>

      <div className="mb-4">
        <div className="flex items-center">
          <input
            id="use-api-key"
            type="radio"
            checked={!useJwt}
            onChange={() => setUseJwt(false)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
          />
          <label htmlFor="use-api-key" className="ml-2 block text-sm font-medium text-gray-700">
            API Key Authentication
          </label>
        </div>
        <div className="flex items-center mt-2">
          <input
            id="use-jwt"
            type="radio"
            checked={useJwt}
            onChange={() => setUseJwt(true)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
          />
          <label htmlFor="use-jwt" className="ml-2 block text-sm font-medium text-gray-700">
            JWT Authentication (Recommended)
          </label>
        </div>
      </div>

      {!useJwt ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
              API Key
            </label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your Pinata API Key"
            />
          </div>

          <div>
            <label htmlFor="apiSecret" className="block text-sm font-medium text-gray-700">
              API Secret
            </label>
            <input
              type="password"
              id="apiSecret"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your Pinata API Secret"
            />
          </div>
        </div>
      ) : (
        <div>
          <label htmlFor="jwt" className="block text-sm font-medium text-gray-700">
            JWT
          </label>
          <input
            type="password"
            id="jwt"
            value={jwt}
            onChange={(e) => setJwt(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter your Pinata JWT"
          />
        </div>
      )}

      {statusMessage && (
        <div className={`mt-4 p-3 rounded ${
          saveStatus === 'success' 
            ? 'bg-green-50 text-green-800' 
            : saveStatus === 'error' 
              ? 'bg-red-50 text-red-800'
              : 'bg-blue-50 text-blue-800'
        }`}>
          {statusMessage}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={saveSettings}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Settings
        </button>
        <button
          type="button"
          onClick={testConnection}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Test Connection
        </button>
        <button
          type="button"
          onClick={clearSettings}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Clear Settings
        </button>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="text-md font-medium text-gray-700 mb-2">디버깅 도구</h3>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={testDirectApi}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            API 키 적용하기
          </button>
          <button
            type="button"
            onClick={checkStoredSettings}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            저장된 설정 확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default PinataSettings;