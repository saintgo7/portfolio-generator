import { invoke } from '@tauri-apps/api/core';
import { Portfolio, PortfolioData, AppInfo } from '@/types/portfolio';

export interface ExportData {
  portfolio: Portfolio;
  content: string;
}

export interface ExportResult {
  success: boolean;
  path?: string;
}

export async function getPortfolios(): Promise<PortfolioData> {
  return await invoke<PortfolioData>('get_portfolios');
}

export async function savePortfolio(portfolio: Portfolio): Promise<PortfolioData> {
  return await invoke<PortfolioData>('save_portfolio', { portfolio });
}

export async function deletePortfolio(id: string): Promise<PortfolioData> {
  return await invoke<PortfolioData>('delete_portfolio', { id });
}

export async function exportMarkdown(data: ExportData): Promise<ExportResult> {
  return await invoke<ExportResult>('export_markdown', { data });
}

export async function getAppInfo(): Promise<AppInfo> {
  return await invoke<AppInfo>('get_app_info');
}
