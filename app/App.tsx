import React from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { Header } from './components/Header';
import { Toolbox } from './components/Toolbox';
import { SettingsPanel } from './components/SettingsPanel';
import { PlaceholderProvider } from './components/placeholders/placeholderContext';
import { Viewport } from './components/Viewport';

// User Components
import { Document } from './components/user/Document';
import { Page } from './components/user/Page';
import { Titel } from './components/user/Titel';
import { Tekst } from './components/user/Tekst';
import { Placeholder } from './components/user/Placeholder';
import { GastInformatie } from './components/user/GastInformatie';
import { Afbeelding } from './components/user/Afbeelding';
import { Rij } from './components/user/Rij';
import { Kolom } from './components/user/Kolom';

const resolver = {
  Document,
  Page,
  Titel,
  Tekst,
  Placeholder,
  GastInformatie,
  Afbeelding,
  Row: Rij,      // Map Rij component to 'Row' for export compatibility
  Column: Kolom  // Map Kolom component to 'Column' for export compatibility
};

const App: React.FC = () => {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-gray-100">
      <Editor resolver={resolver}>
        <PlaceholderProvider>
        <Header />
        
        <div className="flex flex-1 overflow-hidden relative">
          {/* Left Sidebar */}
          <Toolbox />

          {/* Main Canvas Area */}
          <Viewport>
            <Frame>
              <Element is={Document} canvas>
                {/* Initial Page */}
                <Element is={Page} canvas />
              </Element>
            </Frame>
          </Viewport>

          {/* Right Sidebar */}
          <SettingsPanel />
        </div>
        </PlaceholderProvider>
      </Editor>
    </div>
  );
};

export default App;