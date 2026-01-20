import React, { useState } from 'react';
import { Save, Upload, Plus, Trash2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useImageUpload } from '../hooks/useImageUpload';
import { WifiStep, Router } from '../types';

const SiteSettingsManager: React.FC = () => {
  const { siteSettings, loading, updateSiteSettings } = useSiteSettings();
  const { uploadImage, uploading } = useImageUpload();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    menu_title: '',
    menu_description: '',
    currency: '',
    currency_code: '',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  const [wifiRouters, setWifiRouters] = useState<Router[]>([]);
  const [editingRouterId, setEditingRouterId] = useState<string | null>(null);

  React.useEffect(() => {
    if (siteSettings) {
      setFormData({
        site_name: siteSettings.site_name || '',
        site_description: siteSettings.site_description || '',
        menu_title: siteSettings.menu_title || '',
        menu_description: siteSettings.menu_description || '',
        currency: siteSettings.currency || '',
        currency_code: siteSettings.currency_code || '',
      });
      setLogoPreview(siteSettings.site_logo || '');
      setWifiRouters(siteSettings.wifi_routers || []);
    }
  }, [siteSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddRouter = () => {
    const newRouter: Router = {
      id: `router-${Date.now()}`,
      name: 'New Router Model',
      image: '',
      steps: []
    };
    setWifiRouters(prev => [...prev, newRouter]);
    setEditingRouterId(newRouter.id);
  };

  const handleRemoveRouter = (id: string) => {
    if (confirm('Are you sure you want to remove this router and all its steps?')) {
      setWifiRouters(prev => prev.filter(r => r.id !== id));
      if (editingRouterId === id) setEditingRouterId(null);
    }
  };

  const handleUpdateRouter = (id: string, updates: Partial<Router>) => {
    setWifiRouters(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const handleAddStep = (routerId: string) => {
    const newStep: WifiStep = {
      id: `step-${Date.now()}`,
      text: '',
      image: ''
    };
    setWifiRouters(prev => prev.map(r => {
      if (r.id === routerId) {
        return { ...r, steps: [...r.steps, newStep] };
      }
      return r;
    }));
  };

  const handleRemoveStep = (routerId: string, stepId: string) => {
    setWifiRouters(prev => prev.map(r => {
      if (r.id === routerId) {
        return { ...r, steps: r.steps.filter(s => s.id !== stepId) };
      }
      return r;
    }));
  };

  const handleStepChange = (routerId: string, stepId: string, text: string) => {
    setWifiRouters(prev => prev.map(r => {
      if (r.id === routerId) {
        return {
          ...r,
          steps: r.steps.map(s => s.id === stepId ? { ...s, text } : s)
        };
      }
      return r;
    }));
  };

  const handleRouterImageChange = async (routerId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isEditing) setIsEditing(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        handleUpdateRouter(routerId, { image: e.target?.result as string, imageFile: file } as any);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStepImageChange = async (routerId: string, stepId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isEditing) setIsEditing(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setWifiRouters(prev => prev.map(r => {
          if (r.id === routerId) {
            return {
              ...r,
              steps: r.steps.map(s => s.id === stepId ? { ...s, image: e.target?.result as string, imageFile: file } as any : s)
            };
          }
          return r;
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      let logoUrl = logoPreview;
      if (logoFile) {
        logoUrl = await uploadImage(logoFile);
      }

      const processedRouters = [];
      for (const router of wifiRouters) {
        let routerImageUrl = router.image;
        if ((router as any).imageFile) {
          routerImageUrl = await uploadImage((router as any).imageFile);
        }

        const processedSteps = [];
        for (const step of router.steps) {
          let stepImageUrl = step.image;
          if ((step as any).imageFile) {
            stepImageUrl = await uploadImage((step as any).imageFile);
          }
          const { imageFile, ...stepData } = step as any;
          processedSteps.push({ ...stepData, image: stepImageUrl });
        }

        const { imageFile, ...routerData } = router as any;
        processedRouters.push({ ...routerData, image: routerImageUrl, steps: processedSteps });
      }

      await updateSiteSettings({
        ...formData,
        site_logo: logoUrl,
        wifi_routers: processedRouters
      });

      setIsEditing(false);
      setLogoFile(null);
      setEditingRouterId(null);
    } catch (error) {
      console.error('Error saving site settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  const handleCancel = () => {
    if (siteSettings) {
      setFormData({
        site_name: siteSettings.site_name || '',
        site_description: siteSettings.site_description || '',
        menu_title: siteSettings.menu_title || '',
        menu_description: siteSettings.menu_description || '',
        currency: siteSettings.currency || '',
        currency_code: siteSettings.currency_code || '',
      });
      setLogoPreview(siteSettings.site_logo || '');
      setWifiRouters(siteSettings.wifi_routers || []);
    }
    setIsEditing(false);
    setLogoFile(null);
    setEditingRouterId(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeRouter = wifiRouters.find(r => r.id === editingRouterId);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-sans">Site Settings</h2>
          <p className="text-sm text-gray-500">Manage your business information and Wi-Fi help instructions</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-kg3-orange text-white px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-kg3-orange/20 transition-all duration-200 flex items-center space-x-2 font-semibold"
          >
            <Save className="h-4 w-4" />
            <span>Edit Settings</span>
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-200 transition-all font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={uploading}
              className="bg-kg3-orange text-white px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-kg3-orange/20 transition-all disabled:opacity-50 font-semibold flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{uploading ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-12">
        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-kg3-orange rounded-full"></div>
            Site Branding
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <label className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Logo</label>
              <div className="relative group">
                <div className="w-32 h-32 rounded-3xl overflow-hidden bg-white flex items-center justify-center border-2 border-dashed border-gray-200 shadow-inner">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-4xl">☕</div>
                  )}
                </div>
                {isEditing && (
                  <div className="mt-3">
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" id="logo-upload" />
                    <label htmlFor="logo-upload" className="cursor-pointer bg-white text-gray-700 px-4 py-1.5 rounded-lg border hover:bg-gray-50 text-xs font-semibold shadow-sm inline-flex items-center gap-2 transition-colors">
                      <Upload className="h-3 w-3" /> Upload
                    </label>
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-2 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Site Name</label>
                {isEditing ? (
                  <input type="text" name="site_name" value={formData.site_name} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-kg3-orange/20 focus:border-kg3-orange outline-none transition-all" />
                ) : (
                  <p className="p-3 bg-white rounded-xl border border-gray-100 font-bold text-gray-900">{formData.site_name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Site Description</label>
                {isEditing ? (
                  <textarea name="site_description" value={formData.site_description} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500" rows={3} />
                ) : (
                  <p className="p-2 bg-gray-50 rounded text-gray-600">{formData.site_description}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Currency</label>
                {isEditing ? (
                  <input type="text" name="currency_code" value={formData.currency_code} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-kg3-orange/20 focus:border-kg3-orange outline-none transition-all" />
                ) : (
                  <p className="p-3 bg-white rounded-xl border border-gray-100 text-gray-700">{formData.currency_code}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-kg3-orange rounded-full"></div>
            Menu Page Header
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Title</label>
              {isEditing ? (
                <input type="text" name="menu_title" value={formData.menu_title} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-kg3-orange/20 focus:border-kg3-orange outline-none" placeholder="e.g. Our Offer" />
              ) : (
                <p className="p-3 bg-white rounded-xl border border-gray-100 font-bold text-gray-900">{formData.menu_title}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Description</label>
              {isEditing ? (
                <textarea name="menu_description" value={formData.menu_description} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-kg3-orange/20 focus:border-kg3-orange outline-none" placeholder="Describe your fiber services..." />
              ) : (
                <p className="p-3 bg-white rounded-xl border border-gray-100 text-gray-600 leading-relaxed">{formData.menu_description}</p>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white border-2 border-dashed border-gray-200 rounded-3xl overflow-hidden">
          <div className="bg-gray-50 p-6 flex items-center justify-between border-b border-gray-200">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Wi-Fi Router Models</h3>
              <p className="text-xs text-gray-500">Configure instructions for different router models</p>
            </div>
            <button
              onClick={handleAddRouter}
              className="bg-kg3-orange/10 text-kg3-orange hover:bg-kg3-orange hover:text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 font-bold text-sm"
            >
              <Plus className="h-4 w-4" /> Add Router
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[500px]">
            <div className="lg:col-span-1 border-r border-gray-100 bg-gray-50/30 p-4 space-y-2 max-h-[600px] overflow-y-auto">
              {wifiRouters.length === 0 ? (
                <p className="text-xs text-center text-gray-400 py-8">No routers configured</p>
              ) : (
                wifiRouters.map((router) => (
                  <div
                    key={router.id}
                    onClick={() => setEditingRouterId(router.id)}
                    className={`relative p-3 rounded-xl cursor-pointer transition-all border ${editingRouterId === router.id
                      ? 'bg-white border-kg3-orange shadow-md shadow-kg3-orange/5 ring-1 ring-kg3-orange/20'
                      : 'bg-transparent border-transparent hover:bg-white hover:border-gray-200'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {router.image ? (
                          <img src={router.image} className="w-full h-full object-contain" />
                        ) : (
                          <div className="text-[10px] text-gray-400 italic">No Pic</div>
                        )}
                      </div>
                      <span className={`text-sm font-bold truncate ${editingRouterId === router.id ? 'text-kg3-orange' : 'text-gray-700'}`}>
                        {router.name || 'Untitled'}
                      </span>
                    </div>
                    {editingRouterId === router.id && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <ChevronRight className="h-4 w-4 text-kg3-orange" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="lg:col-span-4 p-8 bg-white">
              {activeRouter ? (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h4 className="text-xl font-bold text-gray-900">Editing {activeRouter.name}</h4>
                    <button
                      onClick={() => handleRemoveRouter(activeRouter.id)}
                      className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Router"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase">Model Name</label>
                      <input
                        type="text"
                        value={activeRouter.name}
                        onChange={(e) => handleUpdateRouter(activeRouter.id, { name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-kg3-orange/20 focus:border-kg3-orange outline-none"
                        placeholder="e.g. Huawei Pro v3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase text-center">Reference Image</label>
                      <div className="flex items-center justify-center gap-4">
                        <div className="w-20 h-20 rounded-xl border flex items-center justify-center bg-gray-50 overflow-hidden shadow-inner">
                          {activeRouter.image ? (
                            <img src={activeRouter.image} className="max-w-full max-h-full object-contain" />
                          ) : (
                            <div className="text-xs text-gray-400">No Image</div>
                          )}
                        </div>
                        <div>
                          <input
                            type="file"
                            id={`router-img-${activeRouter.id}`}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleRouterImageChange(activeRouter.id, e)}
                          />
                          <label htmlFor={`router-img-${activeRouter.id}`} className="cursor-pointer bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all font-bold text-xs inline-flex items-center gap-2 border">
                            <Upload className="h-3 w-3" /> Update Pic
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 border-t pt-8">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-gray-900 border-l-4 border-kg3-orange pl-3">Instructional Steps</h5>
                      <button
                        onClick={() => handleAddStep(activeRouter.id)}
                        className="text-sm text-kg3-orange hover:underline font-bold flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" /> Add Step
                      </button>
                    </div>

                    <div className="space-y-4">
                      {activeRouter.steps.map((step, idx) => (
                        <div key={step.id} className="relative bg-gray-50 p-6 rounded-2xl border border-gray-100 group">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-kg3-orange text-white flex items-center justify-center font-bold shadow-md shadow-kg3-orange/20">
                              {idx + 1}
                            </div>
                            <div className="flex-grow space-y-4">
                              <textarea
                                value={step.text}
                                onChange={(e) => handleStepChange(activeRouter.id, step.id, e.target.value)}
                                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-kg3-orange/20 outline-none text-sm"
                                placeholder="Describe the action for this step..."
                                rows={2}
                              />
                              <div className="flex items-center gap-4">
                                <div className="w-24 h-24 rounded-xl border-2 border-white shadow-sm bg-white overflow-hidden flex items-center justify-center">
                                  {step.image ? (
                                    <img src={step.image} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="text-[10px] text-gray-400">Step Image</div>
                                  )}
                                </div>
                                <input
                                  type="file"
                                  id={`step-img-${step.id}`}
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleStepImageChange(activeRouter.id, step.id, e)}
                                />
                                <label htmlFor={`step-img-${step.id}`} className="cursor-pointer text-xs font-bold text-kg3-orange bg-white border border-kg3-orange/30 px-3 py-1.5 rounded-lg hover:bg-kg3-orange hover:text-white transition-all">
                                  {step.image ? 'Change Pic' : 'Add Pic'}
                                </label>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveStep(activeRouter.id, step.id)}
                              className="text-gray-300 hover:text-red-500 p-1 self-start transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {activeRouter.steps.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                          <p className="text-gray-400 text-sm">No steps added yet for this router.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                    <ChevronLeft className="h-8 w-8 text-gray-300" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-400 uppercase tracking-widest">Router Editor</h4>
                  <p className="text-sm text-gray-400 max-w-xs mt-2">Select a router from the list or add a new one to start configuring instructions.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SiteSettingsManager;
