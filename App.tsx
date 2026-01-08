
import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import { 
  Search, Plus, X, Edit3, ChevronRight, Globe, Database, Lock, Unlock, 
  RefreshCw, LayoutGrid, Sliders, Tag, Eye, EyeOff, Save, Download,
  Package, Calculator, Cpu, Layers, HardDrive, Gauge, Zap, Thermometer,
  Activity, BarChart, Clipboard, FileText, Layout, Monitor, Network,
  Server, Share2, Workflow, Binary, Component, Factory, FlaskConical,
  Settings2, Shield, Microscope, Wrench, Warehouse, Trash2, Palette,
  Terminal, Sparkles, ShieldCheck, AlertCircle, Palette as ThemeIcon
} from 'lucide-react';
import { ToolLink, CategoryInfo, SecurityConfig, ThemeType } from './types';
import { DEFAULT_TOOLS, DEFAULT_CATEGORIES, TRANSLATIONS, PORTAL_VERSION, DEFAULT_ADMIN_PASSWORD } from './constants';

const PRESET_ICONS = [
  'Package', 'Calculator', 'Cpu', 'Layers', 'Database', 'HardDrive', 
  'Gauge', 'Zap', 'Thermometer', 'Activity', 'BarChart', 'Clipboard',
  'FileText', 'Layout', 'Monitor', 'Network', 'Server', 'Factory',
  'Workflow', 'Binary', 'Component', 'FlaskConical', 'Settings2', 'Shield',
  'Microscope', 'Wrench', 'Warehouse', 'Share2'
];

const THEMES: Record<ThemeType, { name: string, primary: string, bg: string, card: string, text: string, accent: string, border: string }> = {
  'vibrant-orange': {
    name: '活力橙',
    primary: 'bg-orange-500',
    bg: 'bg-slate-50',
    card: 'bg-white',
    text: 'text-slate-900',
    accent: 'text-orange-600',
    border: 'border-slate-200'
  },
  'tech-blue': {
    name: '科技蓝',
    primary: 'bg-sky-600',
    bg: 'bg-slate-900',
    card: 'bg-slate-800',
    text: 'text-white',
    accent: 'text-sky-400',
    border: 'border-slate-700'
  },
  'industrial-silver': {
    name: '工业银',
    primary: 'bg-slate-600',
    bg: 'bg-slate-100',
    card: 'bg-white',
    text: 'text-slate-800',
    accent: 'text-slate-600',
    border: 'border-slate-200'
  },
  'forest-green': {
    name: '森林绿',
    primary: 'bg-emerald-600',
    bg: 'bg-emerald-50/50',
    card: 'bg-white',
    text: 'text-slate-900',
    accent: 'text-emerald-600',
    border: 'border-emerald-100'
  },
  'royal-purple': {
    name: '魅惑紫',
    primary: 'bg-indigo-600',
    bg: 'bg-slate-950',
    card: 'bg-slate-900',
    text: 'text-slate-100',
    accent: 'text-indigo-400',
    border: 'border-slate-800'
  }
};

