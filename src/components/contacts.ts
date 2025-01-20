import { Contact } from 'src/types/Contact';
import { Contacts } from 'src/types/Contacts';

let contacts: Contacts = {};

function addContact(contact: Contact): void {
  const firstLetter = contact.name[0].toLowerCase();

  if (!contacts[firstLetter]) {
    contacts[firstLetter] = [];
  }

  if (!isContactExists(contact)) {
    contacts[firstLetter].push(contact);
    saveContactsToLocalStorage();
  }
}

function isContactExists(contact: Contact): boolean {
  if (!contacts[contact.name[0].toLowerCase()]) {
    return false;
  }
  return contacts[contact.name[0].toLowerCase()].some(
    (el) =>
      el.name === contact.name &&
      el.vacancy === contact.vacancy &&
      el.phone === contact.phone
  );
}

function editContact(prevContact: Contact, newContact: Contact): void {
  if (isContactExists(prevContact) && !isContactExists(newContact)) {
    removeContact(prevContact);
    addContact(newContact);
  }
}

function removeContact(contact: Contact): void {
  const firstLetter = contact.name[0].toLowerCase();

  if (!contacts[firstLetter]) {
    return;
  }

  contacts[firstLetter] = contacts[firstLetter].filter((contactItem) => {
    return (
      contactItem.name !== contact.name ||
      contactItem.vacancy !== contact.vacancy ||
      contactItem.phone !== contact.phone
    );
  });

  if (contacts[firstLetter].length === 0) {
    delete contacts[firstLetter];
  }

  saveContactsToLocalStorage();
}

function getAll(): Contact[] {
  return Object.values(contacts).flat();
}

function getContactsByLetter(letter: string): Contact[] {
  return contacts[letter.toLowerCase()] || [];
}

function getContactsByQuery(query: string): Contact[] {
  const results: Contact[] = [];

  if (query === '') {
    return results;
  }

  const queryLower = query.toLowerCase();
  const allContacts = getAll();

  for (let contact of allContacts) {
    const name = contact.name.toLowerCase();
    const vacancy = contact.vacancy.toLowerCase();
    const phone = contact.phone.toLowerCase();

    if (
      name.startsWith(queryLower) ||
      vacancy.startsWith(queryLower) ||
      phone.startsWith(queryLower)
    ) {
      results.push(contact);
    }
  }

  return results;
}

function fillContactsFromLocalStorage(): void {
  const storedContacts = localStorage.getItem('contacts');

  if (storedContacts) {
    contacts = JSON.parse(storedContacts);
  }
}

function saveContactsToLocalStorage(): void {
  localStorage.setItem('contacts', JSON.stringify(contacts));
}

function clearContacts(): void {
  localStorage.removeItem('contacts');
  contacts = {};
}

fillContactsFromLocalStorage();

export {
  addContact,
  removeContact,
  getContactsByLetter,
  getContactsByQuery,
  editContact,
  clearContacts,
  getAll,
  isContactExists,
};
