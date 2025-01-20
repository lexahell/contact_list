import { Contact } from './../types/Contact';
declare function updateContactInDOM(prevContact: Contact, contact: Contact): void;
declare function renderContactItemByDataAttribute(contact: Contact, attribute: string, value: boolean): void;
declare function updateContactItem(contactItem: HTMLElement, contact: Contact): void;
declare function renderContactsInModal(contacts?: Contact[]): void;
declare function getContactListAndItemCount(letter: string): {
    contactList: HTMLElement | null;
    itemCount: HTMLElement | null;
};
declare function renderMainTable(): void;
declare function renderColumn(column: HTMLElement, letters: string): void;
declare function renderContactList(contactList: HTMLElement, itemCount: HTMLElement, letter: string): void;
declare function showEditModal(modalClass: string, contact: Contact, onClose: () => void): void;
declare function showModal(modalClass: string, onClose?: () => void): void;
declare function hideModal(modalClass: string): void;
export { updateContactInDOM, renderContactItemByDataAttribute, updateContactItem, renderContactsInModal, getContactListAndItemCount, renderMainTable, renderColumn, renderContactList, showEditModal, showModal, hideModal, };
