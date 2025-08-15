
import React from 'react';
import type { Contact, ContactUpdate } from '../types';
import { ContactCard } from './ContactCard';

interface ContactListProps {
    contacts: Contact[];
    onDelete: (id: string) => void;
    onUpdate: (id: string, updates: ContactUpdate) => void;
    onEdit: (contact: Contact) => void;
}

export const ContactList: React.FC<ContactListProps> = ({ contacts, onDelete, onUpdate, onEdit }) => {
    return (
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
            {contacts.map(contact => (
                <ContactCard 
                    key={contact.id} 
                    contact={contact} 
                    onDelete={onDelete} 
                    onUpdate={onUpdate}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
};