package br.com.donation.dto.doacao;
import br.com.donation.dto.campanha.ItemDTO;
import br.com.donation.dto.campanha.LocalDoacaoDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoacaoDTO {
    private Integer id;
    private Integer doadorId;
    private String nomeDoador;
    private Integer donatarioId;
    private String nomeDonatario;
    private LocalDoacaoDTO localDoacao;
    private List<ItemDTO> itens;
    private String urlImagem;
}


