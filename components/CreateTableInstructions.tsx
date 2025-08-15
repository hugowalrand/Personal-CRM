
import React, { useState } from 'react';
import { BrainCircuitIcon } from './Icons';

const SQL_SCRIPT = `-- 1. Creates the table to store CRM contacts
CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  summary text NOT NULL,
  key_points text[],
  status text,
  notes text,
  is_priority boolean DEFAULT false,
  contact_info jsonb
);

-- 2. Enables Row Level Security (Good Practice)
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- 3. Adds comments for database documentation
COMMENT ON TABLE public.contacts IS 'Table to store contacts for the personal CRM.';
`;

interface CreateTableInstructionsProps {
    onRetry: () => void;
}

export const CreateTableInstructions: React.FC<CreateTableInstructionsProps> = ({ onRetry }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(SQL_SCRIPT);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-gray-200 p-4 font-sans">
            <div className="text-center w-full max-w-3xl bg-gray-800 border border-cyan-500/50 p-4 sm:p-8 rounded-lg shadow-2xl">
                <div className="flex justify-center items-center gap-4 mb-4">
                    <BrainCircuitIcon className="h-10 w-10 text-cyan-400" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Finalizing Setup</h1>
                </div>

                <p className="text-base sm:text-lg mb-6 text-gray-300">
                    Your database is connected, but the required table (<code className="bg-gray-700 px-2 py-1 rounded text-cyan-400">contacts</code>) is missing.
                </p>

                <div className="text-left space-y-2 bg-gray-900/50 p-4 rounded-md">
                     <p><strong>1.</strong> Go to your Supabase project &gt; <strong className="text-cyan-400">SQL Editor</strong>.</p>
                     <p><strong>2.</strong> Click on <strong className="text-cyan-400">"New query"</strong>.</p>
                     <p><strong>3.</strong> Copy and paste the SQL script below.</p>
                     <p><strong>4.</strong> Click the green <strong className="text-green-400">"RUN"</strong> button.</p>
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
                    I've run the script, retry connection
                </button>
            </div>
        </div>
    );
};