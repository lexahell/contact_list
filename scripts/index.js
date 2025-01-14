import {
  addContact,
  clearContacts,
  editContact,
  getAll,
  getContactsByLetter,
  getContactsByQuery,
  isContactExists,
  removeContact,
} from './contacts.js';

const searchButton = document.querySelector('.search-button');
const clearButton = document.querySelector('.clear-button');
const showAllButton = document.querySelector('.search-modal__show-all');
const searchModalInput = document.querySelector('.search-modal__input');
const addForm = document.forms['add-contact'];
const editForm = document.forms['edit-contact'];

searchModalInput.addEventListener('input', () => {
  const inputValue = searchModalInput.value.trim();
  renderContactsInModal(getContactsByQuery(inputValue));
});

showAllButton.addEventListener('click', () => {
  renderContactsInModal(getAll());
});

searchButton.addEventListener('click', () => {
  showModal('.search-modal');
});

clearButton.addEventListener('click', () => {
  clearContacts();
  renderMainTable();
});

addForm.addEventListener('submit', handleFormSubmit(addForm, 'add'));
editForm.addEventListener('submit', handleFormSubmit(editForm, 'edit'));

function handleFormSubmit(form, actionType = 'add') {
  return (e) => {
    e.preventDefault();

    const { name, vacancy, phone } = form;
    const contact = {
      name: name.value.trim(),
      vacancy: vacancy.value.trim(),
      phone: phone.value.trim(),
    };

    if (
      !validateForm(form) ||
      (actionType === 'edit' && isContactExists(contact))
    ) {
      return;
    }

    if (actionType === 'edit') {
      const prevContact = {
        name: form.dataset.name,
        vacancy: form.dataset.vacancy,
        phone: form.dataset.phone,
      };

      if (editContact(prevContact, contact)) {
        updateContactInDOM(prevContact, contact);
        hideModal('.edit-modal');
      }
      return;
    }

    if (actionType === 'add') {
      if (isContactExists(contact)) {
        showFormError("Contact List can't contain 2 equals contacts");
        return;
      }

      const letter = contact.name[0].toLowerCase();
      const { contactList, itemCount } = getContactListAndItemCount(letter);

      addContact(contact);
      renderContactList(contactList, itemCount, letter);
    }
  };
}

function validateForm(form) {
  const { name, vacancy, phone } = form;
  const isValid = [
    validateInput(name, 'text'),
    validateInput(vacancy, 'text'),
    validateInput(phone, 'phone'),
  ].every(Boolean);

  if (!isValid) {
    showFormError('Error');
  }

  return isValid;
}

function showFormError(message) {
  const formError = document.querySelector('.form__error');
  formError.textContent = message;
  formError.classList.add('active');
  setTimeout(() => formError.classList.remove('active'), 3000);
}

function validateInput(input, type) {
  const value = input.value.trim();
  const valueLength = value.length;

  if (!value) {
    return showInputError(input, 'Empty input');
  }

  if (type === 'text') {
    if (!/^[a-zA-Z\s]+$/.test(value)) {
      showInputError(input, 'Invalid value');
      return false;
    }

    if (valueLength < 2) {
      showInputError(input, "Can't be less than 2 symbols");
      return false;
    }

    if (valueLength > 20) {
      showInputError(input, "Can't be more than 20 symbols");
      return false;
    }
  } else if (type === 'phone') {
    if (!value.startsWith('+') || !/^\d+$/.test(value.slice(1))) {
      showInputError(input, 'Invalid phone number');
      return false;
    }

    if (valueLength < 5) {
      showInputError(input, "Can't be less than 5 symbols");
      return false;
    }

    if (valueLength > 30) {
      showInputError(input, "Can't be more than 30 symbols");
      return false;
    }
  }

  return true;
}

function showInputError(input, placeholder) {
  input.value = '';
  input.placeholder = placeholder;
  input.classList.add('input-error');
  setTimeout(() => input.classList.remove('input-error'), 3000);
}

function updateContactInDOM(prevContact, contact) {
  const letter = contact.name[0].toLowerCase();
  const prevLetter = prevContact.name[0].toLowerCase();

  const { contactList, itemCount } = getContactListAndItemCount(letter);
  const { contactList: prevContactList, itemCount: prevItemCount } =
    getContactListAndItemCount(prevLetter);

  renderContactList(contactList, itemCount, letter);
  renderContactList(prevContactList, prevItemCount, prevLetter);
  renderContactItemByDataAttribute(contact, 'edit', true);
}

function renderContactItemByDataAttribute(contact, attribute, value) {
  const contactItem = document.querySelector(`[data-${attribute}="${value}"]`);
  updateContactItem(contactItem, contact);
  const editButton = contactItem.querySelector('.contact__edit-btn');
  const newEditButton = editButton.cloneNode(true);
  editButton.parentNode.replaceChild(newEditButton, editButton);

  newEditButton.addEventListener('click', () => {
    editForm.dataset.name = contact.name;
    editForm.dataset.vacancy = contact.vacancy;
    editForm.dataset.phone = contact.phone;
    showModal('.edit-modal');
  });
}

