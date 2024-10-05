exports.getRandomNum = function (min, max) {
    const randomVal = Math.random();
    return Math.floor(randomVal * (max - min + 1)) + min;
};

exports.getRandomAlphabets = function (length) {
    const randomArr = [];
    for (let i = 0; i < length; i++) {
        randomArr.push(exports.getRandomNum(65, 90));
    }
    return String.fromCharCode(...randomArr);
};

exports.convertToMilliseconds = function ({ hours, minutes, seconds }) {
    let res = 0;
    if (hours) {
        res += hours * 60 * 60 * 1000;
    }
    if (minutes) {
        res += minutes * 60 * 1000;
    }
    if (seconds) {
        res += seconds * 1000;
    }
    return res;
};
