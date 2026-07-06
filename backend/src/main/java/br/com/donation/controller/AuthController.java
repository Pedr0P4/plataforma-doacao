package br.com.donation.controller;

import br.com.donation.dto.auth.AuthResponseDTO;
import br.com.donation.dto.auth.EsqueciSenhaDTO;
import br.com.donation.dto.auth.EsqueciSenhaResponseDTO;
import br.com.donation.dto.auth.LoginDTO;
import br.com.donation.dto.auth.RegistroDTO;
import br.com.donation.dto.auth.ResetSenhaDTO;
import br.com.donation.dto.auth.VerifyResponseDTO;
import br.com.donation.dto.usuario.InstituicaoDTO;
import br.com.donation.dto.usuario.PessoaFisicaDTO;
import br.com.donation.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/registro")
    public ResponseEntity<AuthResponseDTO> registrar(@Valid @RequestBody RegistroDTO dto, HttpServletResponse response) {
        AuthResponseDTO authResponse = authService.registrar(dto);
        authService.adicionarCookieToken(response, authResponse.getToken());
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @PostMapping("/registro/pessoa-fisica")
    public ResponseEntity<AuthResponseDTO> registrarPessoaFisica(@Valid @RequestBody PessoaFisicaDTO dto, HttpServletResponse response) {
        AuthResponseDTO authResponse = authService.registrarPessoaFisica(dto);
        authService.adicionarCookieToken(response, authResponse.getToken());
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @PostMapping("/registro/instituicao")
    public ResponseEntity<AuthResponseDTO> registrarInstituicao(@Valid @RequestBody InstituicaoDTO dto, HttpServletResponse response) {
        AuthResponseDTO authResponse = authService.registrarInstituicao(dto);
        authService.adicionarCookieToken(response, authResponse.getToken());
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginDTO dto, HttpServletResponse response) {
        AuthResponseDTO authResponse = authService.login(dto);
        authService.adicionarCookieToken(response, authResponse.getToken());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        authService.removerCookieToken(response);
        return ResponseEntity.ok("Logout realizado com sucesso");
    }

    @GetMapping("/logout")
    public ResponseEntity<String> logoutGet(HttpServletResponse response) {
        authService.removerCookieToken(response);
        return ResponseEntity.ok("Logout realizado com sucesso");
    }

    @PostMapping("/esqueci-senha")
    public ResponseEntity<EsqueciSenhaResponseDTO> esqueciSenha(@Valid @RequestBody EsqueciSenhaDTO dto) {
        EsqueciSenhaResponseDTO res = authService.esqueciSenha(dto);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/reset-senha")
    public ResponseEntity<String> resetSenha(@Valid @RequestBody ResetSenhaDTO dto) {
        authService.resetSenha(dto);
        return ResponseEntity.ok("Senha redefinida com sucesso");
    }

    @GetMapping("/verify")
    public ResponseEntity<VerifyResponseDTO> verify() {
        VerifyResponseDTO res = authService.verificarSessao();
        return ResponseEntity.ok(res);
    }
}

