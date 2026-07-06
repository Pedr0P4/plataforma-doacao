import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campanhasApi } from '@/services/api';
import { CriarCampanhaDTO, LocalDoacaoDTO } from '@/types';

export const useListarCampanhas = (page = 0, size = 9) => {
  return useQuery({
    queryKey: ['campanhas', page, size],
    queryFn: () => campanhasApi.listar(page, size),
  });
};

export const useBuscarCampanhaPorId = (id: number) => {
  return useQuery({
    queryKey: ['campanha', id],
    queryFn: () => campanhasApi.buscarPorId(id),
    enabled: !isNaN(id) && id > 0,
  });
};

export const useListarMinhasCampanhas = (enabled = true) => {
  return useQuery({
    queryKey: ['minhas-campanhas'],
    queryFn: () => campanhasApi.listarMinhas(),
    enabled,
  });
};

export const useCriarCampanhaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ dto, imagemFile }: { dto: CriarCampanhaDTO; imagemFile?: File | null }) =>
      campanhasApi.criarCampanha(dto, imagemFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campanhas'] });
      queryClient.invalidateQueries({ queryKey: ['minhas-campanhas'] });
    },
  });
};

export const useAdicionarLocalMutation = (campanhaId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (localDto: LocalDoacaoDTO) => campanhasApi.adicionarLocal(campanhaId, localDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campanha', campanhaId] });
    },
  });
};

export const useRemoverLocalMutation = (campanhaId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (localId: number) => campanhasApi.removerLocal(campanhaId, localId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campanha', campanhaId] });
    },
  });
};
