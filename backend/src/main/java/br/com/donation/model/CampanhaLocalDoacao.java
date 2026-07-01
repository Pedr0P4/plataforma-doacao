package br.com.donation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampanhaLocalDoacao {
    private Integer campanhaDoacaoId;
    private Integer localDoacaoId;
}
