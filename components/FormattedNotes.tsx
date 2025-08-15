
import React, { useMemo } from 'react';

interface FormattedNotesProps {
    notes: string | null;
}

const URL_REGEX = /((?:https?:\/\/|www\.)[^\s]+)/g;
const EMAIL_REGEX = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;

export const FormattedNotes: React.FC<FormattedNotesProps> = ({ notes }) => {
    const formattedContent = useMemo(() => {
        if (!notes) {
            return <span className="text-gray-500">No notes.</span>;
        }

        const lines = notes.split('\n');
        const elements = [];
        let listItems = [];

        const flushList = () => {
            if (listItems.length > 0) {
                elements.push(<ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 pl-1 my-2">{listItems}</ul>);
                listItems = [];
            }
        };

        lines.forEach((line, index) => {
            const isListItem = line.trim().startsWith('- ') || line.trim().startsWith('* ');

            if (isListItem) {
                const text = line.trim().substring(2);
                listItems.push(<li key={`li-${index}`}>{text}</li>);
            } else {
                flushList();
                const parts = line.split(URL_REGEX).flatMap(part => part.split(EMAIL_REGEX));

                const lineContent = parts.map((part, partIndex) => {
                    if (part.match(URL_REGEX)) {
                        const href = part.startsWith('www.') ? `http://${part}` : part;
                        return (
                            <a
                                key={`link-${index}-${partIndex}`}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400 hover:underline break-all"
                            >
                                {part}
                            </a>
                        );
                    }
                     if (part.match(EMAIL_REGEX)) {
                        return (
                            <a
                                key={`email-${index}-${partIndex}`}
                                href={`mailto:${part}`}
                                className="text-cyan-400 hover:underline break-all"
                            >
                                {part}
                            </a>
                        );
                    }
                    return <span key={`text-${index}-${partIndex}`}>{part}</span>;
                });
                
                 if (line.trim() === '') {
                    elements.push(<div key={`br-${index}`} className="h-4" />);
                } else {
                    elements.push(<p key={`p-${index}`} className="my-1">{lineContent}</p>);
                }
            }
        });

        flushList(); // Make sure the last list is added

        return elements;
    }, [notes]);

    return <div className="whitespace-pre-wrap">{formattedContent}</div>;
};