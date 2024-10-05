const Helper = require("./utils/helper.util");

let createPasswordResetToken = function () {
    const fourDigitNum = Helper.getRandomNum(1, 3);
    const fourAlphaStr = Helper.getRandomAlphabets(4);
    const token = `${fourDigitNum}-${fourAlphaStr}`;
    return token;
};

for (let i = 0; i < 20; i++) {
    console.log(createPasswordResetToken());
}
