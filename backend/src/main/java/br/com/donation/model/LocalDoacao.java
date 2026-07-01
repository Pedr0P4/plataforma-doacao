package br.com.donation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocalDoacao {
    private Integer id;
    private String nome;
    private String logradouro;
    private String bairro;
    private String numero;
    private String cep;
}
