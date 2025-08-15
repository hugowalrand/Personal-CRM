
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ContactCard } from './ContactCard';
import type { Contact, ContactUpdate } from '../types';

interface SortableContactCardProps {
    contact: Contact;
    onDelete: (id: string) => void;
    onUpdate: (id: string, updates: ContactUpdate) => void;
    onEdit: (contact: Contact) => void;
}

export const SortableContactCard: React.FC<SortableContactCardProps> = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: props.contact.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
        zIndex: isDragging ? 10 : 'auto',
    };

    return (
        <div ref={setNodeRef} style={style} className="touch-none">
            <ContactCard 
                {...props}
                dragAttributes={attributes}
                dragListeners={listeners}
            />
        </div>
    );
};
