
import React from 'react';
import { AccuracyIcon, FluencyIcon, StyleIcon } from './Icons';

interface ReviewSubPanelProps {
    title: string;
    content: string;
    icon: React.ReactNode;
}

const ReviewSubPanel: React.FC<ReviewSubPanelProps> = ({ title, content, icon }) => (
    <div>
        <div className="flex items-center gap-2 mb-2">
            {icon}
            <h4 className="font-semibold text-sm text-cyan-300">{title}</h4>
        </div>
        <p className="text-slate-300 whitespace-pre-wrap font-light text-xs pl-6 border-l-2 border-slate-700">{content}</p>
    </div>
);


const LoadingSkeleton: React.FC = () => (
    <div className="space-y-4 animate-pulse">
         <div className="space-y-2">
            <div className="h-4 bg-slate-700 rounded w-1/3"></div>
            <div className="h-3 bg-slate-700 rounded w-3/4 ml-6"></div>
            <div className="h-3 bg-slate-700 rounded w-full ml-6"></div>
        </div>
        <div className="space-y-2">
            <div className="h-4 bg-slate-700 rounded w-1/3"></div>
            <div className="h-3 bg-slate-700 rounded w-3/4 ml-6"></div>
        </div>
         <div className="space-y-2">
            <div className="h-4 bg-slate-700 rounded w-1/3"></div>
            <div className="h-3 bg-slate-700 rounded w-5/6 ml-6"></div>
        </div>
    </div>
);

interface ReviewPanelProps {
    fluency: string;
    accuracy: string;
    style: string;
    isLoading: boolean;
}

export const ReviewPanel: React.FC<ReviewPanelProps> = ({ fluency, accuracy, style, isLoading }) => {
    const hasContent = fluency || accuracy || style;
    return (
        <div className="flex flex-col h-full bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 p-4 border-b border-slate-700 bg-slate-800 rounded-t-xl">
                 <div className="flex items-center justify-center h-8 w-8 rounded-full bg-cyan-600 text-white font-bold">
                    2
                </div>
                <h3 className="font-semibold text-slate-200">2. Multi-Agent Peer Review</h3>
            </div>
            <div className="p-4 flex-grow min-h-[200px] overflow-y-auto">
                {isLoading ? (
                    <LoadingSkeleton />
                ) : hasContent ? (
                    <div className="space-y-6">
                        <ReviewSubPanel title="Fluency & Authenticity" content={fluency} icon={<FluencyIcon />} />
                        <ReviewSubPanel title="Accuracy & Logic" content={accuracy} icon={<AccuracyIcon />} />
                        <ReviewSubPanel title="Style & Audience" content={style} icon={<StyleIcon />} />
                    </div>
                ) : (
                     <div className="flex items-center justify-center h-full">
                        <p className="text-slate-500 italic">Awaiting preliminary translation...</p>
                    </div>
                )}
            </div>
        </div>
    );
};
