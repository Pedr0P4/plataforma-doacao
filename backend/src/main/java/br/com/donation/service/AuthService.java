package br.com.donation.service;
import br.com.donation.dto.auth.LoginDTO;
import br.com.donation.dto.usuario.UsuarioDTO;
import br.com.donation.dto.auth.AuthResponseDTO;
import br.com.donation.dto.usuario.InstituicaoDTO;
import br.com.donation.dto.usuario.PessoaFisicaDTO;
import br.com.donation.dto.auth.EsqueciSenhaDTO;
import br.com.donation.dto.auth.EsqueciSenhaResponseDTO;
import br.com.donation.dto.auth.RegistroDTO;
import br.com.donation.dto.auth.ResetSenhaDTO;
import br.com.donation.dto.auth.VerifyResponseDTO;
import br.com.donation.exception.BusinessException;
import br.com.donation.exception.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

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


    public void adicionarCookieToken(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .path("/")
                .maxAge(jwtUtil.getExpiration() / 1000)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public void removerCookieToken(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public AuthResponseDTO registrar(RegistroDTO dto) {
        if ("PESSOA_FISICA".equalsIgnoreCase(dto.getTipo())) {
            if (dto.getCpf() == null || dto.getCpf().trim().isEmpty()) {
                throw new BusinessException("CPF é obrigatório para pessoa física.");
            }
            PessoaFisicaDTO pfDto = new PessoaFisicaDTO();
            pfDto.setNome(dto.getNome());
            pfDto.setEmail(dto.getEmail());
            pfDto.setSenha(dto.getSenha());
            pfDto.setLogradouro(dto.getLogradouro());
            pfDto.setBairro(dto.getBairro());
            pfDto.setNumero(dto.getNumero());
            pfDto.setCep(dto.getCep());
            pfDto.setCpf(dto.getCpf());
            pfDto.setDataNascimento(dto.getDataNascimento());
            return registrarPessoaFisica(pfDto);
        } else if ("INSTITUICAO".equalsIgnoreCase(dto.getTipo())) {
            if (dto.getCnpj() == null || dto.getCnpj().trim().isEmpty()) {
                throw new BusinessException("CNPJ é obrigatório para instituição.");
            }
            InstituicaoDTO instDto = new InstituicaoDTO();
            instDto.setNome(dto.getNome());
            instDto.setEmail(dto.getEmail());
            instDto.setSenha(dto.getSenha());
            instDto.setLogradouro(dto.getLogradouro());
            instDto.setBairro(dto.getBairro());
            instDto.setNumero(dto.getNumero());
            instDto.setCep(dto.getCep());
            instDto.setCnpj(dto.getCnpj());
            instDto.setSite(dto.getSite());
            return registrarInstituicao(instDto);
        } else {
            throw new BusinessException("Tipo de usuário inválido. Escolha PESSOA_FISICA ou INSTITUICAO.");
        }
    }

    public EsqueciSenhaResponseDTO esqueciSenha(EsqueciSenhaDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com o e-mail: " + dto.getEmail()));

        String tokenReset = jwtUtil.gerarTokenResetSenha(usuario.getId(), usuario.getEmail());

        return EsqueciSenhaResponseDTO.builder()
                .mensagem("Token de recuperação de senha gerado com sucesso. Use o token para redefinir a senha.")
                .tokenReset(tokenReset)
                .build();
    }

    public void resetSenha(ResetSenhaDTO dto) {
        if (!jwtUtil.isTokenResetValido(dto.getToken())) {
            throw new BusinessException("Token de redefinição de senha inválido ou expirado.");
        }

        Integer userId = jwtUtil.extrairUserId(dto.getToken());
        usuarioRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", userId));

        usuarioRepository.updateSenha(userId, passwordEncoder.encode(dto.getNovaSenha()));
    }

    public VerifyResponseDTO verificarSessao() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return VerifyResponseDTO.builder()
                    .logado(false)
                    .mensagem("Usuário não está autenticado.")
                    .usuario(null)
                    .build();
        }

        try {
            Integer userId = (Integer) auth.getPrincipal();
            Usuario usuario = usuarioRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Usuário", userId));

            String tipo = identificarTipoUsuario(usuario.getId());

            AuthResponseDTO authDto = AuthResponseDTO.builder()
                    .token(null)
                    .tipo(tipo)
                    .id(usuario.getId())
                    .nome(usuario.getNome())
                    .email(usuario.getEmail())
                    .build();

            return VerifyResponseDTO.builder()
                    .logado(true)
                    .mensagem("Usuário logado e sessão ativa.")
                    .usuario(authDto)
                    .build();
        } catch (Exception e) {
            return VerifyResponseDTO.builder()
                    .logado(false)
                    .mensagem("Erro ao verificar sessão: " + e.getMessage())
                    .usuario(null)
                    .build();
        }
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

