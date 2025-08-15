
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { PaperAirplaneIcon, BrainCircuitIcon, UserIcon } from './Icons';

interface ChatInterfaceProps {
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
    isThinking: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isThinking }) => {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isThinking]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    return (
        <div className="bg-gray-800 h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div key={message.id} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.role === 'assistant' && (
                            <div className="w-8 h-8 flex-shrink-0 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/50">
                                <BrainCircuitIcon className="w-5 h-5 text-cyan-400" />
                            </div>
                        )}
                        <div className={`max-w-md p-3 rounded-lg ${message.role === 'user' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        </div>
                         {message.role === 'user' && (
                            <div className="w-8 h-8 flex-shrink-0 bg-gray-600 rounded-full flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-gray-300" />
                            </div>
                        )}
                    </div>
                ))}
                {isThinking && (
                     <div className="flex items-start gap-3 justify-start">
                        <div className="w-8 h-8 flex-shrink-0 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/50">
                           <BrainCircuitIcon className="w-5 h-5 text-cyan-400 animate-pulse" />
                        </div>
                        <div className="max-w-md p-3 rounded-lg bg-gray-700 text-gray-400 rounded-bl-none">
                            <div className="flex items-center gap-2 text-sm">
                                <div className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-700">
                <form onSubmit={handleSubmit} className="relative">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        placeholder="Chat with your assistant..."
                        className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg py-2 pr-12 pl-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 resize-none"
                        rows={1}
                        disabled={isThinking}
                    />
                    <button
                        type="submit"
                        className="absolute top-1/2 right-3 -translate-y-1/2 p-2 text-gray-400 rounded-full hover:bg-cyan-600 hover:text-white disabled:opacity-50 transition-colors"
                        disabled={isThinking || !inputValue.trim()}
                        aria-label="Send"
                    >
                        <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};