package br.com.donation.dto.inscricao;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InscricaoDTO {
    private Integer pessoaFisicaId;
    private String nomePessoaFisica;
    private String emailPessoaFisica;
    
    private Integer codigoVaga;
    private String nomeVaga; // funcao
    
    private Integer campanhaId;
    private String nomeCampanha; // titulo da campanha
    
    private LocalDate dataInscricao;
    private String status;
}

