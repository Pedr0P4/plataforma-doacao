package br.com.donation.controller;

import br.com.donation.dto.avaliacao.AvaliacaoDTO;
import br.com.donation.service.AvaliacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/doacoes/{doacaoId}/avaliacoes")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService avaliacaoService;

    @PostMapping
    public ResponseEntity<AvaliacaoDTO> avaliar(Principal principal, @PathVariable Integer doacaoId, @Valid @RequestBody AvaliacaoDTO dto) {
        Integer userId = Integer.parseInt(principal.getName());
        AvaliacaoDTO avaliacao = avaliacaoService.avaliar(userId, doacaoId, dto);
        return new ResponseEntity<>(avaliacao, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AvaliacaoDTO>> listarAvaliacoes(@PathVariable Integer doacaoId) {
        return ResponseEntity.ok(avaliacaoService.listarAvaliacoes(doacaoId));
    }
}

