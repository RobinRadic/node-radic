function parts(key) {
    if (Array.isArray(key)) return key;
    return key.split('.')
}

function lookup(obj, key) {
    key = parts(key);
    var lastKey = key.pop();
    for (var i = 0, l = key.length; i < l; i++) {
        var part = key[i];
        if (!(part in obj)) obj[part] = {};
        obj = obj[part];
        if (!obj) throw new Error('dotaccess: incompatible value in ' + part)
    }
    return [obj, lastKey];
}


var dotaccess = module.exports = {

    /**
     * Set it
     * @memberOf util
     * @param {object} obj - The object (json) to alter
     * @param {string} key - The key/path, converts dot to child members
     * @param {any} value - The value. Supports all JSON allowable values
     * @param {boolean} overwrite - If true, it will overwrite values already set
     */
    dot_set: function (obj, key, value, overwrite) {
        var objectAndKey = lookup(obj, key),
            obj = objectAndKey[0],
            key = objectAndKey[1];
        if (overwrite || !(key in obj)) obj[key] = value
    },

    /**
     * Get it
     * @memberOf util
     * @param {object} obj - The object (json) to alter
     * @param {string} key - The key/path, converts dot to child members
     * @param def
     * @returns {object} obj
     */
    dot_get: function (obj, key, def) {
        if (typeof key === 'undefined') {
            return obj;
        }
        key = parts(key);
        for (var i = 0, l = key.length; i < l; i++) {
            var part = key[i];
            if (!(part in obj)) return def;
            obj = obj[part]
        }
        return obj
    },

    /**
     * Delete it
     * @memberOf util
     * @param {object} obj - The object (json) to alter
     * @param {string} key - The key/path, converts dot to child members
     * @returns {boolean}
     */
    dot_del: function (obj, key) {
        var objectAndKey = lookup(obj, key),
            obj = objectAndKey[0],
            key = objectAndKey[1];
        return delete obj[key];
    }
};
