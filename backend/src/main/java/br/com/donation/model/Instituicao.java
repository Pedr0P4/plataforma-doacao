package br.com.donation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Instituicao {
    private Integer usuarioId;
    private String cnpj;
    private String site;
    private Usuario usuario;
}
