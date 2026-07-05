package br.com.donation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VagaVoluntarioDTO {
    private Integer campanhaDoacaoId;
    private Integer codigoVaga;
    private String funcao;
    private String descricaoAtividades;
    private Integer quantidadeVagas;
    private Integer cargaHorariaSemanal;
    private LocalDate dataInicio;
    private LocalDate dataFim;
}
