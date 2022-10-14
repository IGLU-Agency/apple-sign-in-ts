"use strict";
/// APPLE SIGN IN TS
///
/// Copyright © 2020 - 2022 IGLU. All rights reserved.
/// Copyright © 2020 - 2022 IGLU
///
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppleSignIn = exports.AppleSignInPlatform = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const querystring_1 = tslib_1.__importDefault(require("querystring"));
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const fs_1 = tslib_1.__importDefault(require("fs"));
var AppleSignInPlatform;
(function (AppleSignInPlatform) {
    AppleSignInPlatform[AppleSignInPlatform["ios"] = 0] = "ios";
    AppleSignInPlatform[AppleSignInPlatform["android"] = 1] = "android";
    AppleSignInPlatform[AppleSignInPlatform["web"] = 2] = "web";
})(AppleSignInPlatform = exports.AppleSignInPlatform || (exports.AppleSignInPlatform = {}));
class AppleSignIn {
    constructor(config, privateKey, privateKeyMethod) {
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "privateKeyMethod", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "privateKeyLocation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "privateKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.config = config;
        this.state = "";
        this.privateKeyLocation = privateKey;
        if (typeof privateKeyMethod == "undefined") {
            this.privateKeyMethod = "file";
        }
        else if (privateKeyMethod == "text" || privateKeyMethod == "file") {
            this.privateKeyMethod = privateKeyMethod;
        }
        else {
            this.privateKeyMethod = privateKeyMethod;
        }
    }
    async accessToken(code, platform) {
        const token = await this.generateToken(platform);
        const payload = {
            grant_type: "authorization_code",
            code: code,
            redirect_uri: platform == AppleSignInPlatform.web ? this.config.redirect_uri_web : this.config.redirect_uri,
            client_id: platform == AppleSignInPlatform.ios ? this.config.client_id_ios : this.config.client_id_android,
            client_secret: token,
        };
        var response = await (0, axios_1.default)({
            method: "POST",
            headers: { "content-type": "application/x-www-form-urlencoded" },
            data: querystring_1.default.stringify(payload),
            url: "https://appleid.apple.com/auth/token",
        });
        return response.data;
    }
    async refreshToken(refreshToken, platform) {
        const token = await this.generateToken(platform);
        const payload = {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            redirect_uri: platform == AppleSignInPlatform.web ? this.config.redirect_uri_web : this.config.redirect_uri,
            client_id: platform == AppleSignInPlatform.ios ? this.config.client_id_ios : this.config.client_id_android,
            client_secret: token,
        };
        var response = await (0, axios_1.default)({
            method: "POST",
            headers: { "content-type": "application/x-www-form-urlencoded" },
            data: querystring_1.default.stringify(payload),
            url: "https://appleid.apple.com/auth/token",
        });
        return response.data;
    }
    async generateToken(platform) {
        const claims = {
            iss: this.config.team_id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 86400 * 180,
            aud: "https://appleid.apple.com",
            sub: platform == AppleSignInPlatform.ios ? this.config.client_id_ios : this.config.client_id_android,
        };
        var privateK;
        if (this.privateKeyMethod == "file") {
            fs_1.default.readFile(this.privateKeyLocation, (err, privateKey) => {
                if (err) {
                    return undefined;
                }
                privateK = privateKey;
                return;
            });
        }
        else {
            privateK = this.privateKeyLocation;
        }
        const token = jsonwebtoken_1.default.sign(claims, privateK, { algorithm: "ES256", keyid: this.config.key_id });
        return token;
    }
}
exports.AppleSignIn = AppleSignIn;
//# sourceMappingURL=index.js.map