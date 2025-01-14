let contacts = {};
fillContactsFromLocalStorage();


function addContact(contact) {
  const firstLetter = contact.name[0].toLowerCase();

  if (!contacts[firstLetter]) {
    contacts[firstLetter] = [];
  }

  if (!isContactExists(contact)) {
    contacts[firstLetter].push(contact);
    saveContactsToLocalStorage();
  }
}

function isContactExists(contact) {
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

function editContact(prevContact, newContact) {
  if (isContactExists(prevContact) && !isContactExists(newContact)) {
    removeContact(prevContact);
    addContact(newContact);
    return true;
  }
  
  return false;
}

function removeContact(contact) {
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

function getAll() {
  let allContacts = [];
  for (let letter of Object.keys(contacts)) {
    for (let contact of contacts[letter]) {
      allContacts.push(contact);
    }
  }

  return allContacts;
}

function getContactsByLetter(letter) {
  return contacts[letter.toLowerCase()] || [];
}

function getContactsByQuery(query) {
  const queryLower = query.toLowerCase();
  const firstLetter = queryLower[0];
  const results = [];

  if (!contacts[firstLetter]) {
    return results;
  }

  for (let contact of contacts[firstLetter]) {
    const name = contact.name.toLowerCase();

    if (name.startsWith(queryLower)) {
      results.push(contact);
    }
  }

  return results;
}

function fillContactsFromLocalStorage() {
  const storedContacts = localStorage.getItem('contacts');

  if (storedContacts) {
    contacts = JSON.parse(storedContacts);
  }
}

function saveContactsToLocalStorage() {
  localStorage.setItem('contacts', JSON.stringify(contacts));
}

function clearContacts() {
  localStorage.removeItem('contacts');
  contacts = {};
}

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
