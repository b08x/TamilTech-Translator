
import React, { useState, useCallback } from 'react';
import { InputPanel } from './components/InputPanel';
import { StagePanel } from './components/StagePanel';
import { ReviewPanel } from './components/ReviewPanel';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { ArrowIcon, BotIcon } from './components/Icons';
import type { PipelineState, LoadingStates, InputType } from './types';
import { 
    getPreliminaryTranslation, 
    getFluencyReview, 
    getAccuracyReview, 
    getStyleReview, 
    synthesizeReviews, 
    getFinalPolish 
} from './services/geminiService';

const initialState: PipelineState = {
    originalText: 'Enter English text here, provide a URL, or upload a file. For example: "The Picture Archiving and Communication System (PACS) is a medical imaging technology which provides economical storage and convenient access to images from multiple modalities. The universal format for PACS image storage and transfer is DICOM (Digital Imaging and Communications in Medicine)."',
    preliminaryTranslation: '',
    fluencyReview: '',
    accuracyReview: '',
    styleReview: '',
    synthesizedText: '',
    finalPolish: '',
};

const initialLoading: LoadingStates = {
    translation: false,
    review: false,
    synthesis: false,
    polish: false,
};

const App: React.FC = () => {
    const [pipelineState, setPipelineState] = useState<PipelineState>(initialState);
    const [loadingStates, setLoadingStates] = useState<LoadingStates>(initialLoading);
    const [error, setError] = useState<string | null>(null);

    const handleTextUpdate = (text: string) => {
        setPipelineState(prevState => ({ ...initialState, originalText: text }));
        setError(null);
    };

    const handleTranslate = useCallback(async () => {
        if (!pipelineState.originalText) return;
        setLoadingStates(prev => ({ ...prev, translation: true }));
        setError(null);
        try {
            const translation = await getPreliminaryTranslation(pipelineState.originalText);
            setPipelineState(prev => ({ ...prev, preliminaryTranslation: translation }));
        } catch (e) {
            setError('Failed to get preliminary translation.');
            console.error(e);
        } finally {
            setLoadingStates(prev => ({ ...prev, translation: false }));
        }
    }, [pipelineState.originalText]);

    const handleReview = useCallback(async () => {
        if (!pipelineState.preliminaryTranslation) return;
        setLoadingStates(prev => ({ ...prev, review: true }));
        setError(null);
        try {
            const [fluency, accuracy, style] = await Promise.all([
                getFluencyReview(pipelineState.preliminaryTranslation, pipelineState.originalText),
                getAccuracyReview(pipelineState.preliminaryTranslation, pipelineState.originalText),
                getStyleReview(pipelineState.preliminaryTranslation, pipelineState.originalText)
            ]);
            setPipelineState(prev => ({
                ...prev,
                fluencyReview: fluency,
                accuracyReview: accuracy,
                styleReview: style,
            }));
        } catch (e) {
            setError('Failed to complete peer review.');
            console.error(e);
        } finally {
            setLoadingStates(prev => ({ ...prev, review: false }));
        }
    }, [pipelineState.originalText, pipelineState.preliminaryTranslation]);

    const handleSynthesize = useCallback(async () => {
        if (!pipelineState.fluencyReview || !pipelineState.accuracyReview || !pipelineState.styleReview) return;
        setLoadingStates(prev => ({ ...prev, synthesis: true }));
        setError(null);
        try {
            const synthesis = await synthesizeReviews(
                pipelineState.originalText,
                pipelineState.preliminaryTranslation,
                pipelineState.fluencyReview,
                pipelineState.accuracyReview,
                pipelineState.styleReview
            );
            setPipelineState(prev => ({ ...prev, synthesizedText: synthesis }));
        } catch (e) {
            setError('Failed to synthesize reviews.');
            console.error(e);
        } finally {
            setLoadingStates(prev => ({ ...prev, synthesis: false }));
        }
    }, [pipelineState]);

    const handlePolish = useCallback(async () => {
        if (!pipelineState.synthesizedText) return;
        setLoadingStates(prev => ({ ...prev, polish: true }));
        setError(null);
        try {
            const polish = await getFinalPolish(pipelineState.synthesizedText);
            setPipelineState(prev => ({ ...prev, finalPolish: polish }));
        } catch (e) {
            setError('Failed to perform final polish.');
            console.error(e);
        } finally {
            setLoadingStates(prev => ({ ...prev, polish: false }));
        }
    }, [pipelineState.synthesizedText]);
    
    const isStep1Complete = pipelineState.originalText.length > 0;
    const isStep2Complete = pipelineState.preliminaryTranslation.length > 0;
    const isStep3Complete = pipelineState.fluencyReview.length > 0 && pipelineState.accuracyReview.length > 0 && pipelineState.styleReview.length > 0;
    const isStep4Complete = pipelineState.synthesizedText.length > 0;
    const isStep5Complete = pipelineState.finalPolish.length > 0;

    return (
        <div className="min-h-screen bg-slate-900 font-sans p-4 lg:p-8">
            <Header />
            
            <InputPanel onTextUpdate={handleTextUpdate} initialText={pipelineState.originalText} />

            {error && <div className="my-4 p-4 bg-red-900/50 text-red-300 border border-red-700 rounded-lg text-center">{error}</div>}

            <Controls 
                onTranslate={handleTranslate}
                onReview={handleReview}
                onSynthesize={handleSynthesize}
                onPolish={handlePolish}
                loadingStates={loadingStates}
                completionStates={{step1: isStep1Complete, step2: isStep2Complete, step3: isStep3Complete, step4: isStep4Complete, step5: isStep5Complete}}
            />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StagePanel 
                    title="1. Preliminary Translation" 
                    content={pipelineState.preliminaryTranslation} 
                    isLoading={loadingStates.translation}
                    icon={<BotIcon />}
                    stageNumber={1}
                />

                <ReviewPanel
                    fluency={pipelineState.fluencyReview}
                    accuracy={pipelineState.accuracyReview}
                    style={pipelineState.styleReview}
                    isLoading={loadingStates.review}
                />

                <StagePanel 
                    title="3. Synthesized Article" 
                    content={pipelineState.synthesizedText} 
                    isLoading={loadingStates.synthesis}
                    icon={<BotIcon />}
                     stageNumber={3}
                />
                
                <StagePanel 
                    title="4. Final Polished Article" 
                    content={pipelineState.finalPolish} 
                    isLoading={loadingStates.polish}
                    icon={<BotIcon />}
                    stageNumber={4}
                    isFinal={true}
                />
            </div>
        </div>
    );
};

export default App;
