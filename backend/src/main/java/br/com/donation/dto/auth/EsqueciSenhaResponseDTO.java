package br.com.donation.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EsqueciSenhaResponseDTO {
    private String mensagem;
    private String tokenReset;
}
