package br.com.donation.dto.auth;

import br.com.donation.dto.usuario.UsuarioDTO;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroDTO extends UsuarioDTO {

    @NotBlank(message = "Tipo de usuário é obrigatório (PESSOA_FISICA ou INSTITUICAO)")
    private String tipo;

    @NotBlank(message = "Senha é obrigatória")
    private String senha;

    // Campos específicos para PESSOA_FISICA
    private String cpf;
    private LocalDate dataNascimento;

    // Campos específicos para INSTITUICAO
    private String cnpj;
    private String site;
}
