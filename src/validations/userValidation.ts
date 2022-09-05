import { object, string } from 'yup';

const createUserSchema = object({
  name: string()
    .matches(/^[a-zA-Z ]+$/, 'Nome inválido')
    .max(200, 'Nome não respeita o limite de caracteres')
    .required('Nome não fornecido'),
  username: string()
    .min(3, 'Username com menos de 3 caracteres')
    .matches(/[a-zA-Z0-9]+/, 'Username inválido')
    .required('Username não fornecido'),
  password: string()
    .min(5, 'A senha deve conter pelo menos 5 caracteres')
    .max(16, 'A senha deve conter no máximo 16 caracteres')
    .matches(
      /^[ A-Za-z0-9_@./#&+-]*$/,
      'A senha deve conter apenas letras, números ou caracteres especiais'
    )
    .required('Senha não fornecida'),
});

const updateUserSchema = object({
  name: string()
    .matches(/^[a-zA-Z ]+$/, 'Nome inválido')
    .max(200, 'Nome não respeita o limite de caracteres')
    .optional(),
  password: string()
    .min(5, 'A senha deve conter pelo menos 5 caracteres')
    .max(16, 'A senha deve conter no máximo 16 caracteres')
    .matches(
      /^[ A-Za-z0-9_@./#&+-]*$/,
      'A senha deve conter apenas letras, números ou caracteres especiais'
    )
    .optional(),
});

export { createUserSchema, updateUserSchema };
