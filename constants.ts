
import { ToolLink, CategoryInfo } from './types';

/**
 * 【修改密码步骤】
 * 1. 修改下面的 PORTAL_VERSION（比如从 1.2.9 改为 1.3.0），这样网页才会提示你“同步更新”
 * 2. 修改下面的 DEFAULT_ADMIN_PASSWORD 
 */
export const PORTAL_VERSION = "1.3.0"; 

// 默认初始密码：已恢复为 888888
export const DEFAULT_ADMIN_PASSWORD = "888888";

export const DEFAULT_CATEGORIES: CategoryInfo[] = [
  { id: 'cat_1', label: '生产制造', color: '#f97316' }, 
  { id: 'cat_2', label: '技术研发', color: '#0ea5e9' }, 
  { id: 'cat_3', label: '财务成本', color: '#64748b' }, 
  { id: 'cat_4', label: '行政办公', color: '#8b5cf6' }  
];

export const DEFAULT_TOOLS: ToolLink[] = [
  {
    id: '1',
    name: '热处理气氛计算器',
    description: '氮甲醇/纯甲醇与Rx发生气成本对比分析及热平衡计算。',
    url: './rx-calc/', 
    iconName: 'Calculator',
    color: '#f97316',
    categoryId: 'cat_2'
  },
  {
    id: '2',
    name: '设备状态监控',
    description: '实时查看热处理生产线运行参数、碳势、温度。',
    url: '#',
    iconName: 'Activity',
    color: '#10b981',
    categoryId: 'cat_1'
  }
];

export const TRANSLATIONS = {
    zh: {
        companyEn: "Shanghai PowerMax Furnaces Corp.",
        companyZh: "上海宝华威热处理设备有限公司",
        hubTitle: "Digital Workspace Platform",
        hubSub: "数字化工作平台",
        searchPlaceholder: "搜索系统模块...",
        manage: "管理",
        passwordError: "访问密钥无效，认证失败",
        login: "身份验证",
        logout: "注销",
        addTool: "新增节点",
        editTool: "节点配置",
        confirmDelete: "确认删除该节点？",
        syncUpdate: "底层同步"
    }
};
