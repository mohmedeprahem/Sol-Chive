import joi from 'joi';

const schema = joi.object({
    title: joi.number()
    .max(50)
    .required()
})