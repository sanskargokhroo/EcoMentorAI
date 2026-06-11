// File: src/tests/hooks.test.ts — Unit tests for hooks

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTranslation } from '../hooks/useTranslation';

describe('useTranslation Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // 14. useTranslation returns correct strings
  it('returns default English string', () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.lang).toBe('en');
    expect(result.current.t('app.title')).toBe('EcoMentor AI');
  });

  // 15. toggleLanguage works
  it('toggles language to Hindi', () => {
    const { result } = renderHook(() => useTranslation());
    
    act(() => {
      result.current.toggleLanguage();
    });

    expect(result.current.lang).toBe('hi');
    expect(result.current.t('app.title')).toBe('इको मेंटर एआई');
    expect(localStorage.getItem('app_lang')).toBe('hi');
  });
});
