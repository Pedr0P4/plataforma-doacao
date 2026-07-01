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
public class Inscricao {
    private Integer pessoaFisicaUsuarioId;
    private Integer vagaVoluntarioCodigoVaga;
    private Integer vagaVoluntarioCampanhaDoacaoId;
    private LocalDate data;
    private String status;
}
