import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doacoesApi } from '@/services/api';
import { CriarDoacaoDTO, EfetivarDoacaoDTO } from '@/types';

export const useListarDoacoesDisponiveis = (page = 0, size = 9, categoria?: string, busca?: string) => {
  return useQuery({
    queryKey: ['doacoes', page, size, categoria, busca],
    queryFn: () => doacoesApi.listarDisponiveis(page, size, categoria, busca),
  });
};

export const useBuscarDoacaoPorId = (id: number) => {
  return useQuery({
    queryKey: ['doacao', id],
    queryFn: () => doacoesApi.buscarPorId(id),
    enabled: !isNaN(id) && id > 0,
  });
};

export const useListarMinhasDoacoes = (enabled = true) => {
  return useQuery({
    queryKey: ['minhas-doacoes'],
    queryFn: () => doacoesApi.listarMinhas(),
    enabled,
  });
};

export const useListarDoacoesRecebidas = (enabled = true) => {
  return useQuery({
    queryKey: ['recebidas'],
    queryFn: () => doacoesApi.listarRecebidas(),
    enabled,
  });
};

export const useListarInteressados = (doacaoId: number, enabled = true) => {
  return useQuery({
    queryKey: ['interessados', doacaoId],
    queryFn: () => doacoesApi.listarInteressados(doacaoId),
    enabled: enabled && !isNaN(doacaoId) && doacaoId > 0,
  });
};

export const useCriarDoacaoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dto, imagemFile }: { dto: CriarDoacaoDTO; imagemFile?: File | null }) =>
      doacoesApi.criarDoacao(dto, imagemFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doacoes'] });
      queryClient.invalidateQueries({ queryKey: ['minhas-doacoes'] });
    },
  });
};

export const useDemonstrarInteresseMutation = (doacaoId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => doacoesApi.demonstrarInteresse(doacaoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doacoes'] });
      queryClient.invalidateQueries({ queryKey: ['doacao', doacaoId] });
    },
  });
};

export const useEfetivarDoacaoMutation = (doacaoId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: EfetivarDoacaoDTO) => doacoesApi.efetivarDoacao(doacaoId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doacao', doacaoId] });
      queryClient.invalidateQueries({ queryKey: ['minhas-doacoes'] });
      queryClient.invalidateQueries({ queryKey: ['interessados', doacaoId] });
    },
  });
};
