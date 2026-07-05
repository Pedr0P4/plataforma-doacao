package br.com.donation.controller;

import br.com.donation.dto.vaga.CriarVagaDTO;
import br.com.donation.dto.vaga.VagaVoluntarioDTO;
import br.com.donation.service.VagaVoluntarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/campanhas/{campanhaId}/vagas")
public class VagaVoluntarioController {

    @Autowired
    private VagaVoluntarioService vagaVoluntarioService;

    private Integer extrairUserId(Principal principal) {
        return Integer.parseInt(principal.getName());
    }

    @PostMapping
    public ResponseEntity<VagaVoluntarioDTO> criarVaga(
            Principal principal,
            @PathVariable Integer campanhaId,
            @Valid @RequestBody CriarVagaDTO dto) {
        VagaVoluntarioDTO vaga = vagaVoluntarioService.criarVaga(extrairUserId(principal), campanhaId, dto);
        return new ResponseEntity<>(vaga, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<VagaVoluntarioDTO>> listarVagas(@PathVariable Integer campanhaId) {
        return ResponseEntity.ok(vagaVoluntarioService.listarVagasPorCampanha(campanhaId));
    }

    @DeleteMapping("/{codigoVaga}")
    public ResponseEntity<Void> removerVaga(
            Principal principal,
            @PathVariable Integer campanhaId,
            @PathVariable Integer codigoVaga) {
        vagaVoluntarioService.removerVaga(extrairUserId(principal), campanhaId, codigoVaga);
        return ResponseEntity.noContent().build();
    }
}

