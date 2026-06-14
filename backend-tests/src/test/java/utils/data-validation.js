function fn() {
    return {
        isValidEmail: function(email) {
            return /^[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}$/.test(email);
        },
        isValidContact: function(contact) {
            return typeof contact.name === 'string'
                && typeof contact.email === 'string'
                && typeof contact.phone === 'string';
        }
    };
}