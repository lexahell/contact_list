import { getContactsByLetter, removeContact, getAll } from './contacts.js';
import { Contact } from './../types/Contact';
const editForm = document.forms['edit-contact'];

function updateContactInDOM(prevContact: Contact, contact: Contact) {
  const letter = contact.name[0].toLowerCase();
  const prevLetter = prevContact.name[0].toLowerCase();
  const { contactList, itemCount } = getContactListAndItemCount(letter);
  const { contactList: prevContactList, itemCount: prevItemCount } =
    getContactListAndItemCount(prevLetter);

  if (!contactList || !itemCount || !prevContactList || !prevItemCount) {
    return;
  }

  renderContactList(contactList, itemCount, letter);
  renderContactList(prevContactList, prevItemCount, prevLetter);
  renderContactItemByDataAttribute(contact, 'edit', true);
}

function renderContactItemByDataAttribute(
  contact: Contact,
  attribute: string,
  value: boolean
) {
  const contactItem: HTMLElement | null = document.querySelector(
    `[data-${attribute}="${value}"]`
  );

  if (!contactItem) {
    return;
  }

  updateContactItem(contactItem, contact);
  const editButton: HTMLButtonElement | null =
    contactItem.querySelector('.contact__edit-btn');

  if (editButton === null) {
    return;
  }

  const newEditButton = editButton.cloneNode(true);
  editButton.parentNode!.replaceChild(newEditButton, editButton);

  newEditButton.addEventListener('click', () => {
    editForm.dataset.name = contact.name;
    editForm.dataset.vacancy = contact.vacancy;
    editForm.dataset.phone = contact.phone;
    showModal('.edit-modal');
  });
}

function updateContactItem(contactItem: HTMLElement, contact: Contact) {
  const deleteButton: HTMLButtonElement | null = contactItem.querySelector(
    '.contact__delete-btn'
  );
  const editButton: HTMLButtonElement | null =
    contactItem.querySelector('.contact__edit-btn');

  if (deleteButton === null || editButton === null) {
    return;
  }

  const newDeleteButton = deleteButton.cloneNode(true);
  const newEditButton = editButton.cloneNode(true);

  deleteButton.parentNode!.replaceChild(newDeleteButton, deleteButton);
  editButton.parentNode!.replaceChild(newEditButton, editButton);

  contactItem.querySelector(
    '.contact__name'
  )!.textContent = `Имя: ${contact.name}`;
  contactItem.querySelector(
    '.contact__vacancy'
  )!.textContent = `Должность: ${contact.vacancy}`;
  contactItem.querySelector(
    '.contact__phone'
  )!.textContent = `Телефон: ${contact.phone}`;

  newDeleteButton.addEventListener('click', () => {
    const letter = contact.name[0].toLowerCase();
    const { contactList, itemCount } = getContactListAndItemCount(letter);

    if (!contactList || !itemCount) {
      return;
    }

    removeContact(contact);
    renderContactsInModal(getAll());
    renderContactList(contactList, itemCount, contact.name[0]);
  });

  newEditButton.addEventListener('click', () => {
    editForm.dataset.name = contact.name;
    editForm.dataset.vacancy = contact.vacancy;
    editForm.dataset.phone = contact.phone;
    contactItem.dataset.edit = 'true';
    showEditModal('.edit-modal', contact, () => {
      contactItem.removeAttribute('data-edit');
    });
  });
}

function renderContactsInModal(contacts: Contact[] = []) {
  const contactList: HTMLElement | null = document.querySelector(
    '.search-modal__list'
  );
  const contactTemplate: HTMLTemplateElement | null =
    document.querySelector('#contact-template');

  if (contactList === null || contactTemplate === null) {
    return;
  }

  contactList.innerHTML = '';

  contacts.forEach((contact) => {
    const contactClone = contactTemplate.content.cloneNode(
      true
    ) as DocumentFragment;
    const contactItem: HTMLElement = contactClone.querySelector('.contact')!;
    const editButton: HTMLButtonElement =
      contactItem.querySelector('.contact__edit-btn')!;
    updateContactItem(contactItem, contact);
    const deleteButton: HTMLButtonElement = contactItem.querySelector(
      '.contact__delete-btn'
    )!;

    deleteButton.addEventListener('click', () => {
      const letter = contact.name[0].toLowerCase();
      const contactList = document.querySelector(
        `[data-id="${letter}"] .contact__list`
      ) as HTMLElement;
      const itemCount: HTMLElement = document.querySelector(
        `[data-id="${letter}"] .item__button-count`
      ) as HTMLElement;

      if (contactList === null || itemCount === null) {
        return;
      }

      removeContact(contact);
      renderContactsInModal(getAll());
      renderContactList(contactList, itemCount, contact.name[0]);
    });

    editButton.addEventListener('click', () => {
      editForm.dataset.name = contact.name;
      editForm.dataset.vacancy = contact.vacancy;
      editForm.dataset.phone = contact.phone;
      contactItem.dataset.edit = 'true';
      showEditModal('.edit-modal', contact, () => {
        contactItem.removeAttribute('data-edit');
      });
    });

    contactList.appendChild(contactItem);
  });
}

