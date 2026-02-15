import React from 'react';
import { Tekst } from './Tekst';

// Placeholder is a thin wrapper around Tekst that keeps the same settings
export const Placeholder = (props: any) => {
  return <Tekst {...props} />;
};

// Copy craft metadata but override displayName
(Placeholder as any).craft = {
  ...((Tekst as any).craft || {}),
  displayName: 'Placeholder',
  props: {
    ...(Tekst as any).craft?.props || {},
    text: '${guest.firstName} ${guest.lastName}'
  }
};

export default Placeholder;