const App: React.FC = () => {
  const [currentVersion, setCurrentVersion] = useState(() => localStorage.getItem('pw_version') || PORTAL_VERSION);
  const [tools, setTools] = useState<ToolLink[]>(() => {
    const saved = localStorage.getItem('pw_tools');
    return saved ? JSON.parse(saved) : DEFAULT_TOOLS;
  });
  const [categories, setCategories] = useState<CategoryInfo[]>(() => {
    const saved = localStorage.getItem('pw_cats');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });
  const [security, setSecurity] = useState<SecurityConfig>(() => {
    const saved = localStorage.getItem('pw_security');
    return saved ? JSON.parse(saved) : { masterKey: Math.random().toString(36).substring(2, 15), adminPassword: DEFAULT_ADMIN_PASSWORD };
  });
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => (localStorage.getItem('pw_theme') as ThemeType) || 'vibrant-orange');

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showConfirmUpdateModal, setShowConfirmUpdateModal] = useState(false);
  
  const [loginInput, setLoginInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCatId, setActiveCatId] = useState<string>('all');
  const [editingTool, setEditingTool] = useState<ToolLink | null>(null);
  const [pendingVersion, setPendingVersion] = useState('');

  const snapshotRef = useRef({ tools: JSON.stringify(tools), cats: JSON.stringify(categories) });
  const [pwdForm, setPwdForm] = useState({ new: '', confirm: '', show: false });
  const t = TRANSLATIONS.zh;

  const themeConfig = THEMES[currentTheme];
  const isDark = ['tech-blue', 'royal-purple'].includes(currentTheme);

  useEffect(() => {
    if (PORTAL_VERSION !== currentVersion) {
      setShowUpdateModal(true);
    }
  }, [currentVersion]);

  const handleSyncUpdate = () => {
    setTools(DEFAULT_TOOLS);
    setCategories(DEFAULT_CATEGORIES);
    const newSecurity = { ...security, adminPassword: DEFAULT_ADMIN_PASSWORD };
    setSecurity(newSecurity);
    setCurrentVersion(PORTAL_VERSION);
    localStorage.setItem('pw_version', PORTAL_VERSION);
    localStorage.setItem('pw_tools', JSON.stringify(DEFAULT_TOOLS));
    localStorage.setItem('pw_cats', JSON.stringify(DEFAULT_CATEGORIES));
    localStorage.setItem('pw_security', JSON.stringify(newSecurity));
    setIsAuthorized(false);
    localStorage.removeItem('pw_auth_token');
    setShowUpdateModal(false);
    alert(`核心同步成功，当前版本: V${PORTAL_VERSION}`);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('pw_auth_token');
    if (savedToken === security.masterKey) setIsAuthorized(true);
  }, [security.masterKey]);

  useEffect(() => {
    localStorage.setItem('pw_tools', JSON.stringify(tools));
    localStorage.setItem('pw_cats', JSON.stringify(categories));
    localStorage.setItem('pw_security', JSON.stringify(security));
    localStorage.setItem('pw_version', currentVersion);
    localStorage.setItem('pw_theme', currentTheme);
  }, [tools, categories, security, currentVersion, currentTheme]);

  const handleLogin = () => {
    if (loginInput === security.adminPassword) {
      setIsAuthorized(true);
      setShowLoginModal(false);
      setLoginInput('');
      localStorage.setItem('pw_auth_token', security.masterKey);
    } else {
      alert(t.passwordError);
    }
  };

  const handleLogout = () => {
    checkChangesAndExit(() => {
      setIsAuthorized(false);
      localStorage.removeItem('pw_auth_token');
    });
  };

  const checkChangesAndExit = (onExit: () => void) => {
    const currentToolsJson = JSON.stringify(tools);
    const currentCatsJson = JSON.stringify(categories);
    if (currentToolsJson !== snapshotRef.current.tools || currentCatsJson !== snapshotRef.current.cats) {
      const nextVer = (parseFloat(currentVersion) + 0.1).toFixed(1);
      setPendingVersion(nextVer);
      setShowConfirmUpdateModal(true);
    } else {
      onExit();
    }
  };

  const finalizeUpdate = () => {
    setCurrentVersion(pendingVersion);
    setShowConfirmUpdateModal(false);
    setShowAdminModal(false);
    setShowExportModal(true);
    snapshotRef.current = { tools: JSON.stringify(tools), cats: JSON.stringify(categories) };
  };

  const handleUpdatePassword = () => {
    if (!pwdForm.new) return;
    if (pwdForm.new !== pwdForm.confirm) { alert('两次密码输入不一致'); return; }
    setSecurity({ ...security, adminPassword: pwdForm.new });
    setPwdForm({ ...pwdForm, new: '', confirm: '' });
    alert('认证密码已重置。');
  };

  const handleAddCategory = () => {
    const newCat: CategoryInfo = { id: `cat_${Date.now()}`, label: '新板块', color: '#f97316' };
    setCategories([...categories, newCat]);
  };

  const handleUpdateCategory = (id: string, label: string, color: string) => {
    setCategories(categories.map(cat => cat.id === id ? { ...cat, label, color } : cat));
  };

  const handleDeleteCategory = (id: string) => {
    if (categories.length <= 1) { alert("至少保留一个业务板块"); return; }
    if (confirm("确认删除？")) {
      setCategories(categories.filter(cat => cat.id !== id));
      const remainingCatId = categories.find(c => c.id !== id)?.id || '';
      setTools(tools.map(tool => tool.categoryId === id ? { ...tool, categoryId: remainingCatId } : tool));
    }
  };

  const exportConfig = () => {
    return `import { ToolLink, CategoryInfo } from './types';

// 版本号更新
export const PORTAL_VERSION = "${currentVersion}"; 

// 管理员登录密码
export const DEFAULT_ADMIN_PASSWORD = "${security.adminPassword}";

export const DEFAULT_CATEGORIES: CategoryInfo[] = ${JSON.stringify(categories, null, 2)};

export const DEFAULT_TOOLS: ToolLink[] = ${JSON.stringify(tools, null, 2)};

export const TRANSLATIONS = ${JSON.stringify(TRANSLATIONS, null, 2)};
`;
  };

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCatId === 'all' || tool.categoryId === activeCatId;
      return matchSearch && matchCat;
    });
  }, [tools, searchQuery, activeCatId]);

  const IconComponent = ({ name, className, color }: { name: string, className?: string, color?: string }) => {
    const Icon = (LucideIcons as any)[name] || LucideIcons.Package;
    return <Icon className={className} style={{ color }} />;
  };

  return (
    <div className={`min-h-screen ${themeConfig.bg} ${themeConfig.text} font-sans transition-colors duration-500 relative flex flex-col`}>
      {/* Background patterns */}
      {!isDark && <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#000 1px, transparent 0)`, backgroundSize: '32px 32px' }}></div>}
      {isDark && <div className="fixed inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`, backgroundSize: '60px 60px' }}></div>}

      <header className={`sticky top-0 z-40 w-full ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'} backdrop-blur-xl border-b px-8 h-24`}>
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className={`w-14 h-14 ${themeConfig.primary} rounded-2xl flex items-center justify-center shadow-lg text-white`}>
              <Cpu className="w-8 h-8" />
            </div>
            <div>
              <h1 className={`text-2xl font-black tracking-tight leading-none mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.companyZh}</h1>
              <div className="flex items-center gap-3">
                <span className={`text-[13px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.companyEn}</span>
                <span className={`h-1 w-1 rounded-full ${themeConfig.primary}`}></span>
                <span className={`text-[11px] font-black uppercase tracking-widest ${themeConfig.accent}`}>V{currentVersion}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className={`hidden lg:flex items-center gap-3 px-4 py-2 ${isDark ? 'bg-slate-800' : 'bg-slate-100'} rounded-full border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <ThemeIcon size={14} className="text-slate-400" />
              <div className="flex gap-2">
                {Object.entries(THEMES).map(([key, cfg]) => (
                  <button 
                    key={key} 
                    onClick={() => setCurrentTheme(key as ThemeType)}
                    className={`w-5 h-5 rounded-full border-2 ${currentTheme === key ? 'border-orange-500 scale-110 shadow-md' : 'border-transparent'} transition-all flex items-center justify-center`}
                    title={cfg.name}
                  >
                    <div className={`w-3 h-3 rounded-full ${cfg.primary}`}></div>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-11 pr-5 py-2.5 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border rounded-full text-xs font-bold w-64 outline-none focus:ring-2 ring-orange-500/20 transition-all`}
              />
            </div>

            {isAuthorized ? (
              <div className="flex items-center gap-3">
                <button onClick={() => { snapshotRef.current = { tools: JSON.stringify(tools), cats: JSON.stringify(categories) }; setShowAdminModal(true); }} className={`p-2.5 rounded-xl ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'} transition-all`}><Sliders size={20} /></button>
                <button onClick={handleLogout} className={`${themeConfig.primary} text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-orange-500/20`}>锁定终端</button>
              </div>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className={`flex items-center gap-2 px-6 py-2.5 ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'} rounded-xl transition-all`}>
                <Unlock size={18} />
                <span className="text-xs font-black">身份验证</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-14 flex-grow w-full">
        <div className="mb-14">
          <h2 className={`text-5xl font-black mb-4 tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.hubSub}</h2>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
             <span className="flex items-center gap-2"><Globe size={16} className={themeConfig.accent} /> {t.hubTitle}</span>
             <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
             <span>系统状态: <span className="text-emerald-500 font-black">运行中</span></span>
          </div>
        </div>

        {/* Categories Navigation */}
        <div className="flex gap-2 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          <button 
            onClick={() => setActiveCatId('all')} 
            className={`px-8 py-3 rounded-full text-xs font-black transition-all border ${activeCatId === 'all' ? `${themeConfig.primary} text-white border-transparent shadow-xl shadow-orange-500/20` : `${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-500'} hover:border-orange-500/50`}`}
          >
            全部
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCatId(cat.id)} 
              className={`px-8 py-3 rounded-full text-xs font-black transition-all border flex items-center gap-2 ${activeCatId === cat.id ? `${isDark ? 'bg-slate-100 text-slate-900 border-white' : 'bg-slate-800 text-white border-slate-700'}` : `${isDark ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-600'} hover:border-orange-500/50`}`}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></div>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredTools.map(tool => {
            const cat = categories.find(c => c.id === tool.categoryId);
            return (
              <div key={tool.id} className={`group relative ${themeConfig.card} rounded-[2rem] p-10 border ${themeConfig.border} hover:border-orange-500/40 transition-all duration-500 flex flex-col h-[380px] shadow-sm hover:shadow-2xl hover:-translate-y-1`}>
                {isAuthorized && (
                  <button onClick={() => setEditingTool(tool)} className={`absolute top-8 right-8 p-2.5 ${isDark ? 'bg-slate-700' : 'bg-slate-100'} text-slate-400 rounded-xl hover:text-orange-500 transition-all z-10`}><Edit3 size={16} /></button>
                )}
                
                <div className="mb-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${isDark ? 'border-slate-700' : 'border-slate-100'} transition-transform group-hover:scale-110 duration-500`} style={{ backgroundColor: `${tool.color}15`, boxShadow: `0 8px 24px -10px ${tool.color}50` }}>
                    <IconComponent name={tool.iconName} className="w-8 h-8" color={tool.color} />
                  </div>
                </div>

                <h3 className={`text-xl font-black mb-3 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{tool.name}</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} font-medium leading-relaxed mb-10 line-clamp-3`}>{tool.description}</p>
                
                <div className={`mt-auto flex items-center justify-between pt-8 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                  <span className={`text-[11px] font-black uppercase tracking-widest ${themeConfig.accent}`}>{cat?.label || 'SYS'}</span>
                  <button 
                    onClick={() => {
                      if (tool.url && tool.url !== '#') window.location.href = tool.url;
                    }} 
                    className={`flex items-center gap-2 text-xs font-black ${isDark ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'} px-6 py-3 rounded-xl hover:${themeConfig.primary} hover:text-white transition-all shadow-sm`}
                  >
                    进入 <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
          
          {isAuthorized && (
            <button 
              onClick={() => {
                const newTool: ToolLink = { id: Date.now().toString(), name: '新服务节点', description: '待配置详细描述...', url: './', iconName: 'Package', color: '#f97316', categoryId: categories[0]?.id || 'all' };
                setTools([...tools, newTool]);
                setEditingTool(newTool);
              }}
              className={`h-[380px] rounded-[2rem] border-2 border-dashed ${isDark ? 'border-slate-700' : 'border-slate-200'} hover:border-orange-500/50 transition-all flex flex-col items-center justify-center gap-6 group`}
            >
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${isDark ? 'bg-slate-800 text-slate-600' : 'bg-slate-50 text-slate-300'} group-hover:text-orange-500 transition-all duration-500`}><Plus size={40} /></div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-orange-500">挂载新模块</span>
            </button>
          )}
        </div>
      </main>

      <footer className={`py-12 border-t ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-100 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
             <span className={`text-xs font-black uppercase tracking-[0.3em] ${isDark ? 'text-slate-500' : 'text-slate-400'} mb-2`}>{t.companyZh}</span>
             <p className={`text-[10px] font-bold ${isDark ? 'text-slate-600' : 'text-slate-400'} tracking-wider uppercase`}>© 2026 Shanghai PowerMax Furnaces Corp. ALL RIGHTS RESERVED.</p>
          </div>
          <div className="flex items-center gap-8">
             <div className={`h-px w-16 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
             <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Powered By robin</span>
             <div className={`h-px w-16 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      {showConfirmUpdateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-md">
           <div className={`bg-white border border-slate-200 rounded-[2.5rem] p-12 w-full max-w-lg shadow-2xl text-center relative overflow-hidden`}>
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
             <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center mb-8 mx-auto"><AlertCircle size={40} /></div>
             <h3 className="text-2xl font-black text-slate-900 mb-2">配置变更确认</h3>
             <p className="text-slate-500 font-bold mb-10 text-sm leading-relaxed uppercase tracking-tighter">检测到本地配置已修改，请核对版本号并提交源码以完成同步。</p>
             <div className="mb-10">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block text-left mb-2 ml-1">协议版本号</label>
                <input type="text" value={pendingVersion} onChange={e => setPendingVersion(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-black text-orange-600 outline-none text-center" />
             </div>
             <div className="flex gap-4">
                <button onClick={() => { setShowConfirmUpdateModal(false); setShowAdminModal(false); }} className="flex-1 py-5 text-slate-400 font-black text-xs uppercase hover:text-slate-600 tracking-widest">丢弃变更</button>
                <button onClick={finalizeUpdate} className="flex-1 py-5 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-700 shadow-xl shadow-orange-600/20">提交并固化源码</button>
             </div>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-[3rem] p-12 w-full max-w-md shadow-2xl relative">
            <div className="flex flex-col items-center mb-10 text-center">
              <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center text-orange-500 mb-8"><Lock size={36} /></div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">{t.login}</h3>
              <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-[0.3em]">Administrator Access Only</p>
            </div>
            <input 
              type="password" 
              autoFocus 
              value={loginInput} 
              onChange={e => setLoginInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleLogin()} 
              className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-2xl text-center text-4xl font-black tracking-[0.4em] focus:border-orange-500 outline-none mb-12 text-slate-900 transition-all placeholder:text-slate-200" 
              placeholder="••••••" 
            />
            <div className="flex gap-4">
              <button onClick={() => setShowLoginModal(false)} className="flex-1 py-5 text-slate-400 font-black text-xs uppercase hover:text-slate-600 tracking-widest">取消</button>
              <button onClick={handleLogin} className="flex-1 py-5 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-600 shadow-xl shadow-orange-500/20">接入终端</button>
            </div>
          </div>
        </div>
      )}

      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white border border-slate-200 rounded-[3rem] w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
            <div className="px-10 py-10 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4 text-slate-900"><Sliders size={26} className="text-orange-500"/><h3 className="text-xl font-black uppercase tracking-tight">系统管理中心</h3></div>
              <button onClick={() => checkChangesAndExit(() => setShowAdminModal(false))} className="p-3 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><X size={24}/></button>
            </div>
            <div className="p-12 space-y-16 overflow-y-auto scrollbar-hide">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400"><Tag size={18} /><h4 className="font-black text-xs uppercase tracking-widest">业务板块</h4></div>
                  <button onClick={handleAddCategory} className="px-5 py-2.5 bg-orange-50 text-orange-600 rounded-xl text-[11px] font-black border border-orange-100 hover:bg-orange-100 transition-all flex items-center gap-2"><Plus size={16}/> 新增板块</button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {categories.map(cat => (
                    <div key={cat.id} className="flex items-center gap-5 bg-slate-50 p-5 rounded-2xl border border-slate-100 group transition-all hover:border-slate-300">
                      <input type="color" value={cat.color} onChange={e => handleUpdateCategory(cat.id, cat.label, e.target.value)} className="w-12 h-12 p-0 border-0 rounded-xl cursor-pointer bg-transparent" />
                      <input type="text" value={cat.label} onChange={e => handleUpdateCategory(cat.id, e.target.value, cat.color)} className="flex-1 px-5 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-orange-500 text-slate-800" />
                      <button onClick={() => handleDeleteCategory(cat.id)} className="p-3 text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={22}/></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-2 text-slate-400"><Shield size={18} /><h4 className="font-black text-xs uppercase tracking-widest">安全与权限</h4></div>
                <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 space-y-5">
                   <input type="password" placeholder="输入新访问密钥" value={pwdForm.new} onChange={e => setPwdForm({...pwdForm, new: e.target.value})} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold outline-none focus:border-orange-500 text-lg" />
                   <input type="password" placeholder="核对访问密钥" value={pwdForm.confirm} onChange={e => setPwdForm({...pwdForm, confirm: e.target.value})} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold outline-none focus:border-orange-500 text-lg" />
                   <button onClick={handleUpdatePassword} className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:bg-orange-600 flex items-center justify-center gap-3"><Save size={18} /> 保存并更新协议</button>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                 <button onClick={() => setShowExportModal(true)} className="w-full p-10 bg-slate-900 text-white rounded-[2rem] flex items-center justify-between group transition-all hover:bg-black">
                    <div className="flex items-center gap-6 text-left">
                      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-orange-400"><Database size={32} /></div>
                      <div>
                        <span className="block text-sm font-black uppercase tracking-[0.2em] mb-1">导出底层源码协议</span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">固化 V{currentVersion} 至本地环境</span>
                      </div>
                    </div>
                    <ChevronRight size={28} className="text-slate-700 group-hover:text-white transition-all group-hover:translate-x-2" />
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white border border-slate-200 rounded-[3rem] w-full max-w-5xl shadow-2xl p-12 flex flex-col gap-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Database size={24}/></div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">全量底层协议固化 (JSON/TS)</h3>
              </div>
              <button onClick={() => setShowExportModal(false)} className="p-3 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><X size={24}/></button>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl text-[11px] font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-3">
               <AlertCircle size={18} /> 源码已自动生成。请将下方内容完整复制，并覆盖工程中的 constants.ts 文件。
            </div>
            <textarea 
              readOnly 
              value={exportConfig()} 
              className="w-full h-[55vh] p-10 bg-slate-50 border border-slate-200 rounded-[2rem] font-mono text-[11px] leading-relaxed text-slate-600 resize-none outline-none shadow-inner"
            />
            <button 
              onClick={() => { 
                navigator.clipboard.writeText(exportConfig()); 
                alert('协议已复制到剪贴板！'); 
                setShowExportModal(false); 
              }} 
              className="py-6 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.3em] hover:bg-black shadow-2xl transition-all flex items-center justify-center gap-4"
            >
              <Download size={20}/> 复制源码内容并关闭
            </button>
          </div>
        </div>
      )}

      {editingTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white border border-slate-200 rounded-[3rem] w-full max-w-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="px-10 py-10 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
               <h3 className="text-xl font-black text-slate-900 tracking-tight">节点协议配置</h3>
               <button onClick={() => setEditingTool(null)} className="p-3 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><X size={24}/></button>
            </div>
            <div className="p-10 space-y-8 overflow-y-auto scrollbar-hide">
              <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">节点标识符</label><input value={editingTool.name} onChange={e => setEditingTool({...editingTool, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-orange-500 text-lg" /></div>
              <div className="space-y-5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">图标协议 (Lucide)</label>
                <div className="grid grid-cols-7 gap-3 bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
                  {PRESET_ICONS.map(icon => (
                    <button key={icon} onClick={() => setEditingTool({...editingTool, iconName: icon})} className={`flex items-center justify-center p-4 rounded-xl transition-all ${editingTool.iconName === icon ? 'bg-orange-500 text-white shadow-xl scale-110' : 'hover:bg-orange-100 text-slate-400'}`}><IconComponent name={icon} className="w-6 h-6" /></button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">归属业务板块</label><select value={editingTool.categoryId} onChange={e => setEditingTool({...editingTool, categoryId: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-orange-500 appearance-none text-slate-700">{categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
                <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">视觉装饰色</label><input type="color" value={editingTool.color} onChange={e => setEditingTool({...editingTool, color: e.target.value})} className="w-full h-[62px] p-1 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer" /></div>
              </div>
              <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">指向端点 (URL)</label><input value={editingTool.url} onChange={e => setEditingTool({...editingTool, url: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-orange-500" /></div>
              <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">功能逻辑定义</label><textarea value={editingTool.description} onChange={e => setEditingTool({...editingTool, description: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none h-32 resize-none leading-relaxed" /></div>
              <div className="flex gap-4 pt-8 sticky bottom-0 bg-white pb-2">
                <button onClick={() => { if(confirm(t.confirmDelete)) { setTools(tools.filter(t => t.id !== editingTool.id)); setEditingTool(null); } }} className="px-8 py-5 text-red-500 font-black text-xs uppercase hover:bg-red-50 rounded-2xl tracking-widest">销毁节点</button>
                <button onClick={() => { setTools(tools.map(t => t.id === editingTool.id ? editingTool : t)); setEditingTool(null); }} className="flex-1 py-5 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-orange-600 shadow-2xl shadow-orange-500/20">更新协议参数</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
          <div className="bg-white border border-slate-200 rounded-[3rem] p-16 w-full max-w-xl shadow-2xl text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
             <div className="w-28 h-28 bg-orange-50 text-orange-600 rounded-[2.5rem] flex items-center justify-center mb-12 mx-auto shadow-inner"><Sparkles size={56} className="animate-pulse" /></div>
             <h3 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">底层核心协议升级</h3>
             <p className="text-slate-500 font-bold mb-14 text-sm leading-relaxed uppercase tracking-[0.1em]">检测到新的核心预设 (V{PORTAL_VERSION})，是否立即执行同步操作以更新本地工作环境？</p>
             <button onClick={handleSyncUpdate} className="w-full py-7 bg-orange-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-orange-500/20 hover:bg-orange-600 transition-all flex items-center justify-center gap-4">
               <RefreshCw size={22} className="animate-spin-slow"/> 执行协议同步
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
