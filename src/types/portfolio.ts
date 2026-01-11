export type CategoryId =
  | 'healthcare'
  | 'finance'
  | 'education'
  | 'ecommerce'
  | 'social'
  | 'productivity'
  | 'entertainment'
  | 'iot'
  | 'ai'
  | 'blockchain';

export type Platform = 'web' | 'mobile' | 'desktop';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
}

export interface DesignTheme {
  name: string;
  bg: string;
  text: string;
  accent: string;
  border: string;
}

export interface TechStack {
  frontend?: string;
  backend?: string;
  framework?: string;
  language?: string;
  database?: string;
  cloud?: string;
  state?: string;
  testing?: string;
  build?: string;
}

export interface Portfolio {
  id: string;
  number: number;
  name: string;
  category: Category;
  platform: Platform;
  description: string;
  designTheme: DesignTheme;
  features: string[];
  techStack: TechStack;
  screens: string[];
  usageSteps: string[];
  version: string;
  createdAt: string;
}

export interface PortfolioData {
  portfolios: Portfolio[];
  nextNumber: number;
}

export interface AppInfo {
  version: string;
  name: string;
  dataPath: string;
}
