/// APPLE SIGN IN TS
///
/// Copyright © 2020 - 2025 IGLU. All rights reserved.
/// Copyright © 2020 - 2025 IGLU
///

import axios from "axios"
import qs from "querystring"
import jwt from "jsonwebtoken"
import fs from "fs"

export enum AppleSignInPlatform {
  ios,
  android,
  web,
  next,
}

export interface AppleSignInConfig {
  client_id_ios: string
  client_id_android: string
  team_id: string
  //ANDROID
  redirect_uri: string
  redirect_uri_web: string
  redirect_uri_next: string
  key_id: string
  /**
   * Example: "name email"
   */
  scope: string
  auth_p2_key: string
}

export class AppleSignIn {
  config: AppleSignInConfig
  state: String
  privateKeyMethod: any
  privateKeyLocation: any
  privateKey: any

  constructor(config: AppleSignInConfig, privateKey: any, privateKeyMethod: any) {
    this.config = config
    this.state = ""
    this.privateKeyLocation = privateKey
    if (typeof privateKeyMethod == "undefined") {
      this.privateKeyMethod = "file"
    } else if (privateKeyMethod == "text" || privateKeyMethod == "file") {
      this.privateKeyMethod = privateKeyMethod
    } else {
      this.privateKeyMethod = privateKeyMethod
    }
  }

  public async accessToken(
    code: string,
    platform: AppleSignInPlatform,
    redirect_uri: string | undefined = undefined,
    client_id: string | undefined = undefined
  ) {
    const token = await this.generateToken(platform, client_id)
    const payload: any = {
      grant_type: "authorization_code",
      code: code,
      redirect_uri:
        redirect_uri ??
        (platform == AppleSignInPlatform.next
          ? this.config.redirect_uri_next
          : platform == AppleSignInPlatform.web
          ? this.config.redirect_uri_web
          : this.config.redirect_uri),
      client_id:
        client_id ?? (platform == AppleSignInPlatform.ios ? this.config.client_id_ios : this.config.client_id_android),
      client_secret: token,
    }
    var response = await axios({
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify(payload),
      url: "https://appleid.apple.com/auth/token",
    })
    return response.data
  }

  public async refreshToken(
    refreshToken: String,
    platform: AppleSignInPlatform,
    redirect_uri: String | undefined = undefined,
    client_id: string | undefined = undefined
  ) {
    const token = await this.generateToken(platform, client_id)
    const payload: any = {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      redirect_uri:
        redirect_uri ??
        (platform == AppleSignInPlatform.next
          ? this.config.redirect_uri_next
          : platform == AppleSignInPlatform.web
          ? this.config.redirect_uri_web
          : this.config.redirect_uri),
      client_id:
        client_id ?? (platform == AppleSignInPlatform.ios ? this.config.client_id_ios : this.config.client_id_android),
      client_secret: token,
    }
    var response = await axios({
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify(payload),
      url: "https://appleid.apple.com/auth/token",
    })
    return response.data
  }

  private async generateToken(platform: AppleSignInPlatform, client_id: string | undefined = undefined) {
    const claims = {
      iss: this.config.team_id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400 * 180,
      aud: "https://appleid.apple.com",
      sub:
        client_id ?? (platform == AppleSignInPlatform.ios ? this.config.client_id_ios : this.config.client_id_android),
    }
    var privateK: any
    if (this.privateKeyMethod == "file") {
      fs.readFile(this.privateKeyLocation, (err, privateKey) => {
        if (err) {
          return undefined
        }
        privateK = privateKey
        return
      })
    } else {
      privateK = this.privateKeyLocation
    }
    const token = jwt.sign(claims, privateK, { algorithm: "ES256", keyid: this.config.key_id })
    return token
  }
}
