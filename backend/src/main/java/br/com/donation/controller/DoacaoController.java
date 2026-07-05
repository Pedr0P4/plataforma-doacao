package br.com.donation.controller;

import br.com.donation.dto.CriarDoacaoDTO;
import br.com.donation.dto.DoacaoDTO;
import br.com.donation.dto.EfetivarDoacaoDTO;
import br.com.donation.dto.PaginaDTO;
import br.com.donation.dto.UsuarioDTO;
import br.com.donation.service.DoacaoService;
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
@RequestMapping("/api/doacoes")
public class DoacaoController {

    @Autowired
    private DoacaoService doacaoService;

    private Integer extrairUserId(Principal principal) {
        return Integer.parseInt(principal.getName());
    }


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DoacaoDTO> criarDoacao(
            Principal principal, 
            @Valid @RequestPart("doacao") CriarDoacaoDTO dto,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem) {
        Integer doadorId = extrairUserId(principal);
        DoacaoDTO doacao = doacaoService.criarDoacao(doadorId, dto, imagem);
        return new ResponseEntity<>(doacao, HttpStatus.CREATED);
    }

    @PostMapping(value = "/{id}/imagem", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> atualizarImagem(
            Principal principal,
            @PathVariable Integer id,
            @RequestPart("imagem") MultipartFile imagem) {
        String urlImagem = doacaoService.atualizarImagem(extrairUserId(principal), id, imagem);
        return ResponseEntity.ok(urlImagem);
    }

    @GetMapping("/disponiveis")
    public ResponseEntity<PaginaDTO<DoacaoDTO>> listarDisponiveis(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(doacaoService.listarDisponiveis(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoacaoDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(doacaoService.buscarPorId(id));
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<DoacaoDTO>> listarMinhasDoacoes(Principal principal) {
        return ResponseEntity.ok(doacaoService.listarMinhasDoacoes(extrairUserId(principal)));
    }

    @GetMapping("/recebidas")
    public ResponseEntity<List<DoacaoDTO>> listarDoacoesRecebidas(Principal principal) {
        return ResponseEntity.ok(doacaoService.listarDoacoesRecebidas(extrairUserId(principal)));
    }


    @PostMapping("/{id}/interesse")
    public ResponseEntity<Void> registrarInteresse(Principal principal, @PathVariable Integer id) {
        doacaoService.registrarInteresse(extrairUserId(principal), id);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{id}/interesse")
    public ResponseEntity<Void> removerInteresse(Principal principal, @PathVariable Integer id) {
        doacaoService.removerInteresse(extrairUserId(principal), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/interessados")
    public ResponseEntity<List<UsuarioDTO>> listarInteressados(Principal principal, @PathVariable Integer id) {
        return ResponseEntity.ok(doacaoService.listarInteressados(extrairUserId(principal), id));
    }


    @PutMapping("/{id}/efetivar")
    public ResponseEntity<DoacaoDTO> efetivarDoacao(Principal principal, @PathVariable Integer id, @Valid @RequestBody EfetivarDoacaoDTO dto) {
        DoacaoDTO doacao = doacaoService.efetivarDoacao(extrairUserId(principal), id, dto);
        return ResponseEntity.ok(doacao);
    }
}
