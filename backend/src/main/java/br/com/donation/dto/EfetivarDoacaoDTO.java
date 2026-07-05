package br.com.donation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EfetivarDoacaoDTO {

    @NotNull(message = "ID do donatário é obrigatório")
    private Integer donatarioId;

    @NotNull(message = "Local de doação é obrigatório")
    @Valid
    private LocalDoacaoDTO localDoacao;
}
