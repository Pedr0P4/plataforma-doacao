package br.com.donation.controller;

import br.com.donation.dto.campanha.CampanhaDTO;
import br.com.donation.dto.campanha.CriarCampanhaDTO;
import br.com.donation.dto.campanha.LocalDoacaoDTO;
import br.com.donation.dto.common.PaginaDTO;
import br.com.donation.service.CampanhaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/campanhas")
public class CampanhaController {

    @Autowired
    private CampanhaService campanhaService;

    private Integer extrairUserId(Principal principal) {
        return Integer.parseInt(principal.getName());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CampanhaDTO> criarCampanha(
            Principal principal, 
            @RequestPart("campanha") @Valid CriarCampanhaDTO dto,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem) {
        CampanhaDTO campanha = campanhaService.criarCampanha(extrairUserId(principal), dto, imagem);
        return new ResponseEntity<>(campanha, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<PaginaDTO<CampanhaDTO>> listarCampanhas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(campanhaService.listarCampanhas(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampanhaDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(campanhaService.buscarPorId(id));
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<CampanhaDTO>> listarMinhasCampanhas(Principal principal) {
        return ResponseEntity.ok(campanhaService.listarMinhasCampanhas(extrairUserId(principal)));
    }

    @PostMapping("/{id}/imagem")
    public ResponseEntity<CampanhaDTO> atualizarImagem(Principal principal, @PathVariable Integer id, @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        CampanhaDTO campanha = campanhaService.atualizarImagem(extrairUserId(principal), id, file);
        return ResponseEntity.ok(campanha);
    }

    @PostMapping("/{id}/locais")
    public ResponseEntity<CampanhaDTO> adicionarLocal(Principal principal, @PathVariable Integer id, @Valid @RequestBody LocalDoacaoDTO localDto) {
        CampanhaDTO campanha = campanhaService.adicionarLocal(extrairUserId(principal), id, localDto);
        return ResponseEntity.ok(campanha);
    }

    @DeleteMapping("/{id}/locais/{localId}")
    public ResponseEntity<Void> removerLocal(Principal principal, @PathVariable Integer id, @PathVariable Integer localId) {
        campanhaService.removerLocal(extrairUserId(principal), id, localId);
        return ResponseEntity.noContent().build();
    }
}

