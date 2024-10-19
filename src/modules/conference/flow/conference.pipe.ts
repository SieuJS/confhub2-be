import * as Joi from 'joi';

import { JoiValidationPipe } from '../../common';
import { ConferenceData, ConferenceInput } from '../model';

export class ConferencePipe extends JoiValidationPipe {

    public buildSchema(): Joi.Schema {
        return Joi.object<ConferenceInput>({
            name: Joi.string().required().max(ConferenceData.NAME_LENGTH),
            acronym: Joi.string().required().max(ConferenceData.ACRONYM_LENGTH)
        });
    }
}