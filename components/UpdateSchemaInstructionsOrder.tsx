
import React, { useState } from 'react';
import { BrainCircuitIcon } from './Icons';

const SQL_SCRIPT = `-- Adds a column for manual contact sorting.
-- This operation will not erase any of your existing data.
ALTER TABLE public.contacts
ADD COLUMN display_order INTEGER;

COMMENT ON COLUMN public.contacts.display_order IS 'Custom order for displaying contacts, managed by drag-and-drop.';
`;

interface UpdateSchemaInstructionsOrderProps {
    onRetry: () => void;
}

export const UpdateSchemaInstructionsOrder: React.FC<UpdateSchemaInstructionsOrderProps> = ({ onRetry }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(SQL_SCRIPT);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-gray-200 p-4 font-sans">
            <div className="text-center w-full max-w-3xl bg-gray-800 border border-yellow-500/50 p-4 sm:p-8 rounded-lg shadow-2xl">
                <div className="flex justify-center items-center gap-4 mb-4">
                    <BrainCircuitIcon className="h-10 w-10 text-yellow-400" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Database Update Required</h1>
                </div>

                <p className="text-base sm:text-lg mb-6 text-gray-300">
                    To enable the drag-and-drop reordering feature, your database needs an update. The column <code className="bg-gray-700 px-2 py-1 rounded text-yellow-400">display_order</code> is missing.
                </p>

                <div className="text-left space-y-2 bg-gray-900/50 p-4 rounded-md">
                     <p><strong>To fix this, follow these simple steps:</strong></p>
                     <p><strong>1.</strong> Go to your Supabase project &gt; <strong className="text-cyan-400">SQL Editor</strong>.</p>
                     <p><strong>2.</strong> Copy and paste the SQL script below into a new query.</p>
                     <p><strong>3.</strong> Click the green <strong className="text-green-400">"RUN"</strong> button.</p>
                </div>
                
                <div className="relative my-6">
                    <textarea 
                        readOnly 
                        value={SQL_SCRIPT} 
                        className="w-full h-36 bg-gray-900/70 p-4 rounded-md border border-gray-700 text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto resize-none font-mono"
                    />
                    <button 
                        onClick={handleCopy}
                        className="absolute top-2 right-2 px-3 py-1 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors text-gray-300 text-xs"
                    >
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>

                <button
                    onClick={onRetry}
                    className="w-full px-6 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 transition-colors text-lg"
                >
                    I've run the script, continue
                </button>
            </div>
        </div>
    );
};