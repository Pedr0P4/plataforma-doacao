package br.com.donation.service;
import br.com.donation.dto.auth.LoginDTO;
import br.com.donation.dto.usuario.UsuarioDTO;
import br.com.donation.dto.auth.AuthResponseDTO;
import br.com.donation.dto.usuario.InstituicaoDTO;
import br.com.donation.dto.usuario.PessoaFisicaDTO;


import br.com.donation.exception.AuthenticationException;
import br.com.donation.exception.DuplicateResourceException;
import br.com.donation.model.Instituicao;
import br.com.donation.model.PessoaFisica;
import br.com.donation.model.Usuario;
import br.com.donation.repository.InstituicaoRepository;
import br.com.donation.repository.PessoaFisicaRepository;
import br.com.donation.repository.UsuarioRepository;
import br.com.donation.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PessoaFisicaRepository pessoaFisicaRepository;

    @Autowired
    private InstituicaoRepository instituicaoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponseDTO registrarPessoaFisica(PessoaFisicaDTO dto) {
        verificarEmailDuplicado(dto.getEmail());

        Usuario usuario = criarUsuarioBase(dto, dto.getSenha());
        usuarioRepository.save(usuario);

        PessoaFisica pf = new PessoaFisica();
        pf.setUsuarioId(usuario.getId());
        pf.setCpf(dto.getCpf());
        pf.setDataNascimento(dto.getDataNascimento());
        pessoaFisicaRepository.save(pf);

        String token = jwtUtil.gerarToken(usuario.getId(), usuario.getEmail(), "PESSOA_FISICA");

        return AuthResponseDTO.builder()
                .token(token)
                .tipo("PESSOA_FISICA")
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .build();
    }

    public AuthResponseDTO registrarInstituicao(InstituicaoDTO dto) {
        verificarEmailDuplicado(dto.getEmail());

        Usuario usuario = criarUsuarioBase(dto, dto.getSenha());
        usuarioRepository.save(usuario);

        Instituicao inst = new Instituicao();
        inst.setUsuarioId(usuario.getId());
        inst.setCnpj(dto.getCnpj());
        inst.setSite(dto.getSite());
        instituicaoRepository.save(inst);

        String token = jwtUtil.gerarToken(usuario.getId(), usuario.getEmail(), "INSTITUICAO");

        return AuthResponseDTO.builder()
                .token(token)
                .tipo("INSTITUICAO")
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .build();
    }

    public AuthResponseDTO login(LoginDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new AuthenticationException("Credenciais inválidas"));

        if (!passwordEncoder.matches(dto.getSenha(), usuario.getSenha())) {
            throw new AuthenticationException("Credenciais inválidas");
        }

        String tipo = identificarTipoUsuario(usuario.getId());
        String token = jwtUtil.gerarToken(usuario.getId(), usuario.getEmail(), tipo);

        return AuthResponseDTO.builder()
                .token(token)
                .tipo(tipo)
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .build();
    }

    private void verificarEmailDuplicado(String email) {
        usuarioRepository.findByEmail(email).ifPresent(u -> {
            throw new DuplicateResourceException("Usuário", "email", email);
        });
    }

    private Usuario criarUsuarioBase(UsuarioDTO dto, String senhaPlana) {
        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(passwordEncoder.encode(senhaPlana));
        usuario.setLogradouro(dto.getLogradouro());
        usuario.setBairro(dto.getBairro());
        usuario.setNumero(dto.getNumero());
        usuario.setCep(dto.getCep());
        return usuario;
    }

    private String identificarTipoUsuario(Integer usuarioId) {
        if (pessoaFisicaRepository.findById(usuarioId).isPresent()) {
            return "PESSOA_FISICA";
        }
        if (instituicaoRepository.findById(usuarioId).isPresent()) {
            return "INSTITUICAO";
        }
        return "USUARIO";
    }
}

