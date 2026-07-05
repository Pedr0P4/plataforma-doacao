package br.com.donation.dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaginaDTO<T> {
    private List<T> content;
    private int totalElements;
    private int totalPages;
    private int currentPage;
}

