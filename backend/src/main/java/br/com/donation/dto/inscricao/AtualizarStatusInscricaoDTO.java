package br.com.donation.dto.inscricao;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AtualizarStatusInscricaoDTO {
    
    @NotBlank(message = "O status é obrigatório")
    private String status;
}

