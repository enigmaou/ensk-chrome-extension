import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  outDir: 'dist',
  manifest: {
    version: '3',
    name: 'Enigma Shell Kit - Extension Permissions Checker',
    short_name: 'Extension Permissions Checker',
    description: 'A Chrome extension to check installed extensions and their permissions.',
    manifest_version: 3,
    permissions: ['management'],
    optional_permissions: [],
    host_permissions: [], // Ensure no host permissions are included
    content_scripts: [], // Ensure no content scripts are defined
    background: {
      service_worker: 'background.js',
    },
    action: {
      default_popup: 'popup/index.html',
    },
    icons: {
      '16': 'icon/16.png',
      '48': 'icon/48.png',
      '128': 'icon/128.png',
    },
  },
});
