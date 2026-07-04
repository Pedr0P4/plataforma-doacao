package br.com.donation.service;

import br.com.donation.dto.InstituicaoDTO;
import br.com.donation.dto.PessoaFisicaDTO;
import br.com.donation.dto.UsuarioDTO;
import br.com.donation.exception.ResourceNotFoundException;
import br.com.donation.model.Instituicao;
import br.com.donation.model.PessoaFisica;
import br.com.donation.model.Usuario;
import br.com.donation.repository.InstituicaoRepository;
import br.com.donation.repository.PessoaFisicaRepository;
import br.com.donation.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PessoaFisicaRepository pessoaFisicaRepository;

    @Autowired
    private InstituicaoRepository instituicaoRepository;

    public List<PessoaFisicaDTO> listarPessoasFisicas() {
        return pessoaFisicaRepository.findAll().stream().map(pf -> {
            PessoaFisicaDTO dto = new PessoaFisicaDTO();
            dto.setCpf(pf.getCpf());
            dto.setDataNascimento(pf.getDataNascimento());

            usuarioRepository.findById(pf.getUsuarioId()).ifPresent(u -> preencherDadosUsuario(dto, u));
            return dto;
        }).collect(Collectors.toList());
    }

    public List<InstituicaoDTO> listarInstituicoes() {
        return instituicaoRepository.findAll().stream().map(inst -> {
            InstituicaoDTO dto = new InstituicaoDTO();
            dto.setCnpj(inst.getCnpj());
            dto.setSite(inst.getSite());

            usuarioRepository.findById(inst.getUsuarioId()).ifPresent(u -> preencherDadosUsuario(dto, u));
            return dto;
        }).collect(Collectors.toList());
    }

    public PessoaFisicaDTO buscarPessoaFisica(Integer id) {
        PessoaFisica pf = pessoaFisicaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pessoa Física", id));

        PessoaFisicaDTO dto = new PessoaFisicaDTO();
        dto.setCpf(pf.getCpf());
        dto.setDataNascimento(pf.getDataNascimento());

        Usuario usuario = usuarioRepository.findById(pf.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", pf.getUsuarioId()));
        preencherDadosUsuario(dto, usuario);

        return dto;
    }

    public InstituicaoDTO buscarInstituicao(Integer id) {
        Instituicao inst = instituicaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Instituição", id));

        InstituicaoDTO dto = new InstituicaoDTO();
        dto.setCnpj(inst.getCnpj());
        dto.setSite(inst.getSite());

        Usuario usuario = usuarioRepository.findById(inst.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", inst.getUsuarioId()));
        preencherDadosUsuario(dto, usuario);

        return dto;
    }

    private void preencherDadosUsuario(UsuarioDTO dto, Usuario u) {
        dto.setId(u.getId());
        dto.setNome(u.getNome());
        dto.setEmail(u.getEmail());
        dto.setLogradouro(u.getLogradouro());
        dto.setBairro(u.getBairro());
        dto.setNumero(u.getNumero());
        dto.setCep(u.getCep());
    }
}
