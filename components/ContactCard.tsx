
import React, { useState, useRef, useEffect } from 'react';
import type { Contact, ContactUpdate } from '../types';
import { UserIcon, TrashIcon, CheckCircleIcon, AtSymbolIcon, GlobeAltIcon, LinkedinIcon, ChevronDownIcon, PencilIcon, TagIcon } from './Icons';
import { FormattedNotes } from './FormattedNotes';

interface ContactCardProps {
    contact: Contact;
    onDelete: (id: string) => void;
    onUpdate: (id: string, updates: ContactUpdate) => void;
    onEdit: (contact: Contact) => void;
    dragAttributes?: any;
    dragListeners?: any;
}

const priorityStyles: { [key: number]: string } = {
  1: 'bg-red-500/30 text-red-300 border-red-500/40',
  2: 'bg-orange-400/30 text-orange-300 border-orange-400/40',
  3: 'bg-yellow-400/30 text-yellow-300 border-yellow-400/40',
};

const defaultPriorityStyle = 'bg-gray-600/30 text-gray-400 border-gray-600/40 hover:bg-gray-600/50';

export const ContactCard: React.FC<ContactCardProps> = ({ contact, onDelete, onUpdate, onEdit }) => {
    const { id, name, summary, key_points, priority, action_tag, notes, contact_info } = contact;
    const [isAiSummaryExpanded, setIsAiSummaryExpanded] = useState(false);
    const [isEditingTag, setIsEditingTag] = useState(false);
    const [tagValue, setTagValue] = useState(action_tag || '');
    const tagInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditingTag) {
            tagInputRef.current?.focus();
        }
    }, [isEditingTag]);

    const handlePriorityClick = () => {
        let nextPriority: number | null;
        if (priority === 1) nextPriority = 2;
        else if (priority === 2) nextPriority = 3;
        else if (priority === 3) nextPriority = null;
        else nextPriority = 1;
        onUpdate(id, { priority: nextPriority });
    };
    
    const handleTagSave = () => {
        if (tagValue.trim() !== (action_tag || '')) {
            onUpdate(id, { action_tag: tagValue.trim() || null });
        }
        setIsEditingTag(false);
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleTagSave();
        } else if (e.key === 'Escape') {
            setTagValue(action_tag || '');
            setIsEditingTag(false);
        }
    };
    
    return (
        <div className={`bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col justify-between border border-gray-700 transition-all duration-300 ${priority === 1 ? 'border-red-500/40' : ''}`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center min-w-0">
                    <div className="flex-shrink-0 bg-gray-700 rounded-full p-2 mr-3">
                        <UserIcon className="h-6 w-6 text-cyan-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white truncate pr-2">{name}</h2>
                </div>
                <button
                    onClick={handlePriorityClick}
                    className={`px-3 py-1 text-sm font-bold rounded-full border ${priority ? priorityStyles[priority] : defaultPriorityStyle} flex-shrink-0 ml-2 whitespace-nowrap transition-colors`}
                    aria-label={`Change priority. Current: ${priority ? `P${priority}`: 'None'}`}
                >
                    {priority ? `P${priority}` : 'Prioritize'}
                </button>
            </div>
            
            {/* Action Tag Section */}
            <div className="pl-12 -mt-2 mb-3 min-h-[24px]">
                 {isEditingTag ? (
                    <input
                        ref={tagInputRef}
                        type="text"
                        value={tagValue}
                        onChange={(e) => setTagValue(e.target.value)}
                        onBlur={handleTagSave}
                        onKeyDown={handleTagKeyDown}
                        className="w-full bg-gray-700 text-cyan-300 text-sm px-2 py-0.5 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Add a tag..."
                    />
                ) : (
                    <div onClick={() => setIsEditingTag(true)} className="flex items-center gap-2 cursor-pointer group w-fit">
                        <TagIcon className="h-4 w-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                        <span className={`text-sm ${action_tag ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                           {action_tag || 'Add a tag...'}
                        </span>
                    </div>
                )}
            </div>

            {/* Notes Section (Priority) */}
            <div className="my-1">
                 <div className="w-full text-gray-300 text-base bg-transparent p-3 rounded-md min-h-[80px]">
                    <FormattedNotes notes={notes} />
                </div>
            </div>

            {/* AI Summary Section (Collapsible) */}
            <div className="mt-2">
                <button 
                    onClick={() => setIsAiSummaryExpanded(prev => !prev)} 
                    className="flex sm:hidden items-center justify-between w-full text-left text-sm font-medium text-gray-300 hover:text-white py-2"
                >
                    <span className="font-semibold">AI Summary</span>
                    <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isAiSummaryExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                <div className={`pt-2 sm:pt-0 border-t border-gray-700/50 sm:border-t-0 ${isAiSummaryExpanded ? 'block' : 'hidden'} sm:block`}>
                    <p className="text-gray-400 text-sm italic border-l-2 border-cyan-800 pl-3 mb-3">{summary}</p>
                    {key_points && key_points.length > 0 && (
                        <ul className="space-y-1.5 text-gray-400 text-sm pl-1">
                            {key_points.map((point, index) => (
                               <li key={index} className="flex items-start">
                                   <CheckCircleIcon className="h-4 w-4 text-cyan-600 mr-2 mt-0.5 flex-shrink-0" />
                                   <span>{point}</span>
                               </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

             {/* Footer Actions */}
             <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700/50">
                <div className="flex items-center space-x-3 text-gray-500">
                    {contact_info?.email && (
                        <a href={`mailto:${contact_info.email}`} className="hover:text-cyan-400 transition-colors" aria-label="Email"><AtSymbolIcon className="h-5 w-5"/></a>
                    )}
                    {contact_info?.linkedin && (
                        <a href={contact_info.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors" aria-label="LinkedIn"><LinkedinIcon className="h-5 w-5"/></a>
                    )}
                    {contact_info?.website && (
                         <a href={contact_info.website} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors" aria-label="Website"><GlobeAltIcon className="h-5 w-5"/></a>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onEdit(contact)}
                        className="p-2 rounded-full text-gray-500 hover:text-cyan-400 hover:bg-gray-700 transition-colors duration-200"
                        aria-label="Edit contact"
                    >
                        <PencilIcon className="h-5 w-5" />
                    </button>
                    <button 
                        onClick={() => onDelete(contact.id)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-gray-700 rounded-full transition-colors duration-200"
                        aria-label={`Delete ${name}`}
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};