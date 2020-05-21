export function nestedValue(mainObject, key) {
    try {
        return key.split('.').reduce((obj, property) => obj[property], mainObject);
    } catch (err) {
        return null;
    }
};
