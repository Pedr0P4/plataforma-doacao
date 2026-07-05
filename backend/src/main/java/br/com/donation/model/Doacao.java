package br.com.donation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doacao {
    private Integer id;
    private Integer doadorId;
    private Integer donatarioId;
    private Integer localDoacaoId;
    private String urlImagem;
    private Usuario doador;
    private Usuario donatario;
    private LocalDoacao localDoacao;
}
