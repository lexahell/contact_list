import { clearContacts, getAll, getContactsByQuery } from './contacts.js';
import { handleFormSubmit } from './formHandlers.js';
import {
  renderContactsInModal,
  renderMainTable,
  showModal,
} from './domHandlers.js';

const searchButton = document.querySelector(
  '.search-button'
) as HTMLButtonElement;
const clearButton = document.querySelector(
  '.clear-button'
) as HTMLButtonElement;
const showAllButton = document.querySelector(
  '.search-modal__show-all'
) as HTMLButtonElement;
const searchModalInput = document.querySelector(
  '.search-modal__input'
) as HTMLInputElement;
const addForm = document.forms['add-contact'] as HTMLFormElement;
const editForm = document.forms['edit-contact'] as HTMLFormElement;

searchModalInput.addEventListener('input', () => {
  const inputValue = searchModalInput.value.trim();
  renderContactsInModal(getContactsByQuery(inputValue));
});
showAllButton.addEventListener('click', () => {
  renderContactsInModal(getAll());
  searchModalInput.value = '';
});
searchButton.addEventListener('click', () => {
  showModal('.search-modal', () => {
    renderContactsInModal();
    searchModalInput.value = '';
  });
});
clearButton.addEventListener('click', () => {
  clearContacts();
  renderMainTable();
});
addForm.addEventListener('submit', handleFormSubmit(addForm, 'add'));
editForm.addEventListener('submit', handleFormSubmit(editForm, 'edit'));

renderMainTable();
