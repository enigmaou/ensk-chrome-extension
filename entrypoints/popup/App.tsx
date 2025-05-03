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

const MALICIOUS_PERMISSIONS = [
  {
    name: 'webRequest',
    url: 'https://developer.chrome.com/docs/extensions/reference/webRequest/',
    description: 'Allows the extension to observe and analyze traffic, intercept, block, or modify requests in-flight. This could be used to steal sensitive data or inject malicious content into web pages.'
  },
  {
    name: 'activeTab',
    url: 'https://developer.chrome.com/docs/extensions/develop/concepts/activeTab?hl=en',
    description: 'Grants temporary access to the content of the active tab. This could be exploited to read sensitive information from the current webpage.'
  },
  {
    name: 'scripting',
    url: 'https://developer.chrome.com/docs/extensions/reference/scripting/',
    description: 'Allows the extension to inject JavaScript or CSS into web pages. This could be used to manipulate web content or execute malicious scripts.'
  },
  {
    name: 'tabs',
    url: 'https://developer.chrome.com/docs/extensions/reference/tabs/',
    description: 'Provides access to browser tabs, including their URLs and titles. This could be used to track browsing activity or gather sensitive information.'
  },
];

function App() {
  const [count, setCount] = useState(0);
  const [extensions, setExtensions] = useState<ExtensionInfo[]>([]);
  const [dropdownStates, setDropdownStates] = useState<{ [key: string]: boolean }>({});

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

  const isMaliciousPermission = (permission: string): { name: string; url: string; description: string } | undefined => {
    return MALICIOUS_PERMISSIONS.find((malicious) => malicious.name === permission);
  };

  const toggleDropdown = (key: string) => {
    setDropdownStates((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

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
                    ext.permissions.map((perm, idx) => {
                      const maliciousInfo = isMaliciousPermission(perm);
                      const dropdownKey = `${ext.name}-${perm}`;
                      return (
                        <li key={idx} className="permission-item">
                          <span className="permission-name">{perm}</span>
                          {maliciousInfo && (
                            <div className="malicious-info-container">
                              <button
                                className="dropdown-trigger"
                                onClick={() => toggleDropdown(dropdownKey)}
                              >
                                ⚠️
                              </button>
                              {dropdownStates[dropdownKey] && (
                                <div className="malicious-description">
                                  <p>{maliciousInfo.description}</p>
                                  <a href={maliciousInfo.url} target="_blank" rel="noopener noreferrer">Learn more</a>
                                </div>
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })
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
