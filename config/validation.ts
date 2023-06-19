import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().required(),
  NATS_URL: Joi.string().required(),
  NKEY_SEED: Joi.string().required(),
  ELK_LOG_PATH: Joi.string().required()

});
