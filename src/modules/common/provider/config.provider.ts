import * as Joi from 'joi';
import { Service } from '../../tokens';
import { Config } from '../model';

export const configProvider = {
    provide: Service.CONFIG,
    useFactory: (): Config => {

        const env = process.env; 
        
        const validationSchema = Joi.object<Config>().unknown().keys({
            API_PORT: Joi.number().required(),
            API_PREFIX: Joi.string().required(),
            SWAGGER_ENABLE: Joi.number().required(),
            FIELD_CODE_LOADED : Joi.string().valid('yes', 'no').required(),
            JWT_SECRET: Joi.string().required(),
            JWT_ISSUER: Joi.string().required(),
            HEALTH_TOKEN: Joi.string().required(),
            PASSENGERS_ALLOWED: Joi.string().valid('yes', 'no').required(),
            CONFERENCES_ALLOWED: Joi.string().valid('yes', 'no').required(),
            DB_USER: Joi.string().required(),
            DB_PASSWORD: Joi.string().required(),
            DB_HOST: Joi.string().required(),
            DB_PORT: Joi.number().required(),
            DB_NAME: Joi.string().required(),
            DATABASE_URL: Joi.string().required(),

        });


        const result = validationSchema.validate(env);
        if (result.error) {
            throw new Error(`Configuration not valid: ${result.error.message}`);
        }

        return result.value;
    },
};
