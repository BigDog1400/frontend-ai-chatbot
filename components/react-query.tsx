'use client';

import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
// Create a client
const queryClient = new QueryClient()

function ReactQueryProvider({ children }: React.PropsWithChildren) {

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export default ReactQueryProvider;
