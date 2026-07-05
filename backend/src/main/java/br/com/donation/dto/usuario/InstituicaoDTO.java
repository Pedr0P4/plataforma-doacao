package br.com.donation.dto.usuario;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InstituicaoDTO extends UsuarioDTO {

    @NotBlank(message = "CNPJ é obrigatório")
    private String cnpj;

    private String site;

    @NotBlank(message = "Senha é obrigatória")
    private String senha;
}

