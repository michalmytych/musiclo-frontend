/**
 * 
 * Constant values and commonly used functions.
 * 
 */

export const KEYS = [
    {"id" : 0,  "name" 	: "C"},
    {"id" : 1,  "name" 	: "C#"},
    {"id" : 2,  "name" 	: "D"},
    {"id" : 3,  "name" 	: "D#"},
    {"id" : 4,  "name" 	: "E"},
    {"id" : 5,  "name" 	: "F"},
    {"id" : 6,  "name" 	: "F#"},
    {"id" : 7,  "name" 	: "G"},
    {"id" : 8,  "name" 	: "G#"},
    {"id" : 9, "name" 	: "A"},
    {"id" : 10, "name" 	: "B"},
]

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function encodeMusicKey(key_number) {
    if (!key_number && key_number!==0) return; 
    key_number = parseInt(key_number);
    var key = KEYS.filter(key => ( key.id === key_number ))[0];        
    if (key && key.name) return key.name;
}

export function formatDatetime(iso_str) {
    const monthNames = [
        "stycznia",
        "lutego",
        "marca",
        "kwietnia",
        "maja",
        "czerwca",
        "lipca",
        "sierpnia",
        "września",
        "października",
        "listopada",
        "grudnia"
    ];
    var datetime = new Date(iso_str);
    var day = datetime.getDay();
    if (!parseInt(day)) { day="X" };    
    return day + ' ' + monthNames[datetime.getMonth()] + ' ' + datetime.getFullYear();
}

export function onlyUniqueFilter(value, index, self) {
    return self.indexOf(value) === index;
}

export function uniqueArrayOfObjects(array, keyToBeUnique) {
    if (!array) return [];
    try {
        return array.filter((x, xi) => !array.slice(xi + 1)
        .some(y => y[keyToBeUnique] === x[keyToBeUnique]));
    } catch (error) {
        alert("To nie jest poprawny wybór!");
        console.log(error);
    }            
    
}

export const objectsEqual = (o1, o2) =>
    Object.keys(o1).length === Object.keys(o2).length 
        && Object.keys(o1).every(p => o1[p] === o2[p]);


export const validateItems = (_items) => (_items.filter( i => { 
    if (i) { return i.name } else { return false; }} 
));
