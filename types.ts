
export interface CategoryInfo {
  id: string;
  label: string;
  color: string;
}

export interface ToolLink {
  id: string;
  name: string;
  description: string;
  url: string;
  iconName: string;
  color: string;
  categoryId: string;
}

export interface SecurityConfig {
  masterKey: string;
  adminPassword: string;
}

export type ThemeType = 'vibrant-orange' | 'tech-blue' | 'industrial-silver' | 'forest-green' | 'royal-purple';

export interface HubConfig {
  companyName: string;
  categories: CategoryInfo[];
  tools: ToolLink[];
  security: SecurityConfig;
}
