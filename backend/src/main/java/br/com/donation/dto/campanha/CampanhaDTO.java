package br.com.donation.dto.campanha;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampanhaDTO {
    private Integer id;
    private Integer instituicaoId;
    private String nomeInstituicao;
    
    private String titulo;
    private String descricao;
    private String urlImagemCapa;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private String status;
    private String itensFoco;
    private Integer metaVoluntarios;

    private List<LocalDoacaoDTO> locais;
}