function getContactListAndItemCount(letter: string): {
  contactList: HTMLElement | null;
  itemCount: HTMLElement | null;
} {
  const contactList: HTMLElement | null = document.querySelector(
    `[data-id="${letter}"] .contact__list`
  );
  const itemCount: HTMLElement | null = document.querySelector(
    `[data-id="${letter}"] .item__button-count`
  );
  return { contactList, itemCount };
}

function renderMainTable() {
  const leftColumnLetters = 'abcdefghijklm';
  const rightColumnLetters = 'nopqrstuvwxyz';
  const leftColumn = document.querySelector('.column-left') as HTMLElement;
  const rightColumn = document.querySelector('.column-right') as HTMLElement;

  if (!leftColumn || !rightColumn) {
    return;
  }

  leftColumn.innerHTML = '';
  rightColumn.innerHTML = '';

  renderColumn(leftColumn, leftColumnLetters);
  renderColumn(rightColumn, rightColumnLetters);
}

function renderColumn(column: HTMLElement, letters: string) {
  const template: HTMLTemplateElement = document.querySelector(
    '#table-item-template'
  )!;
  const fragment = document.createDocumentFragment();

  for (let letter of letters) {
    const cloneItem = template.content.cloneNode(true) as HTMLElement;
    const item: HTMLElement = cloneItem.querySelector('.table-item')!;
    const itemButton: HTMLButtonElement = item.querySelector('.item__button')!;
    const itemName: HTMLElement = item.querySelector('.item__button-name')!;
    const itemCount: HTMLElement = item.querySelector('.item__button-count')!;
    const contactList: HTMLElement = item.querySelector('.contact__list')!;

    itemName.textContent = letter.toUpperCase();
    item.dataset.id = letter;

    const contacts = getContactsByLetter(letter);
    itemCount.textContent =
      contacts.length > 0 ? contacts.length.toString() : '';

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

function renderContactList(
  contactList: HTMLElement,
  itemCount: HTMLElement,
  letter: string
) {
  const contacts = getContactsByLetter(letter);
  itemCount.textContent = contacts.length > 0 ? contacts.length.toString() : '';
  const contactTemplate = document.querySelector(
    '#contact-template'
  ) as HTMLTemplateElement;

  contactList.innerHTML = '';

  contacts.forEach((contact) => {
    const cloneContactItem = contactTemplate.content.cloneNode(
      true
    ) as HTMLElement;
    const contactItem: HTMLElement =
      cloneContactItem.querySelector('.contact')!;

    updateContactItem(contactItem, contact);

    contactItem
      .querySelector('.contact__delete-btn')!
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

function showEditModal(
  modalClass: string,
  contact: Contact,
  onClose: () => void
) {
  const formName = document.querySelector(
    '.edit-modal__name'
  ) as HTMLInputElement;
  const formVacancy = document.querySelector(
    '.edit-modal__vacancy'
  ) as HTMLInputElement;
  const formPhone = document.querySelector(
    '.edit-modal__phone'
  ) as HTMLInputElement;

  if (formName && formVacancy && formPhone) {
    formName.value = contact.name;
    formVacancy.value = contact.vacancy;
    formPhone.value = contact.phone;

    showModal(modalClass, onClose);
  }
}

function showModal(modalClass: string, onClose: () => void = () => {}) {
  const modal = document.querySelector(modalClass) as HTMLElement;
  const handlePointerDown = (e: PointerEvent) => {
    const target = e.target as HTMLElement;

    if (target === modal || target.classList.contains('modal-close')) {
      hideModal(modalClass);
      onClose();
      modal.removeEventListener('pointerdown', handlePointerDown);
    }
  };
  modal.classList.add('active');
  document.body.classList.add('no-scroll');

  modal.addEventListener('pointerdown', handlePointerDown);
}

function hideModal(modalClass: string) {
  const modal = document.querySelector(modalClass) as HTMLElement;

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
