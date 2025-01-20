declare function addContact(contact: any): void;
declare function isContactExists(contact: any): any;
declare function editContact(prevContact: any, newContact: any): void;
declare function removeContact(contact: any): void;
declare function getAll(): unknown[];
declare function getContactsByLetter(letter: any): any;
declare function getContactsByQuery(query: any): never[];
declare function clearContacts(): void;
export { addContact, removeContact, getContactsByLetter, getContactsByQuery, editContact, clearContacts, getAll, isContactExists, };
