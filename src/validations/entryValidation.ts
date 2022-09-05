import { number, object, string } from 'yup';

const createEntrySchema = object({
  title: string()
    .max(200, 'Título inválido')
    .required('Título de registro não fornecido'),
  description: string().max(200, 'Descrição inválida').optional(),
  tag: string().required('Tag de registro não fornecida'),
  type: string().required('Tipo de registro não fornecido'),
  value: number()
    .positive('Valor inválido')
    .required('Valor de registro não fornecido'),
});

const updateEntrySchema = object({
  title: string().max(200, 'Título inválido').optional(),
  description: string().optional(),
  tag: string().optional(),
  type: string().optional(),
  value: number().positive('Valor inválido').optional(),
});

export { createEntrySchema, updateEntrySchema };
