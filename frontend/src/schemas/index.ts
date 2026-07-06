import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório')
    .email('Formato de e-mail inválido'),
  senha: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registroPFSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().min(1, 'O e-mail é obrigatório').email('E-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  cpf: z.string().min(11, 'O CPF deve ter no mínimo 11 dígitos'),
  dataNascimento: z.string().optional(),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  bairro: z.string().optional(),
  numero: z.string().optional(),
});

export type RegistroPFFormData = z.infer<typeof registroPFSchema>;

export const registroONGSchema = z.object({
  nome: z.string().min(3, 'O nome da instituição deve ter pelo menos 3 caracteres'),
  email: z.string().min(1, 'O e-mail é obrigatório').email('E-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  cnpj: z.string().min(14, 'O CNPJ deve ter no mínimo 14 dígitos'),
  site: z.string().url('URL inválida (inclua https://)').optional().or(z.literal('')),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  bairro: z.string().optional(),
  numero: z.string().optional(),
});

export type RegistroONGFormData = z.infer<typeof registroONGSchema>;

export const criarDoacaoSchema = z.object({
  nome: z.string().min(3, 'Nome do item é obrigatório (mínimo 3 caracteres)'),
  quantidade: z
    .number({ message: 'Digite um número válido' })
    .min(1, 'A quantidade deve ser de pelo menos 1'),
  categoria: z.string().min(1, 'Selecione uma categoria'),
  descricao: z.string().optional(),
  motivo: z.string().optional(),
  eNovo: z.enum(['S', 'N']),
});

export type CriarDoacaoFormData = z.infer<typeof criarDoacaoSchema>;

export const efetivarDoacaoSchema = z.object({
  donatarioId: z.number({ message: 'Selecione um beneficiário' }).min(1, 'Selecione um beneficiário da lista'),
  nomeLocal: z.string().min(3, 'Nome do local é obrigatório'),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  bairro: z.string().optional(),
  numero: z.string().optional(),
});

export type EfetivarDoacaoFormData = z.infer<typeof efetivarDoacaoSchema>;

export const criarCampanhaSchema = z.object({
  titulo: z.string().min(5, 'Título da campanha deve ter pelo menos 5 caracteres'),
  descricao: z.string().optional(),
  itensFoco: z.string().min(3, 'Informe os itens solicitados (ex: cobertores, agasalhos)'),
  metaVoluntarios: z
    .number({ message: 'Digite um número válido' })
    .min(0, 'Meta não pode ser negativa'),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
});

export type CriarCampanhaFormData = z.infer<typeof criarCampanhaSchema>;

export const adicionarLocalSchema = z.object({
  nome: z.string().min(3, 'Nome do local é obrigatório'),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  bairro: z.string().optional(),
  numero: z.string().optional(),
});

export type AdicionarLocalFormData = z.infer<typeof adicionarLocalSchema>;
