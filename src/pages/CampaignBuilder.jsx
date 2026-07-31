import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Save, 
  ChevronDown, 
  Plus, 
  Layout, 
  Type, 
  Image as ImageIcon, 
  Play, 
  Square,
  MousePointer2,
  Trash2,
  Settings,
  Share2
} from 'lucide-react';

const BUILDER_ELEMENTS = [
  { id: 'heading', name: 'Heading', icon: <Type size={18} /> },
  { id: 'text', name: 'Text Editor', icon: <Layout size={18} /> },
  { id: 'button', name: 'Button', icon: <MousePointer2 size={18} /> },
  { id: 'image', name: 'Image', icon: <ImageIcon size={18} /> },
  { id: 'video', name: 'Video', icon: <Play size={18} /> },
  { id: 'form', name: 'Form', icon: <Square size={18} /> },
];

export default function CampaignBuilder() {
  const navigate = useNavigate();
  const [viewport, setViewport] = useState('desktop');
  const [elements, setElements] = useState([
    { id: '1', type: 'heading', content: 'Launch Your Dream Business', style: { fontSize: '40px', fontWeight: '800', textAlign: 'center' } }
  ]);
  const [selectedId, setSelectedId] = useState('1');

  const addElement = (type) => {
    const newEl = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: type === 'heading' ? 'New Heading' : 'New Content',
      style: { fontSize: '16px', fontWeight: '400', textAlign: 'left' }
    };
    setElements([...elements, newEl]);
    setSelectedId(newEl.id);
  };

  const removeElement = (id) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const selectedElement = elements.find(el => el.id === selectedId);

  const handlePublish = () => {
    navigate('/dashboard/campaign/publish', { state: { elements } });
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Campaign Landing Page</h1>
        </div>

        <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
           <button 
            onClick={() => setViewport('desktop')}
            className={`p-3 rounded-lg transition-all ${viewport === 'desktop' ? 'bg-white shadow-md text-yellow-600' : 'text-gray-400 hover:text-gray-900'}`}
           >
            <Monitor size={20} />
           </button>
           <button 
            onClick={() => setViewport('tablet')}
            className={`p-3 rounded-lg transition-all ${viewport === 'tablet' ? 'bg-white shadow-md text-yellow-600' : 'text-gray-400 hover:text-gray-900'}`}
           >
            <Tablet size={20} />
           </button>
           <button 
            onClick={() => setViewport('mobile')}
            className={`p-3 rounded-lg transition-all ${viewport === 'mobile' ? 'bg-white shadow-md text-yellow-600' : 'text-gray-400 hover:text-gray-900'}`}
           >
            <Smartphone size={20} />
           </button>
        </div>

        <div className="flex items-center gap-4">
           <button className="px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-2">
             <Save size={18} /> Save
           </button>
           <button 
            onClick={handlePublish}
            className="px-10 py-3 rounded-xl font-black text-sm uppercase tracking-widest bg-yellow-500 text-black hover:bg-yellow-600 transition-all shadow-lg flex items-center gap-2"
           >
             Publish
           </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Elements */}
        <aside className="w-80 bg-white border-r border-gray-100 flex flex-col overflow-y-auto">
          <div className="p-6">
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Add Element</h2>
               <ChevronDown size={14} className="text-gray-400" />
             </div>
             
             <div className="space-y-6">
                <div>
                  <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all group">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-yellow-600 transition-all border border-gray-100">
                          <Layout size={18} />
                        </div>
                        <span className="font-bold text-sm text-gray-900">Structures</span>
                     </div>
                     <ChevronDown size={14} className="text-gray-400" />
                  </button>
                  <div className="grid grid-cols-2 gap-3 mt-4 px-2">
                     {['Container', 'Grid', 'Slider'].map(s => (
                       <button key={s} className="p-4 rounded-xl border border-gray-100 text-center font-bold text-[10px] uppercase tracking-widest text-gray-400 hover:border-yellow-500 hover:text-gray-900 transition-all bg-white">{s}</button>
                     ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50">
                  <div className="flex items-center justify-between mb-4">
                     <span className="font-bold text-sm text-gray-900">Elements</span>
                     <ChevronDown size={14} className="text-gray-400" />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {BUILDER_ELEMENTS.map(el => (
                      <button 
                        key={el.id}
                        onClick={() => addElement(el.id)}
                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-yellow-200 hover:bg-yellow-50/10 transition-all text-left font-bold text-sm group"
                      >
                         <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-yellow-600 border border-gray-100">
                           {el.icon}
                         </div>
                         <span className="text-gray-400 group-hover:text-gray-900">{el.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
             </div>
          </div>
        </aside>

        {/* Center: Preview Workspace */}
        <main className="flex-1 bg-gray-100 relative p-12 flex justify-center overflow-y-auto custom-scrollbar">
           <div 
            className={`bg-white shadow-2xl transition-all duration-500 rounded-[2.5rem] relative overflow-hidden flex flex-col min-h-full ${
              viewport === 'desktop' ? 'w-full' :
              viewport === 'tablet' ? 'w-[768px]' : 'w-[375px]'
            }`}
           >
              {/* Fake Mobile Status Bar if in Mobile View */}
              {viewport === 'mobile' && (
                <div className="h-8 bg-gray-50 flex justify-between px-6 items-center">
                  <span className="text-[10px] font-black">9:41</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                  </div>
                </div>
              )}

              <div className="p-12 space-y-12">
                 {elements.length === 0 ? (
                    <div className="h-64 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center gap-4 text-gray-300">
                       <Plus size={40} />
                       <span className="font-black uppercase tracking-widest text-xs">Add Element</span>
                    </div>
                 ) : (
                   elements.map(el => (
                     <div 
                      key={el.id} 
                      onClick={(e) => { e.stopPropagation(); setSelectedId(el.id); }}
                      className={`relative p-8 rounded-[1.5rem] cursor-pointer transition-all border-2 ${
                        selectedId === el.id ? 'border-yellow-400 ring-4 ring-yellow-400/10' : 'border-transparent hover:border-gray-100 hover:bg-gray-50/30'
                      }`}
                     >
                       {selectedId === el.id && (
                         <div className="absolute -top-4 -right-4 flex gap-2">
                           <button onClick={(e) => { e.stopPropagation(); removeElement(el.id); }} className="p-3 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all rotate-3 active:scale-90">
                             <Trash2 size={16} />
                           </button>
                         </div>
                       )}

                       {el.type === 'heading' && (
                         <h2 style={{ ...el.style }} className="focus:outline-none">
                           {el.content}
                         </h2>
                       )}
                       {el.type === 'image' && (
                         <div className="aspect-[16/9] bg-gray-100 rounded-3xl flex items-center justify-center text-gray-300">
                           <ImageIcon size={48} strokeWidth={1} />
                         </div>
                       )}
                       {el.type === 'form' && (
                         <div className="space-y-4">
                            <div className="h-[1px] bg-gray-100 w-full" />
                            <div className="h-10 bg-gray-50 rounded-lg w-full" />
                            <div className="h-10 bg-gray-50 rounded-lg w-full" />
                            <div className="h-12 bg-yellow-500/20 rounded-lg w-32" />
                         </div>
                       )}
                     </div>
                   ))
                 )}
              </div>
           </div>
        </main>

        {/* Right Sidebar: Styles */}
        <aside className="w-80 bg-white border-l border-gray-100 flex flex-col">
          <div className="p-8">
             <div className="flex items-center gap-3 mb-10 text-gray-400">
                <Settings size={18} />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Styles</h2>
                <ChevronDown size={14} className="ml-auto" />
             </div>

             {selectedElement ? (
               <div className="space-y-8 animate-in fade-in duration-300">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                       <label className="text-sm font-bold text-gray-500 tracking-tight">Color</label>
                       <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-md bg-black border border-gray-200" />
                         <span className="text-xs font-black">#000000</span>
                       </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                       <label className="text-sm font-bold text-gray-500 tracking-tight">Font Size</label>
                       <span className="text-xs font-black px-3 py-1 bg-gray-50 rounded-lg uppercase tracking-widest">{selectedElement.style.fontSize}</span>
                    </div>
                    <input type="range" className="w-full accent-yellow-500" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                       <label className="text-sm font-bold text-gray-500 tracking-tight">Font Weight</label>
                       <span className="text-xs font-black px-3 py-1 bg-gray-50 rounded-lg uppercase tracking-widest">{selectedElement.style.fontWeight}</span>
                    </div>
                    <select className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 font-bold text-sm">
                       <option>400 - Normal</option>
                       <option>600 - SemiBold</option>
                       <option>800 - ExtraBold</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-500 tracking-tight mb-4">Font Family</label>
                    <div className="p-5 rounded-[1.5rem] bg-gray-50/50 border border-yellow-500 shadow-sm flex items-center justify-between">
                       <span className="font-black text-sm tracking-tight">Inter</span>
                       <ChevronDown size={14} className="text-gray-400" />
                    </div>
                  </div>
               </div>
             ) : (
               <div className="text-center py-20">
                  <MousePointer2 size={32} className="mx-auto text-gray-100 mb-4" strokeWidth={1} />
                  <p className="text-xs font-black uppercase tracking-widest text-gray-300">Select an element to edit</p>
               </div>
             )}
          </div>

          <div className="mt-auto p-8 border-t border-gray-50">
             <button className="w-full flex items-center justify-center gap-2 p-5 rounded-2xl bg-gray-900 text-white font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl">
               <Share2 size={16} /> Preview Link
             </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
