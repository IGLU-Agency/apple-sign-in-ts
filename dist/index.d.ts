export declare enum AppleSignInPlatform {
    ios = 0,
    android = 1,
    web = 2,
    next = 3
}
export interface AppleSignInConfig {
    client_id_ios: string;
    client_id_android: string;
    team_id: string;
    redirect_uri: string;
    redirect_uri_web: string;
    redirect_uri_next: string;
    key_id: string;
    /**
     * Example: "name email"
     */
    scope: string;
    auth_p2_key: string;
}
export declare class AppleSignIn {
    config: AppleSignInConfig;
    state: String;
    privateKeyMethod: any;
    privateKeyLocation: any;
    privateKey: any;
    constructor(config: AppleSignInConfig, privateKey: any, privateKeyMethod: any);
    accessToken(code: string, platform: AppleSignInPlatform, redirect_uri?: string | undefined, client_id?: string | undefined): Promise<any>;
    refreshToken(refreshToken: String, platform: AppleSignInPlatform, redirect_uri?: String | undefined, client_id?: string | undefined): Promise<any>;
    private generateToken;
}
//# sourceMappingURL=index.d.ts.map