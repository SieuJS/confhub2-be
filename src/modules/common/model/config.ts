export interface Config {

    readonly API_PORT: number;

    readonly API_PREFIX: string;

    readonly SWAGGER_ENABLE: number;

    readonly JWT_SECRET: string;

    readonly JWT_ISSUER: string;

    readonly HEALTH_TOKEN: string;

    readonly PASSENGERS_ALLOWED: string;

    readonly CONFERENCES_ALLOWED: string;

    readonly DB_USER  : string;
    readonly DB_PASSWORD : string;
    readonly DB_HOST : string;
    readonly DB_PORT : number;
    readonly DB_NAME : string;
    readonly DB_SCHEMA : string;

    readonly DATABASE_URL : string;
    readonly DB_WATCHER : string;

    readonly FIELD_CODE_LOADED : string;
}
