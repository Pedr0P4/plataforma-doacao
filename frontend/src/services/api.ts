import axios from 'axios';
import {
  AuthResponseDTO,
  LoginDTO,
  PessoaFisicaDTO,
  InstituicaoDTO,
  DoacaoDTO,
  CriarDoacaoDTO,
  EfetivarDoacaoDTO,
  CampanhaDTO,
  CriarCampanhaDTO,
  LocalDoacaoDTO,
  PaginaDTO,
  UsuarioDTO
} from '@/types';
import { log } from 'console';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor para tratamento amigável de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Sessão expirada ou não autenticado
      console.warn('Não autorizado ou sessão expirada.');
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (data: LoginDTO): Promise<AuthResponseDTO> => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },
  registrarPessoaFisica: async (data: PessoaFisicaDTO): Promise<AuthResponseDTO> => {
    const res = await api.post('/auth/registro/pessoa-fisica', data);
    return res.data;
  },
  registrarInstituicao: async (data: InstituicaoDTO): Promise<AuthResponseDTO> => {
    const res = await api.post('/auth/registro/instituicao', data);
    return res.data;
  },
  verificarSessao: async () => {
    const res = await api.get('/auth/verify');
    return res.data;
  },
  logout: async () => {
    const res = await api.post('/auth/logout');
    return res.data;
  },
};

export const doacoesApi = {
  listarDisponiveis: async (page = 0, size = 10, categoria?: string, busca?: string): Promise<PaginaDTO<DoacaoDTO>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (categoria && categoria !== 'TODAS') params.append('categoria', categoria);
    if (busca) params.append('busca', busca);
    
    const res = await api.get(`/doacoes/disponiveis?${params.toString()}`);
    return res.data;
  },
  buscarPorId: async (id: number): Promise<DoacaoDTO> => {
    const res = await api.get(`/doacoes/${id}`);
    return res.data;
  },
  listarMinhas: async (): Promise<DoacaoDTO[]> => {
    const res = await api.get('/doacoes/minhas');
    return res.data;
  },
  listarRecebidas: async (): Promise<DoacaoDTO[]> => {
    const res = await api.get('/doacoes/recebidas');
    return res.data;
  },
  criarDoacao: async (dto: CriarDoacaoDTO, imagemFile?: File | null): Promise<DoacaoDTO> => {
    const formData = new FormData();
    formData.append(
      'doacao',
      new Blob([JSON.stringify(dto)], { type: 'application/json' })
    );
    if (imagemFile) {
      formData.append('imagem', imagemFile);
    }
    const res = await api.post('/doacoes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  solicitarVoluntariado: async (id: number) => {
    await api.post(`/vagas-voluntario/${id}/solicitar`);
  },
  demonstrarInteresse: async (id: number) => {
    await api.post(`/doacoes/${id}/interesse`);
  },
  removerInteresse: async (id: number) => {
    await api.delete(`/doacoes/${id}/interesse`);
  },
  listarInteressados: async (id: number): Promise<UsuarioDTO[]> => {
    const res = await api.get(`/doacoes/${id}/interessados`);
    return res.data;
  },
  efetivarDoacao: async (id: number, dto: EfetivarDoacaoDTO): Promise<DoacaoDTO> => {
    const res = await api.put(`/doacoes/${id}/efetivar`, dto);
    return res.data;
  },
};

export const campanhasApi = {
  listar: async (page = 0, size = 10): Promise<PaginaDTO<CampanhaDTO>> => {
    const res = await api.get(`/campanhas?page=${page}&size=${size}`);
    return res.data;
  },
  buscarPorId: async (id: number): Promise<CampanhaDTO> => {
    const res = await api.get(`/campanhas/${id}`);
    return res.data;
  },
  listarMinhas: async (): Promise<CampanhaDTO[]> => {
    const res = await api.get('/campanhas/minhas');
    return res.data;
  },
  criarCampanha: async (dto: CriarCampanhaDTO, imagemFile?: File | null): Promise<CampanhaDTO> => {
    const formData = new FormData();
    formData.append(
      'campanha',
      new Blob([JSON.stringify(dto)], { type: 'application/json' })
    );
    if (imagemFile) {
      formData.append('imagem', imagemFile);
    }
    const res = await api.post('/campanhas', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  adicionarLocal: async (id: number, localDto: LocalDoacaoDTO): Promise<CampanhaDTO> => {
    const res = await api.post(`/campanhas/${id}/locais`, localDto);
    return res.data;
  },
  removerLocal: async (id: number, localId: number) => {
    await api.delete(`/campanhas/${id}/locais/${localId}`);
  },
};

export const avaliacaoApi = {
  avaliar: async (doacaoId: number, dto: { nota: number; comentario: string }) => {
    const res = await api.post(`/doacoes/${doacaoId}/avaliacoes`, dto);
    return res.data;
  },
  listar: async (doacaoId: number) => {
    const res = await api.get(`/doacoes/${doacaoId}/avaliacoes`);
    return res.data;
  },
};

export const createSseConnection = (onMessage: (data: any) => void): EventSource => {
  const eventSource = new EventSource(`${BASE_URL}/notificacoes/stream`, {
    withCredentials: true,
  });

  eventSource.addEventListener('NOVO_INTERESSE', (event) => {
    try {
      const parsedData = JSON.parse(event.data);
      onMessage(parsedData);
    } catch (e) {
      console.error('Erro ao processar notificação SSE:', e);
    }
  });

  return eventSource;
};

export default api;
