
const SIGNS = [
    { id: 1, icon: '♈', translationKey: 'aries' },
    { id: 2, icon: '♉', translationKey: 'taurus' },
    { id: 3, icon: '♊', translationKey: 'gemini' },
    { id: 4, icon: '♋', translationKey: 'cancer' },
    { id: 5, icon: '♌', translationKey: 'leo' },
    { id: 6, icon: '♍', translationKey: 'virgo' },
    { id: 7, icon: '♎', translationKey: 'libra' },
    { id: 8, icon: '♏', translationKey: 'scorpio' },
    { id: 9, icon: '♐', translationKey: 'sagittarius' },
    { id: 10, icon: '♑', translationKey: 'capricorn' },
    { id: 11, icon: '♒', translationKey: 'aquarius' },
    { id: 12, icon: '♓', translationKey: 'pisces' }
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

