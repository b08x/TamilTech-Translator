
import React, { useState, useCallback } from 'react';
import type { InputType } from '../types';

interface InputPanelProps {
  onTextUpdate: (text: string) => void;
  initialText: string;
}

export const InputPanel: React.FC<InputPanelProps> = ({ onTextUpdate, initialText }) => {
    const [inputType, setInputType] = useState<InputType>('text');
    const [text, setText] = useState(initialText);
    const [url, setUrl] = useState('');

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        onTextUpdate(e.target.value);
    };
    
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
        // Simulate fetching content from URL
        const mockContent = `Simulated content from ${e.target.value}: A PACS consists of four major components: The imaging modalities such as X-ray, CT and MRI, a secured network for the transmission of patient information, workstations for interpreting and reviewing images, and archives for the storage and retrieval of images and reports.`;
        setText(mockContent);
        onTextUpdate(mockContent);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const fileContent = event.target?.result as string;
                setText(fileContent);
                onTextUpdate(fileContent);
            };
            reader.readAsText(file);
        }
    };
    
    const renderInput = () => {
        switch (inputType) {
            case 'url':
                return (
                    <input
                        type="text"
                        value={url}
                        onChange={handleUrlChange}
                        placeholder="https://example.com/article"
                        className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                );
            case 'file':
                return (
                     <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".txt"
                        className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-800 file:text-cyan-200 hover:file:bg-cyan-700"
                    />
                );
            case 'text':
            default:
                return null;
        }
    };

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                    {(['text', 'url', 'file'] as InputType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => setInputType(type)}
                            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                                inputType === type
                                    ? 'bg-cyan-600 text-white shadow-md'
                                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                            }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="md:w-1/2">
                    {renderInput()}
                </div>
            </div>
            
            {inputType !== 'url' && (
                 <textarea
                    value={text}
                    onChange={handleTextChange}
                    placeholder="Enter English source text here..."
                    className="w-full h-48 mt-4 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-y"
                />
            )}
        </div>
    );
};
