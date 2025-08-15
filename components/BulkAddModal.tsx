
import React, { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { CloseIcon, ClipboardListIcon } from './Icons';

interface BulkAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExtract: (text: string) => Promise<void>;
    isLoading: boolean;
}

export const BulkAddModal: React.FC<BulkAddModalProps> = ({ isOpen, onClose, onExtract, isLoading }) => {
    const [text, setText] = useState('');

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async () => {
        if (text.trim() && !isLoading) {
            await onExtract(text);
            setText('');
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-gray-800 rounded-lg shadow-2xl p-4 sm:p-6 m-4 w-full max-w-2xl border border-gray-700 transform transition-transform scale-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ClipboardListIcon className="w-6 h-6 text-cyan-500" />
                        Extract Contacts from Text
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white"
                        aria-label="Close"
                        disabled={isLoading}
                    >
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <p className="text-gray-400 mb-4">
                    Make the names of the contacts you want to add **bold** (by surrounding them with **double asterisks**). The AI will extract them and use the rest of the text as context.
                </p>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Example: **Rudolf Laine** works at Workshop Labs. Alexandra gave me his contact..."
                    className="w-full h-48 sm:h-64 bg-gray-900 border-2 border-gray-700 rounded-lg p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 resize-y"
                    disabled={isLoading}
                />
                <div className="flex justify-end gap-4 mt-4">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 disabled:opacity-50 transition-colors"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                        disabled={isLoading || !text.trim()}
                    >
                        {isLoading ? (
                            <>
                                <LoadingSpinner />
                                <span>Extracting...</span>
                            </>
                        ) : (
                            <span>Extract and Add</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};