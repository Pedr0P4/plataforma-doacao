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
public class Avaliacao {
    private Integer id;
    private LocalDate dataAvaliacao;
    private String comentario;
    private Integer nota;
    private String papelAvaliador;
    private Integer doacaoId;
}
