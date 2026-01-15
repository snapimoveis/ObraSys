import React, { useState } from 'react';
import { BudgetChapter, BudgetSubChapter, BudgetItem, BudgetStatus } from '../../types';
import { formatCurrency } from '../../utils/budgetUtils';
import { ChevronDown, ChevronRight, FolderPlus, Trash2, Plus, Layers, MoreVertical } from 'lucide-react';
import BudgetItemRow from './BudgetItemRow';

interface BudgetChapterProps {
  chapter: BudgetChapter;
  status: BudgetStatus;
  onUpdateChapter: (id: string, name: string) => void;
  onAddSubChapter: (chapterId: string) => void;
  onAddItem: (chapterId: string, subChapterId?: string) => void;
  onUpdateItem: (item: BudgetItem) => void;
  onDeleteItem: (itemId: string) => void;
  onOpenItemDetail: (item: BudgetItem) => void;
}

const BudgetChapterComponent: React.FC<BudgetChapterProps> = ({
  chapter,
  status,
  onUpdateChapter,
  onAddSubChapter,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onOpenItemDetail
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const isEditable = status === 'DRAFT';

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mb-4">
      {/* Chapter Header */}
      <div className="bg-slate-100 p-3 flex justify-between items-center border-b border-slate-200 group">
        <div className="flex items-center gap-2 flex-1">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors"
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <input 
            className="font-bold text-slate-800 bg-transparent outline-none focus:bg-white focus:ring-1 focus:ring-[#00609C] px-1 rounded w-full disabled:text-slate-600"
            value={chapter.name}
            disabled={!isEditable}
            onChange={(e) => onUpdateChapter(chapter.id, e.target.value)}
            placeholder="Nome do Capítulo"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
             <span className="font-bold text-slate-800">{formatCurrency(chapter.totalPrice)}</span>
          </div>
          {isEditable && (
            <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
              <button 
                onClick={() => onAddSubChapter(chapter.id)}
                className="p-1.5 bg-white border border-slate-200 rounded hover:text-[#00609C] text-slate-500" 
                title="Adicionar Subcapítulo"
              >
                <FolderPlus size={14}/>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chapter Body */}
      {isExpanded && (
        <div className="animate-fade-in">
          
          {/* SubChapters Render */}
          {chapter.subChapters.map(sub => (
             <div key={sub.id} className="border-b border-slate-100 bg-slate-50/30">
                 <div className="flex justify-between items-center py-2 px-3 pl-10 group hover:bg-slate-100 transition-colors border-b border-slate-100">
                     <div className="flex items-center gap-2 flex-1">
                         <Layers size={14} className="text-slate-400" />
                         <span className="font-semibold text-slate-700 text-sm">{sub.name}</span>
                     </div>
                     <div className="flex items-center gap-4 pr-2">
                          <span className="font-semibold text-slate-700 text-sm">{formatCurrency(sub.totalPrice)}</span>
                          {isEditable && (
                            <button 
                              onClick={() => onAddItem(chapter.id, sub.id)}
                              className="text-xs flex items-center gap-1 text-[#00609C] hover:underline font-medium opacity-0 group-hover:opacity-100"
                            >
                                <Plus size={12} /> Artigo
                            </button>
                          )}
                     </div>
                 </div>
                 
                 {/* SubItems */}
                 <div>
                    {sub.items.map(item => (
                      <BudgetItemRow
                        key={item.id}
                        item={item}
                        status={status}
                        onUpdate={onUpdateItem}
                        onDelete={onDeleteItem}
                        onOpenDetail={onOpenItemDetail}
                      />
                    ))}
                    {sub.items.length === 0 && (
                      <div className="p-2 text-center text-xs text-slate-400 italic">Sem artigos neste subcapítulo</div>
                    )}
                 </div>
             </div>
          ))}

          {/* Direct Items */}
          {chapter.items.map(item => (
            <BudgetItemRow
              key={item.id}
              item={item}
              status={status}
              onUpdate={onUpdateItem}
              onDelete={onDeleteItem}
              onOpenDetail={onOpenItemDetail}
            />
          ))}

          {/* Add Direct Item Action */}
          {isEditable && (
            <div 
              className="p-2 pl-10 bg-white hover:bg-slate-50 cursor-pointer transition-colors border-t border-slate-100 group" 
              onClick={() => onAddItem(chapter.id)}
            >
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 group-hover:text-[#00609C]">
                <Plus size={14} /> Adicionar Artigo ao Capítulo
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BudgetChapterComponent;
