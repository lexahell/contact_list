declare function updateContactInDOM(prevContact: any, contact: any): void;
declare function renderContactItemByDataAttribute(contact: any, attribute: any, value: any): void;
declare function updateContactItem(contactItem: any, contact: any): void;
declare function renderContactsInModal(contacts?: never[]): void;
declare function getContactListAndItemCount(letter: any): {
    contactList: Element | null;
    itemCount: Element | null;
};
declare function renderMainTable(): void;
declare function renderColumn(column: any, letters: any): void;
declare function renderContactList(contactList: any, itemCount: any, letter: any): void;
declare function showEditModal(modalClass: any, contact: any, onClose: any): void;
declare function showModal(modalClass: any, onClose?: () => void): void;
declare function hideModal(modalClass: any): void;
export { updateContactInDOM, renderContactItemByDataAttribute, updateContactItem, renderContactsInModal, getContactListAndItemCount, renderMainTable, renderColumn, renderContactList, showEditModal, showModal, hideModal, };
