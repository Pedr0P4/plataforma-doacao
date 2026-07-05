package br.com.donation.controller;

import br.com.donation.dto.auth.AuthResponseDTO;
import br.com.donation.dto.usuario.InstituicaoDTO;
import br.com.donation.dto.auth.LoginDTO;
import br.com.donation.dto.usuario.PessoaFisicaDTO;
import br.com.donation.service.AuthService;
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

    @PostMapping("/registro/pessoa-fisica")
    public ResponseEntity<AuthResponseDTO> registrarPessoaFisica(@Valid @RequestBody PessoaFisicaDTO dto) {
        AuthResponseDTO response = authService.registrarPessoaFisica(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/registro/instituicao")
    public ResponseEntity<AuthResponseDTO> registrarInstituicao(@Valid @RequestBody InstituicaoDTO dto) {
        AuthResponseDTO response = authService.registrarInstituicao(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginDTO dto) {
        AuthResponseDTO response = authService.login(dto);
        return ResponseEntity.ok(response);
    }
}

