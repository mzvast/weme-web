module.exports = {
    "rules": {
        "indent": [
            0,
            "tab"
        ],
        "quotes": [
            0,
            "single"
        ],
        "linebreak-style": [
            0,
            "unix"
        ],
        "semi": [
            1,
            "always"
        ],
        "no-mixed-spaces-and-tabs": [0, "smart-tabs"],
        "no-console": 0,
        "no-redeclare": 1,
        "no-extra-semi": 1
    },
    "globals": {
        "ko": true,
        "module": true,
        "$": false
    },
    "env": {
        "browser": true
    },
    "extends": "eslint:recommended"
};