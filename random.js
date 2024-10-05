const crypto = require("crypto");

async function hashPass(resetToken) {
    let hash1 = crypto.createHash("sha256").update(resetToken).digest("hex");
    let hash2 = crypto.createHash("sha256").update(resetToken).digest("hex");
    return { hash1, hash2 };
}

hashPass("Arpit").then(function ({ hash1, hash2 }) {
    {
        console.log(hash1);
        console.log(hash2);
    }
});
