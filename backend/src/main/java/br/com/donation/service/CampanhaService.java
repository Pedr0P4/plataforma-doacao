package br.com.donation.service;

import br.com.donation.dto.CampanhaDTO;
import br.com.donation.dto.CriarCampanhaDTO;
import br.com.donation.dto.LocalDoacaoDTO;
import br.com.donation.exception.BusinessException;
import br.com.donation.exception.ResourceNotFoundException;
import br.com.donation.model.CampanhaDoacao;
import br.com.donation.model.CampanhaLocalDoacao;
import br.com.donation.model.LocalDoacao;
import br.com.donation.repository.CampanhaDoacaoRepository;
import br.com.donation.repository.CampanhaLocalDoacaoRepository;
import br.com.donation.repository.InstituicaoRepository;
import br.com.donation.repository.LocalDoacaoRepository;
import br.com.donation.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CampanhaService {

    @Autowired
    private CampanhaDoacaoRepository campanhaRepository;

    @Autowired
    private CampanhaLocalDoacaoRepository campanhaLocalRepository;

    @Autowired
    private LocalDoacaoRepository localDoacaoRepository;

    @Autowired
    private InstituicaoRepository instituicaoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private StorageService storageService;

    public CampanhaDTO criarCampanha(Integer userId, CriarCampanhaDTO dto, MultipartFile imagem) {
        verificarSeInstituicao(userId);

        CampanhaDoacao campanha = new CampanhaDoacao();
        campanha.setInstituicaoUsuarioId(userId);
        campanha.setTitulo(dto.getTitulo());
        campanha.setDescricao(dto.getDescricao());
        campanha.setDataInicio(dto.getDataInicio());
        campanha.setDataFim(dto.getDataFim());
        campanha.setItensFoco(dto.getItensFoco());
        campanha.setMetaVoluntarios(dto.getMetaVoluntarios());
        campanha.setStatus("ATIVA");

        if (imagem != null && !imagem.isEmpty()) {
            String urlImagem = storageService.salvarImagem(imagem);
            campanha.setUrlImagemCapa(urlImagem);
        }

        campanha = campanhaRepository.save(campanha);

        if (dto.getLocais() != null) {
            for (LocalDoacaoDTO localDto : dto.getLocais()) {
                adicionarLocalInterno(campanha.getId(), localDto);
            }
        }

        return buscarPorId(campanha.getId());
    }

    public CampanhaDTO atualizarImagem(Integer userId, Integer campanhaId, MultipartFile file) {
        verificarSeInstituicao(userId);
        CampanhaDoacao campanha = buscarCampanhaSeDono(userId, campanhaId);
        
        String urlImagem = storageService.salvarImagem(file);
        campanha.setUrlImagemCapa(urlImagem);
        
        campanhaRepository.save(campanha);
        
        return buscarPorId(campanhaId);
    }

    public CampanhaDTO adicionarLocal(Integer userId, Integer campanhaId, LocalDoacaoDTO localDto) {
        verificarSeInstituicao(userId);
        CampanhaDoacao campanha = buscarCampanhaSeDono(userId, campanhaId);
        
        adicionarLocalInterno(campanha.getId(), localDto);
        return buscarPorId(campanha.getId());
    }

    public void removerLocal(Integer userId, Integer campanhaId, Integer localId) {
        verificarSeInstituicao(userId);
        buscarCampanhaSeDono(userId, campanhaId);
        
        campanhaLocalRepository.deleteById(campanhaId, localId);
    }

    public List<CampanhaDTO> listarCampanhas() {
        return campanhaRepository.findAll().stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public List<CampanhaDTO> listarMinhasCampanhas(Integer userId) {
        verificarSeInstituicao(userId);
        return campanhaRepository.findByInstituicaoId(userId).stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public CampanhaDTO buscarPorId(Integer campanhaId) {
        CampanhaDoacao campanha = campanhaRepository.findById(campanhaId)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha", campanhaId));
        return converterParaDTO(campanha);
    }

    private void verificarSeInstituicao(Integer userId) {
        if (!instituicaoRepository.findById(userId).isPresent()) {
            throw new BusinessException("Apenas instituições podem criar ou gerenciar campanhas.");
        }
    }

    private CampanhaDoacao buscarCampanhaSeDono(Integer userId, Integer campanhaId) {
        CampanhaDoacao campanha = campanhaRepository.findById(campanhaId)
                .orElseThrow(() -> new ResourceNotFoundException("Campanha", campanhaId));

        if (!campanha.getInstituicaoUsuarioId().equals(userId)) {
            throw new BusinessException("Você só pode modificar campanhas que pertencem à sua instituição.");
        }
        return campanha;
    }

    private void adicionarLocalInterno(Integer campanhaId, LocalDoacaoDTO localDto) {
        LocalDoacao local;
        if (localDto.getId() != null) {
            local = localDoacaoRepository.findById(localDto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Local Doação", localDto.getId()));
        } else {
            local = new LocalDoacao();
            local.setNome(localDto.getNome());
            local.setLogradouro(localDto.getLogradouro());
            local.setBairro(localDto.getBairro());
            local.setNumero(localDto.getNumero());
            local.setCep(localDto.getCep());
            local = localDoacaoRepository.save(local);
        }

        CampanhaLocalDoacao assoc = new CampanhaLocalDoacao();
        assoc.setCampanhaDoacaoId(campanhaId);
        assoc.setLocalDoacaoId(local.getId());
        campanhaLocalRepository.save(assoc);
    }

    private CampanhaDTO converterParaDTO(CampanhaDoacao campanha) {
        CampanhaDTO dto = new CampanhaDTO();
        dto.setId(campanha.getId());
        dto.setInstituicaoId(campanha.getInstituicaoUsuarioId());
        dto.setTitulo(campanha.getTitulo());
        dto.setDescricao(campanha.getDescricao());
        dto.setUrlImagemCapa(campanha.getUrlImagemCapa());
        dto.setDataInicio(campanha.getDataInicio());
        dto.setDataFim(campanha.getDataFim());
        dto.setStatus(campanha.getStatus());
        dto.setItensFoco(campanha.getItensFoco());
        dto.setMetaVoluntarios(campanha.getMetaVoluntarios());

        usuarioRepository.findById(campanha.getInstituicaoUsuarioId())
                .ifPresent(u -> dto.setNomeInstituicao(u.getNome()));

        List<LocalDoacaoDTO> locais = campanhaLocalRepository.findByCampanhaId(campanha.getId()).stream()
                .map(assoc -> localDoacaoRepository.findById(assoc.getLocalDoacaoId()))
                .filter(opt -> opt.isPresent())
                .map(opt -> opt.get())
                .map(l -> LocalDoacaoDTO.builder()
                        .id(l.getId())
                        .nome(l.getNome())
                        .logradouro(l.getLogradouro())
                        .bairro(l.getBairro())
                        .numero(l.getNumero())
                        .cep(l.getCep())
                        .build())
                .collect(Collectors.toList());

        dto.setLocais(locais);
        return dto;
    }
}
