import { ToolLink, CategoryInfo } from './types';

/**
 * 【版本协议】
 * 当前环境固化版本：1.3.4
 */
export const PORTAL_VERSION = "1.3.4"; 

// 管理员登录密码
export const DEFAULT_ADMIN_PASSWORD = "82884538";

export const DEFAULT_CATEGORIES: CategoryInfo[] = [
  {
    "id": "cat_1",
    "label": "生产制造",
    "color": "#f97316"
  },
  {
    "id": "cat_2",
    "label": "技术研发",
    "color": "#0ea5e9"
  },
  {
    "id": "cat_3",
    "label": "财务成本",
    "color": "#64748b"
  },
  {
    "id": "cat_4",
    "label": "行政办公",
    "color": "#8b5cf6"
  }
];

export const DEFAULT_TOOLS: ToolLink[] = [
  {
    "id": "2",
    "name": "PMRX发生器计算",
    "description": "气体发生器相关计算",
    "url": "./endo-calc",
    "iconName": "Calculator",
    "color": "#10b981",
    "categoryId": "cat_2"
  }
];

export const TRANSLATIONS = {
  "zh": {
    "companyEn": "Shanghai PowerMax Furnaces Corp.",
    "companyZh": "上海宝华威热处理设备有限公司",
    "hubTitle": "Digital Workspace Platform",
    "hubSub": "数字化工作平台",
    "searchPlaceholder": "搜索系统模块...",
    "manage": "管理",
    "passwordError": "访问密钥无效，认证失败",
    "login": "身份验证",
    "logout": "注销",
    "addTool": "新增节点",
    "editTool": "节点配置",
    "confirmDelete": "确认删除该节点？",
    "syncUpdate": "底层同步"
  }
};
