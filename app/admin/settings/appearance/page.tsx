"use client";

import { useState, useEffect } from "react";
import { useAdminTheme, PRESET_THEMES, ThemeColors } from "@/components/admin/admin-theme-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Palette, Settings2 } from "lucide-react";

export default function AppearanceSettingsPage() {
  const { theme, setTheme, customColors, setCustomColors } = useAdminTheme();
  const [localColors, setLocalColors] = useState<ThemeColors>(
    customColors || PRESET_THEMES[theme !== "custom" ? theme : "purple"] || PRESET_THEMES.purple
  );

  useEffect(() => {
    if (customColors) {
      setLocalColors(customColors);
    } else if (theme !== "custom" && PRESET_THEMES[theme]) {
      setLocalColors(PRESET_THEMES[theme]);
    }
  }, [theme, customColors]);

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setLocalColors(prev => ({ ...prev, [key]: value }));
  };

  const applyCustomTheme = () => {
    setCustomColors(localColors);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-800">Appearance & Theming</h3>
        <p className="text-sm text-slate-500">
          Customize the look and feel of the admin panel.
        </p>
      </div>

      <Card className="border-none shadow-sm shadow-slate-200/50 rounded-[24px] overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-100 pb-5">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Palette className="h-5 w-5 text-indigo-500" />
            Preset Themes
          </CardTitle>
          <CardDescription className="text-slate-500">
            Select a predefined color palette for the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(PRESET_THEMES).map(([key, colors]) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={`
                  relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-300 group hover:-translate-y-1
                  ${theme === key ? 'border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-100/50' : 'border-slate-100 hover:border-indigo-200 bg-white hover:shadow-sm'}
                `}
              >
                <div 
                  className="w-14 h-14 rounded-full mb-3 shadow-md shadow-black/10 border-4 border-white transition-transform group-hover:scale-110" 
                  style={{ background: colors.sidebarBg }}
                />
                <span className={`text-sm font-bold capitalize ${theme === key ? 'text-indigo-900' : 'text-slate-600'}`}>{key}</span>
                {theme === key && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-600 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="h-4 w-4 text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm shadow-slate-200/50 rounded-[24px] overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-100 pb-5">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Settings2 className="h-5 w-5 text-indigo-500" />
            Custom Colors
          </CardTitle>
          <CardDescription className="text-slate-500">
            Create your own custom theme by selecting individual colors.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold">Primary Color</Label>
              <div className="flex items-center gap-3">
                <Input 
                  type="color" 
                  value={localColors.primary} 
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-14 h-14 p-1 cursor-pointer rounded-xl border-slate-200"
                />
                <Input 
                  type="text" 
                  value={localColors.primary} 
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="flex-1 h-14 rounded-xl border-slate-200 bg-slate-50 font-mono"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-slate-700 font-semibold">Sidebar Background</Label>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`h-7 text-xs rounded-full ${!localColors.sidebarBg.includes('gradient') ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : ''}`}
                    onClick={() => {
                      const hex = localColors.sidebarBg.match(/#[0-9a-fA-F]{6}/)?.[0] || '#4c3c92';
                      handleColorChange('sidebarBg', hex);
                    }}
                  >
                    Solid
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`h-7 text-xs rounded-full ${localColors.sidebarBg.includes('gradient') ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : ''}`}
                    onClick={() => {
                      const hex = localColors.sidebarBg.match(/#[0-9a-fA-F]{6}/)?.[0] || '#4c3c92';
                      handleColorChange('sidebarBg', `linear-gradient(135deg, ${hex} 0%, #312e81 100%)`);
                    }}
                  >
                    Gradient
                  </Button>
                </div>
              </div>

              {!localColors.sidebarBg.includes('gradient') ? (
                <div className="flex items-center gap-3">
                  <Input 
                    type="color" 
                    value={localColors.sidebarBg.startsWith('#') ? localColors.sidebarBg : '#4c3c92'} 
                    onChange={(e) => handleColorChange('sidebarBg', e.target.value)}
                    className="w-14 h-14 p-1 cursor-pointer rounded-xl border-slate-200"
                  />
                  <Input 
                    type="text" 
                    value={localColors.sidebarBg} 
                    onChange={(e) => handleColorChange('sidebarBg', e.target.value)}
                    className="flex-1 h-14 rounded-xl border-slate-200 bg-slate-50 font-mono"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div className="w-full h-10 rounded-xl shadow-inner" style={{ background: localColors.sidebarBg }} />
                  
                  {(() => {
                    // Helper to parse gradient string
                    const css = localColors.sidebarBg;
                    const isRadial = css.includes('radial');
                    const angleMatch = css.match(/linear-gradient\((\d+)deg/);
                    const angle = angleMatch ? angleMatch[1] : '135';
                    
                    const stops = css.match(/#[0-9a-fA-F]{6}\s+\d+%/g);
                    let startColor = '#4c3c92', startPos = '0', endColor = '#312e81', endPos = '100';
                    
                    if (stops && stops.length >= 2) {
                      const s1 = stops[0].split(/\s+/);
                      startColor = s1[0];
                      startPos = s1[1].replace('%', '');
                      
                      const s2 = stops[1].split(/\s+/);
                      endColor = s2[0];
                      endPos = s2[1].replace('%', '');
                    } else {
                      const colors = css.match(/#[0-9a-fA-F]{6}/g);
                      if (colors && colors.length >= 2) {
                        startColor = colors[0];
                        endColor = colors[1];
                      }
                    }

                    const updateGradient = (updates: Record<string, unknown>) => {
                      const newState = { isRadial, angle, startColor, startPos, endColor, endPos, ...updates };
                      const newCss = newState.isRadial 
                        ? `radial-gradient(circle at center, ${newState.startColor} ${newState.startPos}%, ${newState.endColor} ${newState.endPos}%)`
                        : `linear-gradient(${newState.angle}deg, ${newState.startColor} ${newState.startPos}%, ${newState.endColor} ${newState.endPos}%)`;
                      handleColorChange('sidebarBg', newCss);
                    };

                    return (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-[11px] font-bold text-slate-500 uppercase">Style</Label>
                          <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200">
                            <button 
                              className={`px-3 py-1 text-xs font-semibold rounded-md ${!isRadial ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
                              onClick={() => updateGradient({ isRadial: false })}
                            >
                              Linear
                            </button>
                            <button 
                              className={`px-3 py-1 text-xs font-semibold rounded-md ${isRadial ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
                              onClick={() => updateGradient({ isRadial: true })}
                            >
                              Radial
                            </button>
                          </div>
                        </div>

                        {!isRadial && (
                          <div className="flex items-center justify-between gap-4">
                            <Label className="text-[11px] font-bold text-slate-500 uppercase whitespace-nowrap">Rotation ({angle}°)</Label>
                            <input 
                              type="range" 
                              min="0" max="360" 
                              value={angle}
                              onChange={(e) => updateGradient({ angle: e.target.value })}
                              className="w-full accent-indigo-600"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mt-2">
                          {/* Start Color Group */}
                          <div className="space-y-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center">
                              <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Start Color</Label>
                              <span className="text-[10px] font-mono font-bold text-slate-400">{startPos}%</span>
                            </div>
                            <Input 
                              type="color" 
                              value={startColor} 
                              onChange={(e) => updateGradient({ startColor: e.target.value })}
                              className="w-full h-8 p-0 cursor-pointer rounded border-none shadow-none"
                            />
                            <input 
                              type="range" 
                              min="0" max="100" 
                              value={startPos}
                              onChange={(e) => updateGradient({ startPos: e.target.value })}
                              className="w-full accent-indigo-600 h-1"
                            />
                          </div>
                          
                          {/* End Color Group */}
                          <div className="space-y-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center">
                              <Label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">End Color</Label>
                              <span className="text-[10px] font-mono font-bold text-slate-400">{endPos}%</span>
                            </div>
                            <Input 
                              type="color" 
                              value={endColor} 
                              onChange={(e) => updateGradient({ endColor: e.target.value })}
                              className="w-full h-8 p-0 cursor-pointer rounded border-none shadow-none"
                            />
                            <input 
                              type="range" 
                              min="0" max="100" 
                              value={endPos}
                              onChange={(e) => updateGradient({ endPos: e.target.value })}
                              className="w-full accent-indigo-600 h-1"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold">Sidebar Text Color</Label>
              <div className="flex items-center gap-3">
                <Input 
                  type="color" 
                  value={localColors.sidebarText} 
                  onChange={(e) => handleColorChange('sidebarText', e.target.value)}
                  className="w-14 h-14 p-1 cursor-pointer rounded-xl border-slate-200"
                />
                <Input 
                  type="text" 
                  value={localColors.sidebarText} 
                  onChange={(e) => handleColorChange('sidebarText', e.target.value)}
                  className="flex-1 h-14 rounded-xl border-slate-200 bg-slate-50 font-mono"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold">Sidebar Active Menu Background</Label>
              <div className="flex items-center gap-3">
                <Input 
                  type="color" 
                  value={localColors.sidebarActiveBg} 
                  onChange={(e) => handleColorChange('sidebarActiveBg', e.target.value)}
                  className="w-14 h-14 p-1 cursor-pointer rounded-xl border-slate-200"
                />
                <Input 
                  type="text" 
                  value={localColors.sidebarActiveBg} 
                  onChange={(e) => handleColorChange('sidebarActiveBg', e.target.value)}
                  className="flex-1 h-14 rounded-xl border-slate-200 bg-slate-50 font-mono"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold">Sidebar Active Menu Text</Label>
              <div className="flex items-center gap-3">
                <Input 
                  type="color" 
                  value={localColors.sidebarActiveText} 
                  onChange={(e) => handleColorChange('sidebarActiveText', e.target.value)}
                  className="w-14 h-14 p-1 cursor-pointer rounded-xl border-slate-200"
                />
                <Input 
                  type="text" 
                  value={localColors.sidebarActiveText} 
                  onChange={(e) => handleColorChange('sidebarActiveText', e.target.value)}
                  className="flex-1 h-14 rounded-xl border-slate-200 bg-slate-50 font-mono"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
          <Button 
            onClick={applyCustomTheme}
            className="rounded-xl h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-200 hover:-translate-y-0.5 transition-all"
          >
            Apply Custom Theme
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
