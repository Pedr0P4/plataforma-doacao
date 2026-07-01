package br.com.donation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampanhaDoacao {
    private Integer id;
    private Integer instituicaoUsuarioId;
    private Instituicao instituicao;
}
