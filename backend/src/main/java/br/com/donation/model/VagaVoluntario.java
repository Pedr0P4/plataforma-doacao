package br.com.donation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VagaVoluntario {
    private Integer campanhaDoacaoId;
    private Integer codigoVaga;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private Integer quantidadeVagas;
    private String descricaoAtividades;
    private Integer cargaHorariaSemanal;
    private String funcao;
}
