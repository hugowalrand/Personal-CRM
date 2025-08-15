
import React, { useState, useEffect } from 'react';
import type { Contact, ContactUpdate } from '../types';
import { CloseIcon } from './Icons';

interface EditContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    contact: Contact;
    onSave: (updates: ContactUpdate) => void;
}

export const EditContactModal: React.FC<EditContactModalProps> = ({ isOpen, onClose, contact, onSave }) => {
    const [formData, setFormData] = useState<Partial<Contact>>(contact);

    useEffect(() => {
        if (isOpen) {
            setFormData(contact);
        }
    }, [contact, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'email' || name === 'linkedin' || name === 'website') {
            setFormData(prev => ({
                ...prev,
                contact_info: {
                    ...(prev.contact_info || {}),
                    [name]: value,
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const changedFields: ContactUpdate = {};

        if (formData.notes !== contact.notes) {
            changedFields.notes = formData.notes;
        }
        if (formData.action_tag !== contact.action_tag) {
            changedFields.action_tag = formData.action_tag;
        }
        if (JSON.stringify(formData.contact_info) !== JSON.stringify(contact.contact_info)) {
             changedFields.contact_info = formData.contact_info;
        }

        if (Object.keys(changedFields).length > 0) {
            onSave(changedFields);
        }
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-gray-800 rounded-lg shadow-2xl p-4 sm:p-6 m-4 w-full max-w-lg border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">
                        Editing: <span className="text-cyan-400">{contact.name}</span>
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white" aria-label="Close">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                         <div>
                            <label htmlFor="action_tag" className="block text-sm font-medium text-gray-300 mb-1">Action Tag</label>
                             <input
                                type="text"
                                id="action_tag"
                                name="action_tag"
                                value={formData.action_tag || ''}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="E.g.: To contact, Follow-up needed..."
                             />
                        </div>
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes || ''}
                                onChange={handleChange}
                                rows={4}
                                className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="Add notes about this contact..."
                            />
                        </div>
                        <div>
                             <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                             <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.contact_info?.email || ''}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="john.doe@example.com"
                             />
                        </div>
                        <div>
                             <label htmlFor="linkedin" className="block text-sm font-medium text-gray-300 mb-1">LinkedIn (URL)</label>
                             <input
                                type="url"
                                id="linkedin"
                                name="linkedin"
                                value={formData.contact_info?.linkedin || ''}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="https://www.linkedin.com/in/..."
                             />
                        </div>
                         <div>
                             <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">Website (URL)</label>
                             <input
                                type="url"
                                id="website"
                                name="website"
                                value={formData.contact_info?.website || ''}
                                onChange={handleChange}
                                className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="https://example.com"
                             />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 transition-colors">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};