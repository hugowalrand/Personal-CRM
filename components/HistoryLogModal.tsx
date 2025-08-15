
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import type { Contact, ContactHistory } from '../types';
import { CloseIcon, ClockIcon } from './Icons';
import { LoadingSpinner } from './LoadingSpinner';

interface HistoryLogModalProps {
    isOpen: boolean;
    onClose: () => void;
    contact: Contact;
}

export const HistoryLogModal: React.FC<HistoryLogModalProps> = ({ isOpen, onClose, contact }) => {
    const [history, setHistory] = useState<ContactHistory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            const fetchHistory = async () => {
                setIsLoading(true);
                setError(null);
                const { data, error: dbError } = await supabase
                    .from('contact_history')
                    .select('*')
                    .eq('contact_id', contact.id)
                    .order('created_at', { ascending: false });

                if (dbError) {
                    const detailedError = `Could not load history. Error: ${dbError.message} (Code: ${dbError.code || 'N/A'})`;
                    setError(detailedError);
                    console.error("History fetch error:", JSON.stringify(dbError, null, 2));
                } else {
                    setHistory(data || []);
                }
                setIsLoading(false);
            };
            fetchHistory();
        }
    }, [isOpen, contact.id]);

    if (!isOpen) {
        return null;
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-2xl p-4 sm:p-6 m-4 w-full max-w-2xl border border-gray-700 flex flex-col" style={{maxHeight: '80vh'}}>
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ClockIcon className="w-6 h-6 text-cyan-400" />
                        History for: <span className="text-cyan-400">{contact.name}</span>
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white" aria-label="Close">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto pr-2">
                    {isLoading && <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>}
                    {error && <p className="text-red-400 text-center whitespace-pre-wrap">{error}</p>}
                    {!isLoading && !error && history.length === 0 && <p className="text-gray-500 text-center">No history found for this contact.</p>}
                    
                    <div className="space-y-4">
                        {history.map(entry => (
                            <div key={entry.id} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
                                <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                                    <span>By: <strong>{entry.changed_by}</strong></span>
                                    <span>{new Date(entry.created_at).toLocaleString('en-US')}</span>
                                </div>
                                <p className="text-sm text-gray-300 italic">"{entry.reason}"</p>
                                <details className="mt-2 text-xs">
                                    <summary className="cursor-pointer text-cyan-400 hover:underline">View technical details</summary>
                                    <pre className="mt-1 p-2 bg-black/50 rounded text-gray-400 text-xs whitespace-pre-wrap">
                                        {JSON.stringify(entry.changed_fields, null, 2)}
                                    </pre>
                                </details>
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="flex justify-end mt-6 flex-shrink-0">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};