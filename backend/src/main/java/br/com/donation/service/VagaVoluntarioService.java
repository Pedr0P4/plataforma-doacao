package br.com.donation.service;

import br.com.donation.dto.vaga.CriarVagaDTO;
import br.com.donation.dto.vaga.VagaVoluntarioDTO;
import br.com.donation.exception.BusinessException;
import br.com.donation.exception.ResourceNotFoundException;
import br.com.donation.model.CampanhaDoacao;
import br.com.donation.model.VagaVoluntario;
import br.com.donation.repository.CampanhaDoacaoRepository;
import br.com.donation.repository.VagaVoluntarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VagaVoluntarioService {

    @Autowired
    private VagaVoluntarioRepository vagaVoluntarioRepository;

    @Autowired
    private CampanhaDoacaoRepository campanhaDoacaoRepository;

    public VagaVoluntarioDTO criarVaga(Integer instituicaoId, Integer campanhaId, CriarVagaDTO dto) {
        validarDonoCampanha(instituicaoId, campanhaId);

        // Gera um código único e sequencial para a vaga DENTRO desta campanha
        Integer proximoCodigoVaga = vagaVoluntarioRepository.findMaxCodigoVagaByCampanha(campanhaId) + 1;

        VagaVoluntario vaga = new VagaVoluntario();
        vaga.setCampanhaDoacaoId(campanhaId);
        vaga.setCodigoVaga(proximoCodigoVaga);
        vaga.setFuncao(dto.getFuncao());
        vaga.setDescricaoAtividades(dto.getDescricaoAtividades());
        vaga.setQuantidadeVagas(dto.getQuantidadeVagas());
        vaga.setCargaHorariaSemanal(dto.getCargaHorariaSemanal());
        vaga.setDataInicio(dto.getDataInicio());
        vaga.setDataFim(dto.getDataFim());

        vaga = vagaVoluntarioRepository.save(vaga);
        return converterParaDTO(vaga);
    }

    public List<VagaVoluntarioDTO> listarVagasPorCampanha(Integer campanhaId) {
        return vagaVoluntarioRepository.findByCampanhaId(campanhaId).stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public void removerVaga(Integer instituicaoId, Integer campanhaId, Integer codigoVaga) {
        validarDonoCampanha(instituicaoId, campanhaId);
        
        vagaVoluntarioRepository.findById(campanhaId, codigoVaga)
                .orElseThrow(() -> new ResourceNotFoundException("Vaga de Voluntariado", codigoVaga));
                
        vagaVoluntarioRepository.deleteById(campanhaId, codigoVaga);
    }

    private void validarDonoCampanha(Integer instituicaoId, Integer campanhaId) {
        CampanhaDoacao campanha = campanhaDoacaoRepository.findById(campanhaId)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha", campanhaId));

        if (!campanha.getInstituicaoUsuarioId().equals(instituicaoId)) {
            throw new BusinessException("Apenas a instituição dona da campanha pode gerenciar suas vagas.");
        }
    }

    private VagaVoluntarioDTO converterParaDTO(VagaVoluntario vaga) {
        return VagaVoluntarioDTO.builder()
                .campanhaDoacaoId(vaga.getCampanhaDoacaoId())
                .codigoVaga(vaga.getCodigoVaga())
                .funcao(vaga.getFuncao())
                .descricaoAtividades(vaga.getDescricaoAtividades())
                .quantidadeVagas(vaga.getQuantidadeVagas())
                .cargaHorariaSemanal(vaga.getCargaHorariaSemanal())
                .dataInicio(vaga.getDataInicio())
                .dataFim(vaga.getDataFim())
                .build();
    }
}

