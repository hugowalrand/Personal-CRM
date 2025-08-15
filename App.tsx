
import React, { useState, useEffect, useCallback } from 'react';
import type { Contact, ContactUpdate } from './types';
import { extractContactsFromText } from './services/geminiService';
import { supabase } from './services/supabaseClient';
import { ContactList } from './components/ContactList';
import { BrainCircuitIcon, ClipboardListIcon } from './components/Icons';
import { LoadingSpinner } from './components/LoadingSpinner';
import { CreateTableInstructions } from './components/CreateTableInstructions';
import { UpdateSchemaInstructionsPriorityTag } from './components/UpdateSchemaInstructionsPriorityTag';
import { UpdateSchemaInstructionsActionTag } from './components/UpdateSchemaInstructionsActionTag';
import { BulkAddModal } from './components/BulkAddModal';
import { EditContactModal } from './components/EditContactModal';


const App: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    
    const [isBulkModalOpen, setIsBulkModalOpen] = useState<boolean>(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [showCreateTableScreen, setShowCreateTableScreen] = useState(false);
    const [showUpdateSchema, setShowUpdateSchema] = useState(false);
    const [showUpdateSchemaForTag, setShowUpdateSchemaForTag] = useState(false);


    if (!supabase) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-gray-200 p-8 font-sans">
                <div className="text-center max-w-2xl bg-gray-800 border border-yellow-500/50 p-8 rounded-lg shadow-2xl">
                    <h1 className="text-3xl font-bold text-yellow-300 mb-4">Action Required: Configure Database</h1>
                    <p className="text-lg mb-4 text-gray-300">
                        For the application to work, you need to connect it to your Supabase database.
                    </p>
                    <div className="text-left bg-gray-900/70 p-4 rounded-md border border-gray-700">
                        <p className="mb-2">1. Open the file: <code className="bg-gray-700 px-2 py-1 rounded text-cyan-400 text-sm">services/supabaseClient.ts</code></p>
                        <p>2. Paste your API key in the indicated spot. The URL has already been filled in for you.</p>
                    </div>
                </div>
            </div>
        );
    }

    const sortContacts = (contactList: Contact[]) => {
        return [...contactList].sort((a, b) => {
            const priorityA = a.priority ?? 4; // Treat null as the lowest priority
            const priorityB = b.priority ?? 4;
            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
    };

    const fetchContacts = useCallback(async () => {
        setShowCreateTableScreen(false);
        setShowUpdateSchema(false);
        setShowUpdateSchemaForTag(false);
        setError(null);
        setIsAppLoading(true);

        const { data, error: dbError } = await supabase
            .from('contacts')
            .select('*')
            .order('priority', { ascending: true, nullsFirst: true })
            .order('created_at', { ascending: false });
        
        if (dbError) {
            console.error("Full Supabase fetch error object:", JSON.stringify(dbError, null, 2));
            if (dbError.code === 'PGRST205' || dbError.message.includes('relation "public.contacts" does not exist') || dbError.message.includes("could not find the table")) {
                setShowCreateTableScreen(true);
            } else if (dbError.message.includes('priority') || dbError.message.includes('is_priority') || dbError.message.includes('status')) {
                setShowUpdateSchema(true);
            } else if (dbError.message.includes('action_tag') || dbError.message.includes("Could not find the 'action_tag' column")) {
                setShowUpdateSchemaForTag(true);
            } else {
                const detailedError = `Supabase Error: ${dbError.message} (Code: ${dbError.code || 'N/A'})`;
                setError(detailedError + ". Check the console for more information.");
            }
        } else {
            setContacts(sortContacts(data || []));
        }
        setIsAppLoading(false);
    }, []);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);
    
    const handleExtract = async (text: string) => {
        setIsProcessing(true);
        setError(null);
        try {
            const extractedContacts = await extractContactsFromText(text);
            if (extractedContacts.length > 0) {
                 const { data: newDbContacts, error: insertError } = await supabase
                    .from('contacts')
                    .insert(extractedContacts)
                    .select();

                 if (insertError) {
                    throw new Error(`Supabase Error: ${insertError.message}`);
                 }
                 
                 if (newDbContacts) {
                    setContacts(prevContacts => sortContacts([...prevContacts, ...newDbContacts]));
                 } else {
                    await fetchContacts(); // Fallback to refetching
                 }
            }
        } catch (err) {
             const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during extraction.";
            setError(errorMessage);
        } finally {
            setIsProcessing(false);
            setIsBulkModalOpen(false);
        }
    };

    const handleDeleteContact = async (id: string) => {
        const originalContacts = [...contacts];
        setContacts(prev => prev.filter(contact => contact.id !== id));
        const { error: deleteError } = await supabase.from('contacts').delete().eq('id', id);
        if (deleteError) {
            setContacts(originalContacts);
            setError("Error deleting contact.");
        }
    };

    const handleUpdateContact = async (id: string, updates: ContactUpdate) => {
        const originalContacts = [...contacts];
        const updatedContacts = contacts.map(c => c.id === id ? {...c, ...updates} : c);
        setContacts(sortContacts(updatedContacts)); // Optimistic update with sort

        const { error: updateError } = await supabase.from('contacts').update(updates).eq('id', id);
        if (updateError) {
            setError(`Error updating contact: ${updateError.message}`);
            // Revert on error
            setContacts(originalContacts);
        }
    };
    
    const handleStartEdit = (contact: Contact) => {
        setEditingContact(contact);
    };

    const handleSaveFromModal = async (updates: ContactUpdate) => {
        if (!editingContact) return;
        await handleUpdateContact(editingContact.id, updates);
        setEditingContact(null);
    };

    if (showCreateTableScreen) {
        return <CreateTableInstructions onRetry={fetchContacts} />;
    }
    if (showUpdateSchema) {
        return <UpdateSchemaInstructionsPriorityTag onRetry={fetchContacts} />;
    }
    if (showUpdateSchemaForTag) {
        return <UpdateSchemaInstructionsActionTag onRetry={fetchContacts} />;
    }
    
    return (
        <div className="h-screen w-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
            <header className="text-center py-4 border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex justify-center items-center gap-3">
                    <BrainCircuitIcon className="h-8 w-8 text-cyan-500" />
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                        AI Security Career CRM
                    </h1>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                 <div className="max-w-7xl mx-auto">
                    <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                         <button
                            onClick={() => setIsBulkModalOpen(true)}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg"
                        >
                            <ClipboardListIcon className="h-5 w-5" />
                            <span>Extract Contacts</span>
                        </button>
                    </div>

                    {error && (
                        <div className="my-4 max-w-3xl mx-auto p-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    {isAppLoading ? (
                         <div className="flex flex-col justify-center items-center text-gray-300 mt-20">
                            <LoadingSpinner />
                            <p className="mt-4 text-xl">Loading contacts...</p>
                        </div>
                    ) : contacts.length > 0 ? (
                        <ContactList 
                            contacts={contacts} 
                            onDelete={handleDeleteContact} 
                            onUpdate={handleUpdateContact}
                            onEdit={handleStartEdit}
                        />
                    ) : (
                         <div className="text-center text-gray-500 mt-20">
                            <p className="text-lg">Your CRM is empty.</p>
                            <p>Click the button above to start adding contacts.</p>
                        </div>
                    )}
                 </div>
            </main>
            
            <BulkAddModal 
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                onExtract={handleExtract}
                isLoading={isProcessing}
            />
            {editingContact && (
                 <EditContactModal 
                    isOpen={!!editingContact}
                    onClose={() => setEditingContact(null)}
                    contact={editingContact}
                    onSave={handleSaveFromModal}
                />
            )}
        </div>
    );
};

export default App;