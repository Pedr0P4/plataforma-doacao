package br.com.donation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CriarDoacaoDTO {

    @NotEmpty(message = "A doação deve ter pelo menos um item")
    @Valid
    private List<ItemDTO> itens;
}
