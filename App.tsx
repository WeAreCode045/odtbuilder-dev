import React from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { Header } from './app/components/Header';
import { Toolbox } from './app/components/Toolbox';
import { SettingsPanel } from './app/components/SettingsPanel';
import { Viewport } from './app/components/Viewport';

// User Components
import { Document } from './app/components/user/Document';
import { Page } from './app/components/user/Page';
import { Titel } from './app/components/user/Titel';
import { Tekst } from './app/components/user/Tekst';
import { GastInformatie } from './app/components/user/GastInformatie';
import { Afbeelding } from './app/components/user/Afbeelding';
import { Rij } from './app/components/user/Rij';
import { Kolom } from './app/components/user/Kolom';

const resolver = {
  Document,
  Page,
  Titel,
  Tekst,
  GastInformatie,
  Afbeelding,
  Row: Rij,      // Map Rij component to 'Row' for export compatibility
  Column: Kolom  // Map Kolom component to 'Column' for export compatibility
};

const App: React.FC = () => {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-gray-100">
      <Editor resolver={resolver}>
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
      </Editor>
    </div>
  );
};

export default App;