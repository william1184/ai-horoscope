const SIGNS = [
    { id: 1, name: 'Áries', icon: '♈' },
    { id: 2, name: 'Touro', icon: '♉' },
    { id: 3, name: 'Gêmeos', icon: '♊' },
    { id: 4, name: 'Câncer', icon: '♋' },
    { id: 5, name: 'Leão', icon: '♌' },
    { id: 6, name: 'Virgem', icon: '♍' },
    { id: 7, name: 'Libra', icon: '♎' },
    { id: 8, name: 'Escorpião', icon: '♏' },
    { id: 9, name: 'Sagitário', icon: '♐' },
    { id: 10, name: 'Capricórnio', icon: '♑' },
    { id: 11, name: 'Aquário', icon: '♒' },
    { id: 12, name: 'Peixes', icon: '♓' }
];

/**
 * Get a sign by its ID.
 * @param {number} id - The ID of the sign.
 * @returns {object|null} - The sign object or null if not found.
 */
function getSignFromId(id) {
    return SIGNS.find(sign => sign.id == id) || null;
}

/**
 * List all signs.
 * @returns {Array} - An array of all sign objects.
 */
function listSigns() {
    return SIGNS;
}

export { getSignFromId, listSigns };

