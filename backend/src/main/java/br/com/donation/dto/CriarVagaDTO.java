package br.com.donation.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CriarVagaDTO {

    @NotBlank(message = "A função da vaga é obrigatória")
    private String funcao;

    @NotBlank(message = "A descrição das atividades é obrigatória")
    private String descricaoAtividades;

    @Min(value = 1, message = "A quantidade de vagas deve ser no mínimo 1")
    private Integer quantidadeVagas;

    private Integer cargaHorariaSemanal;
    private LocalDate dataInicio;
    private LocalDate dataFim;
}
