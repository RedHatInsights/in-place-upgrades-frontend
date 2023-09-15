import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import AppEntry from './AppEntry';

function EntryWithCallback() {
  useEffect(() => {
    root?.setAttribute('data-ouia-safe', 'true');
  });

  return <AppEntry />;
}

const root = document.getElementById('root') as HTMLElement;
const rootInstance = createRoot(root);
rootInstance.render(<EntryWithCallback />);
