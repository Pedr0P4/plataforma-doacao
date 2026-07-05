package br.com.donation.service;

import br.com.donation.dto.InscricaoDTO;
import br.com.donation.exception.BusinessException;
import br.com.donation.exception.ResourceNotFoundException;
import br.com.donation.model.CampanhaDoacao;
import br.com.donation.model.Inscricao;
import br.com.donation.model.Usuario;
import br.com.donation.model.VagaVoluntario;
import br.com.donation.repository.CampanhaDoacaoRepository;
import br.com.donation.repository.InscricaoRepository;
import br.com.donation.repository.PessoaFisicaRepository;
import br.com.donation.repository.UsuarioRepository;
import br.com.donation.repository.VagaVoluntarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InscricaoService {

    @Autowired
    private InscricaoRepository inscricaoRepository;

    @Autowired
    private VagaVoluntarioRepository vagaVoluntarioRepository;

    @Autowired
    private CampanhaDoacaoRepository campanhaDoacaoRepository;

    @Autowired
    private PessoaFisicaRepository pessoaFisicaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public InscricaoDTO inscrever(Integer pessoaFisicaId, Integer campanhaId, Integer codigoVaga) {
        validarSePessoaFisica(pessoaFisicaId);

        VagaVoluntario vaga = vagaVoluntarioRepository.findById(campanhaId, codigoVaga)
                .orElseThrow(() -> new ResourceNotFoundException("Vaga de Voluntariado", codigoVaga));

        if (inscricaoRepository.findById(pessoaFisicaId, campanhaId, codigoVaga).isPresent()) {
            throw new BusinessException("Você já está inscrito nesta vaga.");
        }

        Inscricao inscricao = new Inscricao();
        inscricao.setPessoaFisicaUsuarioId(pessoaFisicaId);
        inscricao.setVagaVoluntarioCodigoVaga(codigoVaga);
        inscricao.setVagaVoluntarioCampanhaDoacaoId(campanhaId);
        inscricao.setData(LocalDate.now());
        inscricao.setStatus("PENDENTE");

        inscricao = inscricaoRepository.save(inscricao);
        return converterParaDTO(inscricao);
    }

    public List<InscricaoDTO> listarMinhasInscricoes(Integer pessoaFisicaId) {
        validarSePessoaFisica(pessoaFisicaId);
        return inscricaoRepository.findByPessoaFisicaId(pessoaFisicaId).stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public List<InscricaoDTO> listarInscricoesDaVaga(Integer instituicaoId, Integer campanhaId, Integer codigoVaga) {
        validarDonoCampanha(instituicaoId, campanhaId);
        
        return inscricaoRepository.findByCampanhaAndVaga(campanhaId, codigoVaga).stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public InscricaoDTO atualizarStatus(Integer instituicaoId, Integer campanhaId, Integer codigoVaga, Integer pessoaFisicaId, String novoStatus) {
        validarDonoCampanha(instituicaoId, campanhaId);

        Inscricao inscricao = inscricaoRepository.findById(pessoaFisicaId, campanhaId, codigoVaga)
                .orElseThrow(() -> new ResourceNotFoundException("Inscrição não encontrada para esta pessoa na vaga especificada."));

        if (!novoStatus.equals("APROVADA") && !novoStatus.equals("RECUSADA") && !novoStatus.equals("PENDENTE")) {
            throw new BusinessException("Status inválido. Use APROVADA, RECUSADA ou PENDENTE.");
        }

        inscricao.setStatus(novoStatus);
        inscricaoRepository.save(inscricao);

        return converterParaDTO(inscricao);
    }

    private void validarSePessoaFisica(Integer userId) {
        if (!pessoaFisicaRepository.findById(userId).isPresent()) {
            throw new BusinessException("Apenas Pessoas Físicas podem se inscrever em vagas de voluntariado.");
        }
    }

    private void validarDonoCampanha(Integer instituicaoId, Integer campanhaId) {
        CampanhaDoacao campanha = campanhaDoacaoRepository.findById(campanhaId)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha", campanhaId));

        if (!campanha.getInstituicaoUsuarioId().equals(instituicaoId)) {
            throw new BusinessException("Apenas a instituição dona da campanha pode gerenciar suas inscrições.");
        }
    }

    private InscricaoDTO converterParaDTO(Inscricao inscricao) {
        InscricaoDTO dto = new InscricaoDTO();
        dto.setPessoaFisicaId(inscricao.getPessoaFisicaUsuarioId());
        dto.setCodigoVaga(inscricao.getVagaVoluntarioCodigoVaga());
        dto.setCampanhaId(inscricao.getVagaVoluntarioCampanhaDoacaoId());
        dto.setDataInscricao(inscricao.getData());
        dto.setStatus(inscricao.getStatus());

        usuarioRepository.findById(inscricao.getPessoaFisicaUsuarioId()).ifPresent(u -> {
            dto.setNomePessoaFisica(u.getNome());
            dto.setEmailPessoaFisica(u.getEmail());
        });

        if (inscricao.getVagaVoluntarioCampanhaDoacaoId() != null) {
            vagaVoluntarioRepository.findById(inscricao.getVagaVoluntarioCampanhaDoacaoId(), inscricao.getVagaVoluntarioCodigoVaga())
                    .ifPresent(v -> dto.setNomeVaga(v.getFuncao()));
            
            campanhaDoacaoRepository.findById(inscricao.getVagaVoluntarioCampanhaDoacaoId())
                    .ifPresent(c -> dto.setNomeCampanha(c.getTitulo()));
        }

        return dto;
    }
}
