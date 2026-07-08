export type TipoUsuario = 'PESSOA_FISICA' | 'INSTITUICAO';

export interface UsuarioDTO {
  id?: number;
  nome: string;
  email: string;
  logradouro?: string;
  bairro?: string;
  numero?: string;
  cep?: string;
  tipo?: TipoUsuario;
}

export interface PessoaFisicaDTO extends UsuarioDTO {
  cpf: string;
  dataNascimento?: string;
  senha?: string;
}

export interface InstituicaoDTO extends UsuarioDTO {
  cnpj: string;
  site?: string;
  senha?: string;
}

export interface LoginDTO {
  email: string;
  senha?: string;
}

export interface AuthResponseDTO extends UsuarioDTO {
  token: string;
}

export interface ItemDTO {
  nome: string;
  quantidade?: number;
  descricao?: string;
  motivo?: string;
  eNovo?: string; // 'S' | 'N' ou 'true' | 'false'
  categoria?: string;
}

export interface LocalDoacaoDTO {
  id?: number;
  nome: string;
  logradouro?: string;
  bairro?: string;
  numero?: string;
  cep?: string;
}

export interface DoacaoDTO {
  id: number;
  doadorId: number;
  nomeDoador?: string;
  donatarioId?: number | null;
  nomeDonatario?: string;
  localDoacao?: LocalDoacaoDTO;
  urlImagem?: string;
  itens: ItemDTO[];
  interessadoAtual?: boolean; // campo calculado no frontend se logado
}

export interface CriarDoacaoDTO {
  itens: ItemDTO[];
}

export interface EfetivarDoacaoDTO {
  donatarioId: number;
  localDoacao: LocalDoacaoDTO;
}

export interface CampanhaDTO {
  id: number;
  instituicaoId: number;
  nomeInstituicao?: string;
  titulo: string;
  descricao?: string;
  urlImagemCapa?: string;
  dataInicio?: string;
  dataFim?: string;
  status?: 'ATIVA' | 'ENCERRADA' | string;
  itensFoco?: string;
  metaVoluntarios?: number;
  vagasDisponiveis?: number;
  locais?: LocalDoacaoDTO[];
}

export interface CriarCampanhaDTO {
  titulo: string;
  descricao?: string;
  dataInicio?: string;
  dataFim?: string;
  itensFoco?: string;
  metaVoluntarios?: number;
  locais?: LocalDoacaoDTO[];
}

export interface VagaVoluntarioDTO {
  campanhaId?: number;
  codigoVaga?: number;
  funcao: string;
  descricaoAtividades?: string;
  cargaHorariaSemanal?: number;
  dataInicio?: string;
  dataFim?: string;
  quantidadeVagas?: number;
  vagasOcupadas?: number;
}

export interface InscricaoDTO {
  pessoaFisicaId?: number;
  nomeVoluntario?: string;
  campanhaId?: number;
  codigoVaga?: number;
  data?: string;
  status?: 'PENDENTE' | 'APROVADA' | 'REJEITADA' | string;
}

export interface AvaliacaoDTO {
  id?: number;
  doacaoId: number;
  nota: number;
  comentario?: string;
  dataAvaliacao?: string;
  papelAvaliador?: 'DOADOR' | 'DONATARIO' | string;
}

export interface PaginaDTO<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export interface NotificacaoSSE {
  tipo: string;
  doacaoId?: number;
  mensagem: string;
  interessadoNome?: string;
  timestamp?: string;
}
