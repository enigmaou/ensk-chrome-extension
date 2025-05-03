import { useEffect, useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import './App.css';

declare global {
  interface Window {
    chrome: typeof chrome;
  }
}

interface ExtensionInfo {
  name: string;
  permissions: string[];
}

function App() {
  const [count, setCount] = useState(0);
  const [extensions, setExtensions] = useState<ExtensionInfo[]>([]);

  useEffect(() => {
    console.log('Sending message to background script to fetch extensions');
    chrome.runtime.sendMessage({ type: 'GET_EXTENSIONS' }, (response) => {
      console.log('Received response from background script:', response);
      if (response.success) {
        setExtensions(response.extensions);
      } else {
        console.error(response.error);
      }
    });
  }, []);

  return (
    <>
      <div className="extensions">
        <h1 className="extensions-title">Installed Extensions and Permissions</h1>
        {extensions.length === 0 ? (
          <p className="no-extensions">No extensions found.</p>
        ) : (
          <ul className="extensions-list">
            {extensions.map((ext, index) => (
              <li key={index} className="extension-item">
                <strong className="extension-name">{ext.name}</strong>
                <ul className="permissions-list">
                  {ext.permissions.length > 0 ? (
                    ext.permissions.map((perm, idx) => (
                      <li key={idx} className="permission-item">{perm}</li>
                    ))
                  ) : (
                    <li className="no-permissions">No permissions</li>
                  )}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default App;
