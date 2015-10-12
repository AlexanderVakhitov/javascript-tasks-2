'use strict';

var VALID_NAME = /^[ _\-a-zа-я0-9]+$/i;
var VALID_PHONE = /^\+?\d{0,2} *(\d{3}|\(\d{3}\)) *\d{3}(-| *)?\d(-| *)?\d{3}$/;
var VALID_EMAIL = /^[_\-a-zа-я0-9]+@[_\-a-zа-я0-9]+(\.[a-zа-я0-9]+)+$/i;

var phoneBook = [];

/*
   Функция добавления записи в телефонную книгу.
   На вход может прийти что угодно, будьте осторожны.
*/
var add = function(name, phone, email) {
    /* Проверка записей на валидность. */
    if(VALID_NAME.test(name)
        && VALID_PHONE.test(phone)
        && VALID_EMAIL.test(email)) {
        phoneBook.push(new contact(name, phone, email));
    }
};

/*
   Функция поиска записи в телефонную книгу.
   Поиск ведется по всем полям.
*/
var find = function(query) {
    var counter = 0;
    /* Проверяем если такая запись. */
    for (var i=0; i<phoneBook.length; ++i) {
        if (phoneBook[i].compare(query)) {
            console.log(phoneBook[i].toString());
            ++counter;
        }
    }
    /* Выводим кол-во найденных записей */
    console.log('Всего найдено: ' + counter + '\r\n');
};

/*
   Функция удаления записи в телефонной книге.
*/
var remove = function(query) {
    var counter = 0;
    /* Проверяем если такая запись. */
    for (var i=0; i<phoneBook.length; ++i) {
        if (phoneBook[i].compare(query)) {
            console.log(phoneBook[i].toString());
            phoneBook.splice(i--, 1);
            ++counter;
        }
    }
    /* Выводим кол-во удаленных записей */
    console.log('Всего удалено: ' + counter + '\r\n');
};

/*
   Функция импорта записей из файла (задача со звёздочкой!).
*/
var importFromCsv = function(filename) {
    var data = require('fs').readFileSync(filename, 'utf-8');
    /* Windows - '\r\n', Unix - '\n' */
    var dataArray = data.split(/\r\n|\n/g);
    for (var i=0; i<dataArray.length; ++i) {
        var record = dataArray[i].split(';');
        add(record[0], record[1], record[2]);
    }
};

/*
   Функция вывода всех телефонов в виде ASCII (задача со звёздочкой!).
*/
var showTable = function() {
    /* Реализация где-то тут. */
};

/*
    Создание объекта Контакт. 3 поля, 2 метода.
 */
var contact = function(name, phone, email) {
    this.name  = name;
    this.phone = phone.replace(/[\+\-\s+\(\)]/g, '');
    this.email = email;
    this.compare = function(query) {
        return query === undefined
            || this.name.indexOf(query) >= 0
            || this.phone.indexOf(query.replace(/[\+\-\s+\(\)]/g, '')) >= 0
            || this.email.indexOf(query) >= 0;
    };
    this.toString = function() {
        return this.name + ', '
            + this.phone + ', '
            + this.email;
    };
};

module.exports.add = add;
module.exports.find = find;
module.exports.remove = remove;
module.exports.importFromCsv = importFromCsv;
module.exports.showTable = showTable;
