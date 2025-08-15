import React, { useState } from 'react';
import { PlusIcon } from './Icons';
import { LoadingSpinner } from './LoadingSpinner';

interface InputFormProps {
    onAdd: (namesString: string) => void;
    isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onAdd, isLoading }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !isLoading) {
            onAdd(inputValue);
            setInputValue('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ajouter 'John Doe', ou 'note pour John Doe: expert en IA'..."
                className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg py-3 pr-28 pl-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 resize-none"
                rows={3}
                disabled={isLoading}
            />
            <button
                type="submit"
                className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                disabled={isLoading || !inputValue.trim()}
            >
                {isLoading ? (
                    <>
                        <LoadingSpinner />
                        <span>Ajout...</span>
                    </>
                ) : (
                    <>
                        <PlusIcon className="h-5 w-5" />
                        <span>Ajouter</span>
                    </>
                )}
            </button>
        </form>
    );
};