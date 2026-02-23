import React from 'react';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { priority, fill, unoptimized, ...rest } = props;
    void priority;
    void fill;
    void unoptimized;

    return React.createElement('img', rest);
  }
}));
