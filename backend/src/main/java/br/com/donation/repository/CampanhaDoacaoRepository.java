package br.com.donation.repository;

import br.com.donation.model.CampanhaDoacao;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class CampanhaDoacaoRepository extends AbstractRepository {

    public CampanhaDoacao save(CampanhaDoacao campanha) {
        if (campanha.getId() == null) {
            return insert(campanha);
        } else {
            return update(campanha);
        }
    }

    private CampanhaDoacao insert(CampanhaDoacao campanha) {
        return execute(connection -> {
            String sql = "INSERT INTO CAMPANHA_DOACAO (INSTITUICAO_USUARIO_id, titulo, descricao, url_imagem_capa, data_inicio, data_fim, status, itens_foco, meta_voluntarios) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            try (PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                ps.setInt(1, campanha.getInstituicaoUsuarioId());
                ps.setString(2, campanha.getTitulo());
                ps.setString(3, campanha.getDescricao());
                ps.setString(4, campanha.getUrlImagemCapa());
                ps.setDate(5, campanha.getDataInicio() != null ? Date.valueOf(campanha.getDataInicio()) : null);
                ps.setDate(6, campanha.getDataFim() != null ? Date.valueOf(campanha.getDataFim()) : null);
                ps.setString(7, campanha.getStatus() != null ? campanha.getStatus() : "ATIVA");
                ps.setString(8, campanha.getItensFoco());
                if (campanha.getMetaVoluntarios() != null) {
                    ps.setInt(9, campanha.getMetaVoluntarios());
                } else {
                    ps.setNull(9, Types.INTEGER);
                }
                
                ps.executeUpdate();
                
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        campanha.setId(rs.getInt(1));
                    }
                }
            }
            return campanha;
        });
    }

    private CampanhaDoacao update(CampanhaDoacao campanha) {
        return execute(connection -> {
            String sql = "UPDATE CAMPANHA_DOACAO SET INSTITUICAO_USUARIO_id = ?, titulo = ?, descricao = ?, url_imagem_capa = ?, data_inicio = ?, data_fim = ?, status = ?, itens_foco = ?, meta_voluntarios = ? WHERE id = ?";
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, campanha.getInstituicaoUsuarioId());
                ps.setString(2, campanha.getTitulo());
                ps.setString(3, campanha.getDescricao());
                ps.setString(4, campanha.getUrlImagemCapa());
                ps.setDate(5, campanha.getDataInicio() != null ? Date.valueOf(campanha.getDataInicio()) : null);
                ps.setDate(6, campanha.getDataFim() != null ? Date.valueOf(campanha.getDataFim()) : null);
                ps.setString(7, campanha.getStatus() != null ? campanha.getStatus() : "ATIVA");
                ps.setString(8, campanha.getItensFoco());
                if (campanha.getMetaVoluntarios() != null) {
                    ps.setInt(9, campanha.getMetaVoluntarios());
                } else {
                    ps.setNull(9, Types.INTEGER);
                }
                ps.setInt(10, campanha.getId());
                ps.executeUpdate();
            }
            return campanha;
        });
    }

    public Optional<CampanhaDoacao> findById(Integer id) {
        return execute(connection -> {
            String sql = "SELECT * FROM CAMPANHA_DOACAO WHERE id = ?";
            CampanhaDoacao campanha = null;
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, id);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        campanha = mapRow(rs);
                    }
                }
            }
            return Optional.ofNullable(campanha);
        });
    }

    public List<CampanhaDoacao> findAll(int page, int size) {
        return execute(connection -> {
            String sql = "SELECT * FROM CAMPANHA_DOACAO LIMIT ? OFFSET ?";
            List<CampanhaDoacao> campanhas = new ArrayList<>();
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, size);
                ps.setInt(2, page * size);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        campanhas.add(mapRow(rs));
                    }
                }
            }
            return campanhas;
        });
    }

    public int countAll() {
        return execute(connection -> {
            String sql = "SELECT COUNT(*) FROM CAMPANHA_DOACAO";
            try (PreparedStatement ps = connection.prepareStatement(sql);
                 ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
            return 0;
        });
    }

    public void deleteById(Integer id) {
        executeWithoutResult(connection -> {
            String sql = "DELETE FROM CAMPANHA_DOACAO WHERE id = ?";
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, id);
                ps.executeUpdate();
            }
        });
    }

    public List<CampanhaDoacao> findByInstituicaoId(Integer instituicaoId) {
        return execute(connection -> {
            String sql = "SELECT * FROM CAMPANHA_DOACAO WHERE INSTITUICAO_USUARIO_id = ?";
            List<CampanhaDoacao> campanhas = new ArrayList<>();
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, instituicaoId);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        campanhas.add(mapRow(rs));
                    }
                }
            }
            return campanhas;
        });
    }

    private CampanhaDoacao mapRow(ResultSet rs) throws SQLException {
        CampanhaDoacao campanha = new CampanhaDoacao();
        campanha.setId(rs.getInt("id"));
        campanha.setInstituicaoUsuarioId(rs.getInt("INSTITUICAO_USUARIO_id"));
        campanha.setTitulo(rs.getString("titulo"));
        campanha.setDescricao(rs.getString("descricao"));
        campanha.setUrlImagemCapa(rs.getString("url_imagem_capa"));
        
        Date dtInicio = rs.getDate("data_inicio");
        if (dtInicio != null) campanha.setDataInicio(dtInicio.toLocalDate());
        
        Date dtFim = rs.getDate("data_fim");
        if (dtFim != null) campanha.setDataFim(dtFim.toLocalDate());
        
        campanha.setStatus(rs.getString("status"));
        campanha.setItensFoco(rs.getString("itens_foco"));
        
        int meta = rs.getInt("meta_voluntarios");
        if (!rs.wasNull()) {
            campanha.setMetaVoluntarios(meta);
        }
        
        return campanha;
    }
}
