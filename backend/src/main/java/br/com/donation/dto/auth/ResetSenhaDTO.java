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
public class ResetSenhaDTO {
    @NotBlank(message = "O token de redefinição é obrigatório")
    private String token;

    @NotBlank(message = "A nova senha é obrigatória")
    private String novaSenha;
}
