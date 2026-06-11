// File: src/tests/components.test.tsx — Unit tests for React components


import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CarbonForm from '../components/CarbonForm';
import GreenScore from '../components/GreenScore';
import ChallengeCard from '../components/ChallengeCard';

// Mock translation hook
vi.mock('../hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    lang: 'en',
    toggleLanguage: vi.fn()
  })
}));

describe('React Components', () => {
  // 9. CarbonForm component: renders all fields
  it('renders CarbonForm with all inputs', () => {
    render(<CarbonForm onSubmit={vi.fn()} isLoading={false} />);
    expect(screen.getByLabelText('form.travel')).toBeInTheDocument();
    expect(screen.getByLabelText('form.transport')).toBeInTheDocument();
    expect(screen.getByLabelText('form.electricity')).toBeInTheDocument();
    expect(screen.getByLabelText('form.diet')).toBeInTheDocument();
    expect(screen.getByLabelText('form.shopping')).toBeInTheDocument();
  });

  // 10. CarbonForm component: shows loading state on submit
  it('shows loading state on CarbonForm when isLoading is true', () => {
    render(<CarbonForm onSubmit={vi.fn()} isLoading={true} />);
    const submitBtn = screen.getByText(/Waking up AI servers/i);
    expect(submitBtn).toBeInTheDocument();
  });

  // 11. GreenScore component: renders correct rating letter
  it('renders GreenScore with correct grade', () => {
    render(<GreenScore score={85} rating="B" />);
    expect(screen.getByText('Grade B')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  // 12. ChallengeCard component: marks challenge complete on click
  it('calls onToggle when ChallengeCard is clicked', () => {
    const handleToggle = vi.fn();
    render(<ChallengeCard id="c1" title="Test Challenge" isCompleted={false} onToggle={handleToggle} />);
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    expect(handleToggle).toHaveBeenCalledWith('c1');
  });

  // 13. ChallengeCard component: accessibility keyboard
  it('triggers onToggle with Enter key', () => {
    const handleToggle = vi.fn();
    render(<ChallengeCard id="c1" title="Test Challenge" isCompleted={false} onToggle={handleToggle} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(handleToggle).toHaveBeenCalledWith('c1');
  });
});
