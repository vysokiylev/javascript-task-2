'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/**
 * Телефонная книга
 */
var phoneBook = [];
exports.phoneBook = phoneBook;

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} isValid
 */
exports.add = function (phone, name, email) {
    if (arguments.length === 2) {
        email = '';
    }
    var isNoteValid = isPhoneValid(phone) && name;
    var exists = false;
    for (var i = 0; i < phoneBook.length; i++) {
        if (phone === phoneBook[i].phone) {
            exists = true;
            break;
        }
    }
    if (isNoteValid && !exists) {
        phoneBook.push({ name: name, phone: phone, email: email });
    }

    return isNoteValid && !exists;
};
function isPhoneValid(phone) {
    var re = /^\d{10}$/;

    return re.test(phone);
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} updated
 */
exports.update = function (phone, name, email) {
    if (arguments[2] === undefined) {
        email = '';
    }
    var isUpdated = false;
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].email === undefined) {
            phoneBook[i].email = '';
        } else
        if ((phoneBook[i].phone === phone) && name) {
            phoneBook[i].email = email;
            phoneBook[i].name = name;
            isUpdated = true;
        }
    }

    return isUpdated;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} count
 */
exports.findAndRemove = function (query) {
    if (typeof query !== 'string' || !query) {
        return 0;
    }
    if (query === '*') {
        query = '';
    }

    return findByQuery(query);
};
function findByQuery(query) {
    var count = 0;
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i].name.indexOf(query) !== -1 || phoneBook[i].email.indexOf(query) !== -1 ||
            phoneBook[i].phone.indexOf(query) !== -1) {
            phoneBook.splice(i, 1);
            i--;
            count++;
        }
    }

    return count;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} result
 */
exports.find = function (query) {
    if (typeof query !== 'string' || query === '') {
        return [];
    }
    if (query === '*') {
        return transformArray(phoneBook);
    }
    function filterByQuery(item) {
        return item.email ? (item.phone.indexOf(query) !== -1 ||
        item.name.indexOf(query) !== -1 || item.email.indexOf(query) !== -1)
            : (item.phone.indexOf(query) !== -1 || item.name.indexOf(query) !== -1);
    }
    var filtered = phoneBook.filter(filterByQuery);
    var result = transformArray(filtered);

    return result;
};
function transformPhone(phone) {
    return '+7 (' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' +
        phone.slice(6, 8) + '-' + phone.slice(8);
}
function transformArray(arr) {

    return arr.map(function (item) {
        var result = [];
        result.push(item.name);
        result.push(transformPhone(item.phone));
        if (item.email) {
            result.push(item.email);
        }

        return result.join(', ');

    }).sort();

}


/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    if (!csv) {
        return 0;
    }
    var notes = csv.split('\n');
    var count = 0;
    for (var i = 0; i < notes.length; i++) {
        var note = {
            name: notes[i].split(';')[0],
            phone: notes[i].split(';')[1],
            email: notes[i].split(';')[2]
        };
        if (exports.add(note.phone, note.name, note.email) ||
            exports.update(note.phone, note.name, note.email)) {
            count++;
        }
    }

    return count;
};
