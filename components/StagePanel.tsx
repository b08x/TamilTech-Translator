
import React from 'react';

interface StagePanelProps {
    title: string;
    content: string;
    isLoading: boolean;
    icon: React.ReactNode;
    stageNumber: number;
    isFinal?: boolean;
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
    </div>
);

export const StagePanel: React.FC<StagePanelProps> = ({ title, content, isLoading, icon, stageNumber, isFinal = false }) => {
    return (
        <div className={`flex flex-col h-full bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg transition-all duration-300 ${isFinal ? 'ring-2 ring-emerald-500' : ''}`}>
            <div className={`flex items-center gap-3 p-4 border-b border-slate-700 ${isFinal ? 'bg-emerald-900/50' : 'bg-slate-800'} rounded-t-xl`}>
                <div className={`flex items-center justify-center h-8 w-8 rounded-full ${isFinal ? 'bg-emerald-500' : 'bg-cyan-600'} text-white font-bold`}>
                    {stageNumber + 1}
                </div>
                <h3 className="font-semibold text-slate-200">{title}</h3>
            </div>
            <div className="p-4 flex-grow min-h-[200px] overflow-y-auto">
                {isLoading ? (
                    <LoadingSkeleton />
                ) : content ? (
                    <p className="text-slate-300 whitespace-pre-wrap font-light text-sm">{content}</p>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-slate-500 italic">Awaiting previous step...</p>
                    </div>
                )}
            </div>
        </div>
    );
};
