// Fallback for web browser testing
import { Portfolio, PortfolioData, AppInfo } from '@/types/portfolio';

export interface ExportData {
  portfolio: Portfolio;
  content: string;
}

export interface ExportResult {
  success: boolean;
  path?: string;
}

// Check if running in Tauri
const isTauri = () => {
  return typeof window !== 'undefined' && '__TAURI__' in window;
};

export async function getPortfolios(): Promise<PortfolioData> {
  if (!isTauri()) {
    const saved = localStorage.getItem('portfolios');
    if (saved) {
      return JSON.parse(saved);
    }
    return { portfolios: [], nextNumber: 1 };
  }
  const { invoke } = await import('@tauri-apps/api/core');
  return await invoke<PortfolioData>('get_portfolios');
}

export async function savePortfolio(portfolio: Portfolio): Promise<PortfolioData> {
  if (!isTauri()) {
    const saved = localStorage.getItem('portfolios') || '{"portfolios":[],"nextNumber":1}';
    const data: PortfolioData = JSON.parse(saved);

    const existingIndex = data.portfolios.findIndex(p => p.id === portfolio.id);
    if (existingIndex >= 0) {
      data.portfolios[existingIndex] = portfolio;
    } else {
      data.portfolios.unshift(portfolio);
      data.nextNumber = Math.max(data.nextNumber, portfolio.number + 1);
    }

    localStorage.setItem('portfolios', JSON.stringify(data));
    return data;
  }

  const { invoke } = await import('@tauri-apps/api/core');
  return await invoke<PortfolioData>('save_portfolio', { portfolio });
}

export async function deletePortfolio(id: string): Promise<PortfolioData> {
  if (!isTauri()) {
    const saved = localStorage.getItem('portfolios') || '{"portfolios":[],"nextNumber":1}';
    const data: PortfolioData = JSON.parse(saved);
    data.portfolios = data.portfolios.filter(p => p.id !== id);
    localStorage.setItem('portfolios', JSON.stringify(data));
    return data;
  }

  const { invoke } = await import('@tauri-apps/api/core');
  return await invoke<PortfolioData>('delete_portfolio', { id });
}

export async function exportMarkdown(data: ExportData): Promise<ExportResult> {
  if (!isTauri()) {
    // Web browser: download file
    const filename = data.portfolio.name.replace(/\s+/g, '_');
    const blob = new Blob([data.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.md`;
    a.click();
    URL.revokeObjectURL(url);
    return { success: true };
  }

  const { invoke } = await import('@tauri-apps/api/core');
  return await invoke<ExportResult>('export_markdown', { data });
}

export async function getAppInfo(): Promise<AppInfo> {
  if (!isTauri()) {
    return {
      version: '1.0.0',
      name: 'Portfolio Generator (Web)',
      dataPath: 'localStorage'
    };
  }

  const { invoke } = await import('@tauri-apps/api/core');
  return await invoke<AppInfo>('get_app_info');
}
