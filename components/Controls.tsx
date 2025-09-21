
import React from 'react';
import type { LoadingStates, CompletionStates } from '../types';
import { ArrowIcon, CheckIcon } from './Icons';

interface ControlsProps {
  onTranslate: () => void;
  onReview: () => void;
  onSynthesize: () => void;
  onPolish: () => void;
  loadingStates: LoadingStates;
  completionStates: CompletionStates;
}

const ActionButton: React.FC<{
    onClick: () => void;
    isLoading: boolean;
    isDisabled: boolean;
    isComplete: boolean;
    label: string;
}> = ({ onClick, isLoading, isDisabled, isComplete, label }) => (
    <button
        onClick={onClick}
        disabled={isLoading || isDisabled}
        className={`relative w-full sm:w-auto flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
            ${isComplete ? 'bg-emerald-600 text-white' : 'bg-cyan-600 hover:bg-cyan-500 text-white'}
            ${(isLoading || isDisabled) ? 'opacity-50 cursor-not-allowed' : ''}
            ${isLoading ? 'animate-pulse-fast' : ''}`}
    >
        {isComplete && !isLoading && (
            <span className="absolute left-2 top-1/2 -translate-y-1/2"><CheckIcon /></span>
        )}
        {isLoading ? 'Processing...' : label}
    </button>
);


export const Controls: React.FC<ControlsProps> = ({ 
    onTranslate, 
    onReview, 
    onSynthesize, 
    onPolish, 
    loadingStates,
    completionStates,
}) => (
    <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-4 w-full max-w-4xl">
            <ActionButton 
                onClick={onTranslate}
                isLoading={loadingStates.translation}
                isDisabled={!completionStates.step1}
                isComplete={completionStates.step2}
                label="1. Translate"
            />
            <ArrowIcon className="hidden sm:block text-slate-500" />
            <ActionButton 
                onClick={onReview}
                isLoading={loadingStates.review}
                isDisabled={!completionStates.step2}
                isComplete={completionStates.step3}
                label="2. Review"
            />
            <ArrowIcon className="hidden sm:block text-slate-500" />
            <ActionButton 
                onClick={onSynthesize}
                isLoading={loadingStates.synthesis}
                isDisabled={!completionStates.step3}
                isComplete={completionStates.step4}
                label="3. Synthesize"
            />
            <ArrowIcon className="hidden sm:block text-slate-500" />
            <ActionButton 
                onClick={onPolish}
                isLoading={loadingStates.polish}
                isDisabled={!completionStates.step4}
                isComplete={completionStates.step5}
                label="4. Polish"
            />
        </div>
    </div>
);
