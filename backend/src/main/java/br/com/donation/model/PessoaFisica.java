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
public class PessoaFisica {
    private Integer usuarioId;
    private String cpf;
    private LocalDate dataNascimento;
    private Usuario usuario;
}
