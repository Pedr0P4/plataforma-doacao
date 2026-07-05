package br.com.donation.controller;

import br.com.donation.dto.AtualizarStatusInscricaoDTO;
import br.com.donation.dto.InscricaoDTO;
import br.com.donation.service.InscricaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
public class InscricaoController {

    @Autowired
    private InscricaoService inscricaoService;

    private Integer extrairUserId(Principal principal) {
        return Integer.parseInt(principal.getName());
    }

    @PostMapping("/api/campanhas/{campanhaId}/vagas/{codigoVaga}/inscricoes")
    public ResponseEntity<InscricaoDTO> inscrever(
            Principal principal,
            @PathVariable Integer campanhaId,
            @PathVariable Integer codigoVaga) {
        InscricaoDTO inscricao = inscricaoService.inscrever(extrairUserId(principal), campanhaId, codigoVaga);
        return new ResponseEntity<>(inscricao, HttpStatus.CREATED);
    }

    @GetMapping("/api/campanhas/{campanhaId}/vagas/{codigoVaga}/inscricoes")
    public ResponseEntity<List<InscricaoDTO>> listarInscricoesDaVaga(
            Principal principal,
            @PathVariable Integer campanhaId,
            @PathVariable Integer codigoVaga) {
        return ResponseEntity.ok(inscricaoService.listarInscricoesDaVaga(extrairUserId(principal), campanhaId, codigoVaga));
    }

    @PutMapping("/api/campanhas/{campanhaId}/vagas/{codigoVaga}/inscricoes/{pessoaFisicaId}/status")
    public ResponseEntity<InscricaoDTO> atualizarStatus(
            Principal principal,
            @PathVariable Integer campanhaId,
            @PathVariable Integer codigoVaga,
            @PathVariable Integer pessoaFisicaId,
            @Valid @RequestBody AtualizarStatusInscricaoDTO dto) {
        InscricaoDTO inscricao = inscricaoService.atualizarStatus(extrairUserId(principal), campanhaId, codigoVaga, pessoaFisicaId, dto.getStatus());
        return ResponseEntity.ok(inscricao);
    }

    @GetMapping("/api/inscricoes/minhas")
    public ResponseEntity<List<InscricaoDTO>> listarMinhasInscricoes(Principal principal) {
        return ResponseEntity.ok(inscricaoService.listarMinhasInscricoes(extrairUserId(principal)));
    }
}
