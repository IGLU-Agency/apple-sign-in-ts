"use strict";
/// APPLE SIGN IN TS
///
/// Copyright © 2020 - 2022 IGLU. All rights reserved.
/// Copyright © 2020 - 2022 IGLU
///
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppleSignIn = exports.AppleSignInPlatform = void 0;
const axios_1 = require("axios");
const qs = require("querystring");
const jwt = require("jsonwebtoken");
const fs = require("fs");
var AppleSignInPlatform;
(function (AppleSignInPlatform) {
    AppleSignInPlatform[AppleSignInPlatform["ios"] = 0] = "ios";
    AppleSignInPlatform[AppleSignInPlatform["android"] = 1] = "android";
})(AppleSignInPlatform = exports.AppleSignInPlatform || (exports.AppleSignInPlatform = {}));
class AppleSignIn {
    constructor(config, privateKey, privateKeyMethod) {
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
    accessToken(code, platform) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.generateToken(platform);
            const payload = {
                grant_type: "authorization_code",
                code: code,
                redirect_uri: this.config.redirect_uri,
                client_id: platform == AppleSignInPlatform.ios ? this.config.client_id_ios : this.config.client_id_android,
                client_secret: token,
            };
            var response = yield (0, axios_1.default)({
                method: "POST",
                headers: { "content-type": "application/x-www-form-urlencoded" },
                data: qs.stringify(payload),
                url: "https://appleid.apple.com/auth/token",
            });
            return response.data;
        });
    }
    refreshToken(refreshToken, platform) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.generateToken(platform);
            const payload = {
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                redirect_uri: this.config.redirect_uri,
                client_id: platform == AppleSignInPlatform.ios ? this.config.client_id_ios : this.config.client_id_android,
                client_secret: token,
            };
            var response = yield (0, axios_1.default)({
                method: "POST",
                headers: { "content-type": "application/x-www-form-urlencoded" },
                data: qs.stringify(payload),
                url: "https://appleid.apple.com/auth/token",
            });
            return response.data;
        });
    }
    generateToken(platform) {
        return __awaiter(this, void 0, void 0, function* () {
            const claims = {
                iss: this.config.team_id,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 86400 * 180,
                aud: "https://appleid.apple.com",
                sub: platform == AppleSignInPlatform.ios ? this.config.client_id_ios : this.config.client_id_android,
            };
            var privateK;
            if (this.privateKeyMethod == "file") {
                fs.readFile(this.privateKeyLocation, (err, privateKey) => {
                    if (err) {
                        return undefined;
                    }
                    privateK = privateKey;
                });
            }
            else {
                privateK = this.privateKeyLocation;
            }
            const token = jwt.sign(claims, privateK, { algorithm: "ES256", keyid: this.config.key_id });
            return token;
        });
    }
}
exports.AppleSignIn = AppleSignIn;
//# sourceMappingURL=index.js.map