package br.com.donation.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlterarSenhaDTO {
    
    @NotBlank(message = "A senha atual é obrigatória")
    private String senhaAtual;
    
    @NotBlank(message = "A nova senha é obrigatória")
    private String novaSenha;
}

