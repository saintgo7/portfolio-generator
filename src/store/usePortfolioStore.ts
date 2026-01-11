import { create } from 'zustand';
import { Portfolio, PortfolioData } from '@/types/portfolio';
import * as TauriAPI from '@/lib/tauri-fallback';

interface PortfolioStore {
  portfolios: Portfolio[];
  nextNumber: number;
  currentPortfolio: Portfolio | null;
  isLoading: boolean;

  loadData: () => Promise<void>;
  savePortfolio: (portfolio: Portfolio) => Promise<void>;
  deletePortfolio: (id: string) => Promise<void>;
  setCurrentPortfolio: (portfolio: Portfolio | null) => void;
  getProgress: () => number;
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  portfolios: [],
  nextNumber: 1,
  currentPortfolio: null,
  isLoading: false,

  loadData: async () => {
    set({ isLoading: true });
    try {
      const data: PortfolioData = await TauriAPI.getPortfolios();
      set({
        portfolios: data.portfolios,
        nextNumber: data.nextNumber,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to load portfolios:', error);
      set({ isLoading: false });
    }
  },

  savePortfolio: async (portfolio: Portfolio) => {
    set({ isLoading: true });
    try {
      const data: PortfolioData = await TauriAPI.savePortfolio(portfolio);
      set({
        portfolios: data.portfolios,
        nextNumber: data.nextNumber,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to save portfolio:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  deletePortfolio: async (id: string) => {
    set({ isLoading: true });
    try {
      const data: PortfolioData = await TauriAPI.deletePortfolio(id);
      set({
        portfolios: data.portfolios,
        currentPortfolio: get().currentPortfolio?.id === id ? null : get().currentPortfolio,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to delete portfolio:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  setCurrentPortfolio: (portfolio: Portfolio | null) => {
    set({ currentPortfolio: portfolio });
  },

  getProgress: () => {
    const { portfolios } = get();
    return Math.min(portfolios.length, 100);
  }
}));
