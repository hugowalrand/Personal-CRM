
import React, { useState } from 'react';
import { BrainCircuitIcon } from './Icons';

const SQL_SCRIPT = `-- Updates the table for a P1/P2/P3 priority system and simplifies the structure.
-- This operation may remove the 'status', 'is_priority', and 'display_order' columns.
-- Back up your data if you have important information in the 'status' column.

-- 1. Drop old columns if they exist.
ALTER TABLE public.contacts DROP COLUMN IF EXISTS is_priority;
ALTER TABLE public.contacts DROP COLUMN IF EXISTS display_order;
ALTER TABLE public.contacts DROP COLUMN IF EXISTS status;

-- 2. Add the new priority column if it doesn't exist.
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS priority INTEGER;

-- 3. Add a comment for documentation.
COMMENT ON COLUMN public.contacts.priority IS 'Priority level (e.g., 1 for P1, 2 for P2), used for sorting.';
`;

interface UpdateSchemaInstructionsPriorityTagProps {
    onRetry: () => void;
}

export const UpdateSchemaInstructionsPriorityTag: React.FC<UpdateSchemaInstructionsPriorityTagProps> = ({ onRetry }) => {
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Application Update</h1>
                </div>

                <p className="text-base sm:text-lg mb-6 text-gray-300">
                    To improve performance and simplicity, the application has been updated. Your database needs to be adapted to the new priority system (P1, P2, P3).
                </p>

                <div className="text-left space-y-2 bg-gray-900/50 p-4 rounded-md">
                     <p><strong>To complete the update:</strong></p>
                     <p><strong>1.</strong> Go to your Supabase project &gt; <strong className="text-cyan-400">SQL Editor</strong>.</p>
                     <p><strong>2.</strong> Copy and paste the SQL script below.</p>
                     <p><strong>3.</strong> Click the green <strong className="text-green-400">"RUN"</strong> button.</p>
                </div>
                
                <div className="relative my-6">
                    <textarea 
                        readOnly 
                        value={SQL_SCRIPT} 
                        className="w-full h-48 bg-gray-900/70 p-4 rounded-md border border-gray-700 text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto resize-none font-mono"
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