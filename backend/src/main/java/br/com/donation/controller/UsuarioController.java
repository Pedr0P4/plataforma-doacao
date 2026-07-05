package br.com.donation.controller;

import br.com.donation.dto.usuario.InstituicaoDTO;
import br.com.donation.dto.usuario.PessoaFisicaDTO;
import br.com.donation.dto.usuario.AtualizarPerfilDTO;
import br.com.donation.dto.auth.AlterarSenhaDTO;
import br.com.donation.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/pessoa-fisica")
    public ResponseEntity<List<PessoaFisicaDTO>> listarPessoasFisicas() {
        return ResponseEntity.ok(usuarioService.listarPessoasFisicas());
    }

    @GetMapping("/instituicao")
    public ResponseEntity<List<InstituicaoDTO>> listarInstituicoes() {
        return ResponseEntity.ok(usuarioService.listarInstituicoes());
    }

    @GetMapping("/pessoa-fisica/{id}")
    public ResponseEntity<PessoaFisicaDTO> buscarPessoaFisica(@PathVariable Integer id) {
        return ResponseEntity.ok(usuarioService.buscarPessoaFisica(id));
    }

    @GetMapping("/instituicao/{id}")
    public ResponseEntity<InstituicaoDTO> buscarInstituicao(@PathVariable Integer id) {
        return ResponseEntity.ok(usuarioService.buscarInstituicao(id));
    }

    @PutMapping("/perfil")
    public ResponseEntity<Void> atualizarPerfil(Principal principal, @Valid @RequestBody AtualizarPerfilDTO dto) {
        Integer userId = Integer.parseInt(principal.getName());
        usuarioService.atualizarPerfil(userId, dto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/senha")
    public ResponseEntity<Void> alterarSenha(Principal principal, @Valid @RequestBody AlterarSenhaDTO dto) {
        Integer userId = Integer.parseInt(principal.getName());
        usuarioService.alterarSenha(userId, dto);
        return ResponseEntity.ok().build();
    }
}

