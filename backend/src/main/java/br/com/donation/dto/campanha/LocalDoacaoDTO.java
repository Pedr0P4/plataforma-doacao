package br.com.donation.dto.campanha;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocalDoacaoDTO {
    private Integer id;

    @NotBlank(message = "Nome do local é obrigatório")
    private String nome;

    private String logradouro;
    private String bairro;
    private String numero;
    private String cep;
}

