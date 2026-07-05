package br.com.donation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CriarCampanhaDTO {

    @NotBlank(message = "O título da campanha é obrigatório")
    private String titulo;

    private String descricao;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private String itensFoco;
    private Integer metaVoluntarios;

    @Valid
    private List<LocalDoacaoDTO> locais;
}
