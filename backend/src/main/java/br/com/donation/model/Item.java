package br.com.donation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Item {
    private String nome;
    private Integer doacaoId;
    private Integer quantidade;
    private String descricao;
    private String motivo;
    private String eNovo;
    private String categoria;
}
