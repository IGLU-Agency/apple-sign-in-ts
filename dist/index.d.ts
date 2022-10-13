export declare enum AppleSignInPlatform {
    ios = 0,
    android = 1,
    web = 2
}
export interface AppleSignInConfig {
    client_id_ios: string;
    client_id_android: string;
    team_id: string;
    redirect_uri: string;
    redirect_uri_web: string;
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
    accessToken(code: String, platform: AppleSignInPlatform): Promise<any>;
    refreshToken(refreshToken: String, platform: AppleSignInPlatform): Promise<any>;
    private generateToken;
}
//# sourceMappingURL=index.d.ts.map