function updateContactItem(contactItem, contact) {
  const deleteButton = contactItem.querySelector('.contact__delete-btn');
  const newDeleteButton = deleteButton.cloneNode(true);
  deleteButton.parentNode.replaceChild(newDeleteButton, deleteButton);

  contactItem.querySelector(
    '.contact__name'
  ).textContent = `Имя: ${contact.name}`;
  contactItem.querySelector(
    '.contact__vacancy'
  ).textContent = `Должность: ${contact.vacancy}`;
  contactItem.querySelector(
    '.contact__phone'
  ).textContent = `Телефон: ${contact.phone}`;

  newDeleteButton.addEventListener('click', () => {
    const letter = contact.name[0].toLowerCase();
    const { contactList, itemCount } = getContactListAndItemCount(letter);

    removeContact(contact);
    renderContactsInModal(getAll());
    renderContactList(contactList, itemCount, contact.name[0]);
  });
}

function renderContactsInModal(contacts) {
  const contactList = document.querySelector('.search-modal__list');
  const contactTemplate = document.querySelector('#contact-template');

  contactList.innerHTML = '';

  contacts.forEach((contact) => {
    const contactItem = contactTemplate.content
      .cloneNode(true)
      .querySelector('.contact');
    const editButton = contactItem.querySelector('.contact__edit-btn');
    editButton.classList.add('active');

    updateContactItem(contactItem, contact);

    contactItem
      .querySelector('.contact__delete-btn')
      .addEventListener('click', () => {
        const letter = contact.name[0].toLowerCase();
        const contactList = document.querySelector(
          `[data-id="${letter}"] .contact__list`
        );
        const itemCount = document.querySelector(
          `[data-id="${letter}"] .item__button-count`
        );

        removeContact(contact);
        renderContactsInModal(getAll());
        renderContactList(contactList, itemCount, contact.name[0]);
      });

    editButton.addEventListener('click', () => {
      editForm.dataset.name = contact.name;
      editForm.dataset.vacancy = contact.vacancy;
      editForm.dataset.phone = contact.phone;
      contactItem.dataset.edit = true;
      showEditModal('.edit-modal', contact, () => {
        contactItem.removeAttribute('data-edit');
      });
    });

    contactList.appendChild(contactItem);
  });
}

function getContactListAndItemCount(letter) {
  const contactList = document.querySelector(
    `[data-id="${letter}"] .contact__list`
  );
  const itemCount = document.querySelector(
    `[data-id="${letter}"] .item__button-count`
  );
  return { contactList, itemCount };
}

function renderMainTable() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const firstColumn = document.querySelector('.column-first');
  const secondColumn = document.querySelector('.column-second');

  firstColumn.innerHTML = '';
  secondColumn.innerHTML = '';

  renderColumn(firstColumn, alphabet.slice(0, alphabet.length / 2));
  renderColumn(secondColumn, alphabet.slice(alphabet.length / 2));
}

function renderColumn(column, letters) {
  const template = document.querySelector('#table-item-template');
  const frag = document.createDocumentFragment();

  for (let letter of letters) {
    const item = template.content.cloneNode(true).querySelector('.table-item');
    const itemButton = item.querySelector('.item__button');
    const itemName = item.querySelector('.item__button-name');
    const itemCount = item.querySelector('.item__button-count');
    const contactList = item.querySelector('.contact__list');

    itemName.textContent = letter.toUpperCase();
    item.dataset.id = letter;

    const contacts = getContactsByLetter(letter);
    itemCount.textContent = contacts.length || '';

    renderContactList(contactList, itemCount, letter);

    itemButton.addEventListener('click', () => {
      if (contactList.children.length === 0) {
        return;
      }

      contactList.hidden = !contactList.hidden;
    });

    frag.appendChild(item);
  }

  column.appendChild(frag);
}

function renderContactList(contactList, itemCount, letter) {
  const contacts = getContactsByLetter(letter);
  itemCount.textContent = contacts.length || '';
  const contactTemplate = document.querySelector('#contact-template');

  contactList.innerHTML = '';

  contacts.forEach((contact) => {
    const contactItem = contactTemplate.content
      .cloneNode(true)
      .querySelector('.contact');
    updateContactItem(contactItem, contact);

    contactItem
      .querySelector('.contact__delete-btn')
      .addEventListener('click', () => {
        removeContact(contact);
        renderContactList(contactList, itemCount, letter);
      });

    contactList.appendChild(contactItem);
  });

  if (contacts.length === 0) {
    contactList.hidden = true;
  }
}

function showEditModal(modalClass, contact, onClose) {
  const formName = document.querySelector('.edit-modal__name');
  const formVacancy = document.querySelector('.edit-modal__vacancy');
  const formPhone = document.querySelector('.edit-modal__phone');

  formName.value = contact.name;
  formVacancy.value = contact.vacancy;
  formPhone.value = contact.phone;

  showModal(modalClass, onClose);
}

function showModal(modalClass, onClose = () => {}) {
  const modal = document.querySelector(modalClass);
  modal.classList.add('active');
  document.body.classList.add('no-scroll');
  modal.addEventListener('pointerdown', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-close')) {
      hideModal(modalClass);
      onClose();
    }
  });
}

function hideModal(modalClass) {
  const modal = document.querySelector(modalClass);
  modal.classList.remove('active');
  document.body.classList.remove('no-scroll');
}

renderMainTable();
