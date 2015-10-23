'use strict';

var VALID_NAME = /^[_a-zа-я0-9][ _\-a-zа-я0-9]*[_a-zа-я0-9]$/i;
var VALID_PHONE = /^\+?\d{1,2} *(\d{3}|\(\d{3}\)) *(\d[ \-]?){7}$/;
var VALID_EMAIL = /^[_\-a-zа-я0-9]+@[_\-a-zа-я0-9]+(\.[a-zа-я0-9]+)?(\.[a-zа-я]+)$/i;

var phoneBook = [];

/*
   Функция добавления записи в телефонную книгу.
   На вход может прийти что угодно, будьте осторожны.
*/
module.exports.add  = function add (name, phone, email) {
    var isValidName = VALID_NAME.test(name);
    var isValidPhone = VALID_PHONE.test(phone);
    var isValidEmail = VALID_EMAIL.test(email);
    /* Проверка записей на валидность. */
    if(isValidName
        && isValidPhone
        && isValidEmail) {
        phoneBook.push(new Contact(name, phone, email));
    }
};

/*
   Функция поиска записи в телефонную книгу.
   Поиск ведется по всем полям.
*/
module.exports.find = function find (query) {
    var indexes = _findByQuery(query);
    var length = indexes.length;
    /* Вывод в консоль найденных записей */
    console.log('Найдено: '+length);
    for (var i=0; i<length; ++i) {
        var index = indexes[i];
        console.log(phoneBook[index].toString());
    }
};

/*
   Функция удаления записи в телефонной книге.
*/
module.exports.remove = function remove (query) {
    var indexes = _findByQuery(query);
    var length = indexes.length;
    /* Вывод в консоль найденных записей */
    console.log('Удалено: '+length);
    for (var i=0; i<length; ++i) {
        var index = indexes[i];
        console.log(phoneBook[index].toString());
        phoneBook.splice(index, 1);
    }
};

/*
   Функция импорта записей из файла (задача со звёздочкой!).
*/
module.exports.importFromCsv = function importFromCsv (filename) {
    var data = require('fs').readFileSync(filename, 'utf-8');
    /* Windows - '\r\n', Unix - '\n' */
    var dataArray = data.split(/\r\n|\n/g);
    for (var i=0; i<dataArray.length; ++i) {
        var record = dataArray[i].split(';');
        module.exports.add(record[0], record[1], record[2]);
    }
};

/*
   Функция вывода всех телефонов в виде ASCII (задача со звёздочкой!).
*/
module.exports.showTable = function showTable () {
    /* Формирование таблицы. */
    var table = new Table(25, 25, 25);
    console.log(table.printLine('┌', '┬', '╥', '┐'));
    console.log(table.printInfo('Имя', 'Телефон', 'Email'));
    console.log(table.printLine('├', '┼', '╫', '┤'));
    phoneBook.forEach(function (record) {
        console.log(table.printInfo(record.name, _formatPhone(record.phone), record.email));
    });
    console.log(table.printLine('└', '┴', '╨', '┘'));
};

/*
    Создание объекта Контакт. 3 поля, 2 метода.
 */
function Contact(name, phone, email) {
    this.name  = name;
    this.phone = phone.replace(/[\+\-\s+\(\)]/g, '');
    this.email = email;
    this.compare = function(query) {
        return this.name.indexOf(query) >= 0
            || this.phone.indexOf(query.replace(/[\+\-\s+\(\)]/g, '')) >= 0
            || this.email.indexOf(query) >= 0;
    };
    this.toString = function() {
        return this.name + ', '
            + _formatPhone(this.phone) + ', '
            + this.email;
    };
}

/*
 Создание объекта Таблица.
 */
function Table(widthName, widthPhone, widthEmail) {
    this.widthName = widthName;
    this.widthPhone = widthPhone;
    this.widthEmail = widthEmail;
    this.printLine = function(charLeft, charMidLeft, charMidRight, charRight) {
        var result = '';
        result += charLeft + this._repeat('-', widthName)
                + charMidLeft + this._repeat('-', widthPhone)
                + charMidRight + this._repeat('-', widthEmail)
                + charRight;
        return result;
    };
    this.printInfo = function(name, phone, email) {
        var result = '';
        result += '│ ' + name + this._repeat(' ', widthName - name.length - 1)
                    + '│ ' + phone + this._repeat(' ', widthPhone - phone.length - 1)
                    + '║ ' + email + this._repeat(' ', widthEmail - email.length - 1)
                    + '│';
        return result;
    };
    this._repeat = function(string, count) {
        var result = '';
        for (var i=0; i<count; ++i) {
            result += string;
        }
        return result;
    };
}

/*
 Поиск по запросу в телефонной книге.
 */
function _findByQuery (query) {
    var indexList = [];
    /* Проверяем если такая запись. */
    for (var i=0; i<phoneBook.length; ++i) {
        if (phoneBook[i].compare(query)) {
            indexList.push(i);
        }
    }
    /* Возвращаем массив индексов */
    return indexList;
}

/*
 Приводим номера телефонов к нужному виду.
 */
function _formatPhone(phone) {
    var result = '';
    /* Правильный формат: +7 (999) 666-7-778 */
    var lengthCountry = phone.length - 10;
    result += '+';
    result += phone.substr(0, lengthCountry);
    result += ' (' + phone.substr(lengthCountry, 3) + ') ';
    result += phone.substr(lengthCountry + 3, 3);
    result += '-' + phone.substr(lengthCountry + 6, 2);
    result += '-' + phone.substr(lengthCountry + 8, 2);
    return result;
}
