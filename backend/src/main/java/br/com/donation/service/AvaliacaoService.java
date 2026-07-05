package br.com.donation.service;

import br.com.donation.dto.AvaliacaoDTO;
import br.com.donation.exception.BusinessException;
import br.com.donation.exception.ResourceNotFoundException;
import br.com.donation.model.Avaliacao;
import br.com.donation.model.Doacao;
import br.com.donation.repository.AvaliacaoRepository;
import br.com.donation.repository.DoacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @Autowired
    private DoacaoRepository doacaoRepository;

    public AvaliacaoDTO avaliar(Integer userId, Integer doacaoId, AvaliacaoDTO dto) {
        Doacao doacao = doacaoRepository.findById(doacaoId)
                .orElseThrow(() -> new ResourceNotFoundException("Doação", doacaoId));

        if (doacao.getDonatarioId() == null) {
            throw new BusinessException("Você não pode avaliar uma doação que ainda não foi efetivada (sem donatário).");
        }

        String papel;
        if (doacao.getDoadorId().equals(userId)) {
            papel = "DOADOR";
        } else if (doacao.getDonatarioId().equals(userId)) {
            papel = "DONATARIO";
        } else {
            throw new BusinessException("Apenas o doador ou o donatário podem avaliar esta doação.");
        }

        // Verifica se o usuário já avaliou essa doação neste papel
        boolean jaAvaliou = avaliacaoRepository.findByDoacaoId(doacaoId).stream()
                .anyMatch(a -> a.getPapelAvaliador().equals(papel));

        if (jaAvaliou) {
            throw new BusinessException("Você já enviou sua avaliação para esta doação.");
        }

        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setDataAvaliacao(LocalDate.now());
        avaliacao.setComentario(dto.getComentario());
        avaliacao.setNota(dto.getNota());
        avaliacao.setPapelAvaliador(papel);
        avaliacao.setDoacaoId(doacaoId);

        avaliacao = avaliacaoRepository.save(avaliacao);

        return converterParaDTO(avaliacao);
    }

    public List<AvaliacaoDTO> listarAvaliacoes(Integer doacaoId) {
        // Valida se a doação existe
        if (!doacaoRepository.findById(doacaoId).isPresent()) {
            throw new ResourceNotFoundException("Doação", doacaoId);
        }

        return avaliacaoRepository.findByDoacaoId(doacaoId).stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    private AvaliacaoDTO converterParaDTO(Avaliacao avaliacao) {
        return AvaliacaoDTO.builder()
                .id(avaliacao.getId())
                .nota(avaliacao.getNota())
                .comentario(avaliacao.getComentario())
                .dataAvaliacao(avaliacao.getDataAvaliacao())
                .papelAvaliador(avaliacao.getPapelAvaliador())
                .doacaoId(avaliacao.getDoacaoId())
                .build();
    }
}
