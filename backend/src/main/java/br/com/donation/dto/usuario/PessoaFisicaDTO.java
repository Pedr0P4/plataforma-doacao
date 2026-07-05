package br.com.donation.dto.usuario;

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
public class PessoaFisicaDTO extends UsuarioDTO {

    @NotBlank(message = "CPF é obrigatório")
    private String cpf;

    private LocalDate dataNascimento;

    @NotBlank(message = "Senha é obrigatória")
    private String senha;
}

