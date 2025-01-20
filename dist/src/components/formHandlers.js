import { isContactExists, addContact, editContact, getContactsByQuery, } from './contacts.js';
import { getContactListAndItemCount, hideModal, renderContactList, renderContactsInModal, updateContactInDOM, } from './domHandlers.js';
function handleFormSubmit(form, actionType = 'add') {
    return (e) => {
        e.preventDefault();
        const nameInput = form.elements.namedItem('name');
        const vacancyInput = form.elements.namedItem('vacancy');
        const phoneInput = form.elements.namedItem('phone');
        if (!nameInput || !vacancyInput || !phoneInput) {
            return;
        }
        const contact = {
            name: nameInput.value.trim(),
            vacancy: vacancyInput.value.trim(),
            phone: phoneInput.value.trim(),
        };
        const withShowError = actionType === 'add';
        if (!validateForm(form, withShowError)) {
            return;
        }
        if (actionType === 'edit') {
            if (isContactExists(contact)) {
                return;
            }
            const inputElement = document.querySelector('.search-modal__input');
            const inputValue = inputElement.value.trim();
            const prevContact = {
                name: form.dataset.name,
                vacancy: form.dataset.vacancy,
                phone: form.dataset.phone,
            };
            editContact(prevContact, contact);
            if (!isContactExists(contact)) {
                return;
            }
            if (inputValue !== '') {
                renderContactsInModal(getContactsByQuery(inputValue));
            }
            updateContactInDOM(prevContact, contact);
            hideModal('.edit-modal');
        }
        if (actionType === 'add') {
            if (isContactExists(contact)) {
                showFormError("Contact List can't contain 2 equals contacts");
                return;
            }
            const letter = contact.name[0].toLowerCase();
            const { contactList, itemCount } = getContactListAndItemCount(letter);
            if (!contactList || !itemCount) {
                return;
            }
            addContact(contact);
            renderContactList(contactList, itemCount, letter);
        }
    };
}
function validateForm(form, withShowError = false) {
    const nameInput = form.elements.namedItem('name');
    const vacancyInput = form.elements.namedItem('vacancy');
    const phoneInput = form.elements.namedItem('phone');
    if (!nameInput || !vacancyInput || !phoneInput) {
        return false;
    }
    const isValid = [
        validateInput(nameInput, 'text'),
        validateInput(vacancyInput, 'text'),
        validateInput(phoneInput, 'phone'),
    ].every(Boolean);
    if (!isValid && withShowError) {
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
    const MIN_TEXT_LENGTH = 2;
    const MAX_TEXT_LENGTH = 20;
    const MIN_PHONE_LENGTH = 5;
    const MAX_PHONE_LENGTH = 30;
    const value = input.value.trim();
    const valueLength = value.length;
    if (!value) {
        showInputError(input, 'Empty input');
        return false;
    }
    if (type === 'text') {
        if (!/^[a-zA-Z\s]+$/.test(value)) {
            showInputError(input, 'Invalid value');
            return false;
        }
        if (valueLength < MIN_TEXT_LENGTH) {
            showInputError(input, `Can't be less than ${MIN_TEXT_LENGTH} symbols`);
            return false;
        }
        if (valueLength > MAX_TEXT_LENGTH) {
            showInputError(input, `Can't be more than ${MAX_TEXT_LENGTH} symbols`);
            return false;
        }
    }
    else if (type === 'phone') {
        if (!value.startsWith('+') || !/^\d+$/.test(value.slice(1))) {
            showInputError(input, 'Invalid phone number');
            return false;
        }
        if (valueLength < MIN_PHONE_LENGTH) {
            showInputError(input, `Can't be less than ${MIN_PHONE_LENGTH} symbols`);
            return false;
        }
        if (valueLength > MAX_PHONE_LENGTH) {
            showInputError(input, `Can't be more than ${MAX_PHONE_LENGTH} symbols`);
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
export { handleFormSubmit };
//# sourceMappingURL=formHandlers.js.map