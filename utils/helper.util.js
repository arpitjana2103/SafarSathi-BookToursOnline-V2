exports.getRandomNum = function (min, max) {
    const randomVal = Math.random();
    return Math.trunc(randomVal * (max - min + 1)) + min;
};

exports.getRandomAlphabets = function (length) {
    const randomArr = [];
    for (let i = 0; i < length; i++) {
        randomArr.push(exports.getRandomNum(65, 90));
    }
    return String.fromCharCode(...randomArr);
};
