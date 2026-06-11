import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EcoTree } from './EcoTree';
import * as useEcoTreeModule from '../../hooks/useEcoTree';

describe('EcoTree Component', () => {
  const mockLogAction = vi.fn();
  
  const defaultMockState = {
    treeState: {
      totalLeaves: 0,
      totalCO2Saved: 0,
      currentStage: { name: 'Seed', description: 'desc', minLeaves: 0, nextLeaves: 5, unlockMessage: 'msg' },
      streak: 0,
      lastActionDate: null,
      history: [],
      badges: []
    },
    renderData: { trunk: { x: 0, y: 0, width: 0, height: 0 }, branches: [], leaves: [], fruits: [], flowers: [] },
    stageProgress: 0,
    leavesToNext: 5,
    logAction: mockLogAction,
    logExternalAction: vi.fn(),
    resetTree: vi.fn(),
    recentHistory: [],
    toastMessage: null
  };

  it('renders seed when leafCount is 0', () => {
    vi.spyOn(useEcoTreeModule, 'useEcoTree').mockReturnValue(defaultMockState);
    render(<EcoTree />);
    expect(screen.getByRole('img', { name: /Your eco tree — 0 leaves/i })).toBeDefined();
  });

  it('renders stage name correctly', () => {
    vi.spyOn(useEcoTreeModule, 'useEcoTree').mockReturnValue(defaultMockState);
    render(<EcoTree />);
    expect(screen.getByText('Seed')).toBeDefined();
  });

  it('action button click calls logAction with correct EcoAction type', () => {
    vi.spyOn(useEcoTreeModule, 'useEcoTree').mockReturnValue(defaultMockState);
    render(<EcoTree />);
    const walkButton = screen.getByRole('button', { name: /Walked instead of drove/i });
    fireEvent.click(walkButton);
    expect(mockLogAction).toHaveBeenCalledWith('walk');
  });

  it('progress bar has correct aria attributes', () => {
    vi.spyOn(useEcoTreeModule, 'useEcoTree').mockReturnValue({
      ...defaultMockState,
      stageProgress: 50
    });
    render(<EcoTree />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar.getAttribute('aria-valuenow')).toBe('50');
  });

  it('toast appears', () => {
    vi.spyOn(useEcoTreeModule, 'useEcoTree').mockReturnValue({
      ...defaultMockState,
      toastMessage: 'Test Toast'
    });
    render(<EcoTree />);
    expect(screen.getByText('Test Toast')).toBeDefined();
  });

  it('SVG has role="img" and aria-label', () => {
    vi.spyOn(useEcoTreeModule, 'useEcoTree').mockReturnValue(defaultMockState);
    render(<EcoTree />);
    const svg = screen.getByRole('img');
    expect(svg.getAttribute('aria-label')).toBe('Your eco tree — 0 leaves, currently Seed stage');
  });
});
