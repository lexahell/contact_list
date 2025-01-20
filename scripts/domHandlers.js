import { getContactsByLetter, removeContact, getAll } from './contacts.js';
const editForm = document.forms['edit-contact'];

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

  if (!contactItem) {
    return;
  }

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
  const editButton = contactItem.querySelector('.contact__edit-btn');
  const newDeleteButton = deleteButton.cloneNode(true);
  const newEditButton = editButton.cloneNode(true);

  deleteButton.parentNode.replaceChild(newDeleteButton, deleteButton);
  editButton.parentNode.replaceChild(newEditButton, editButton);

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

  newEditButton.addEventListener('click', () => {
    editForm.dataset.name = contact.name;
    editForm.dataset.vacancy = contact.vacancy;
    editForm.dataset.phone = contact.phone;
    contactItem.dataset.edit = true;
    showEditModal('.edit-modal', contact, () => {
      contactItem.removeAttribute('data-edit');
    });
  });
}

function renderContactsInModal(contacts = []) {
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
  const leftColumnLetters = 'abcdefghijklm';
  const rightColumnLetters = 'nopqrstuvwxyz';
  const leftColumn = document.querySelector('.column-left');
  const rightColumn = document.querySelector('.column-right');

  leftColumn.innerHTML = '';
  rightColumn.innerHTML = '';

  renderColumn(leftColumn, leftColumnLetters);
  renderColumn(rightColumn, rightColumnLetters);
}

function renderColumn(column, letters) {
  const template = document.querySelector('#table-item-template');
  const fragment = document.createDocumentFragment();

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

    fragment.appendChild(item);
  }

  column.appendChild(fragment);
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
  const handlePointerDown = (e) => {
    if (e.target === modal || e.target.classList.contains('modal-close')) {
      hideModal(modalClass);
      onClose();
      modal.removeEventListener('pointerdown', handlePointerDown);
    }
  };
  modal.classList.add('active');
  document.body.classList.add('no-scroll');

  modal.addEventListener('pointerdown', handlePointerDown);
}

function hideModal(modalClass) {
  const modal = document.querySelector(modalClass);
  modal.classList.remove('active');
  document.body.classList.remove('no-scroll');
}

export {
  updateContactInDOM,
  renderContactItemByDataAttribute,
  updateContactItem,
  renderContactsInModal,
  getContactListAndItemCount,
  renderMainTable,
  renderColumn,
  renderContactList,
  showEditModal,
  showModal,
  hideModal,
};
