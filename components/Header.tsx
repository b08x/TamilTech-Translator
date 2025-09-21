
import React from 'react';

export const Header: React.FC = () => (
    <header className="text-center mb-6 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500 mb-2">
            AI Editorial Translation Pipeline
        </h1>
        <p className="text-slate-400 max-w-3xl mx-auto">
            An interactive generative UI simulating a professional workflow. Transform English content into a publish-ready Tamil article via a series of specialized AI agents.
        </p>
    </header>
);
