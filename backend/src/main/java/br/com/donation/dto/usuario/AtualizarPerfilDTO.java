package br.com.donation.dto.usuario;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AtualizarPerfilDTO {
    
    @NotBlank(message = "O nome é obrigatório")
    private String nome;
    
    private String logradouro;
    private String bairro;
    private String numero;
    private String cep;
}

