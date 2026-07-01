package br.com.donation.repository;

import br.com.donation.model.CampanhaDoacao;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
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
            String sql = "INSERT INTO CAMPANHA_DOACAO (INSTITUICAO_USUARIO_id) VALUES (?)";
            try (PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                ps.setInt(1, campanha.getInstituicaoUsuarioId());
                ps.executeUpdate();
                
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    while (rs.next()) {
                        campanha.setId(rs.getInt(1));
                    }
                }
            }
            return campanha;
        });
    }

    private CampanhaDoacao update(CampanhaDoacao campanha) {
        return execute(connection -> {
            String sql = "UPDATE CAMPANHA_DOACAO SET INSTITUICAO_USUARIO_id = ? WHERE id = ?";
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, campanha.getInstituicaoUsuarioId());
                ps.setInt(2, campanha.getId());
                ps.executeUpdate();
            }
            return campanha;
        });
    }

    public Optional<CampanhaDoacao> findById(Integer id) {
        return execute(connection -> {
            String sql = "SELECT id, INSTITUICAO_USUARIO_id FROM CAMPANHA_DOACAO WHERE id = ?";
            CampanhaDoacao campanha = null;
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, id);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        campanha = mapRow(rs);
                    }
                }
            }
            return Optional.ofNullable(campanha);
        });
    }

    public List<CampanhaDoacao> findAll() {
        return execute(connection -> {
            String sql = "SELECT id, INSTITUICAO_USUARIO_id FROM CAMPANHA_DOACAO";
            List<CampanhaDoacao> campanhas = new ArrayList<>();
            try (PreparedStatement ps = connection.prepareStatement(sql);
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    campanhas.add(mapRow(rs));
                }
            }
            return campanhas;
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

    private CampanhaDoacao mapRow(ResultSet rs) throws SQLException {
        CampanhaDoacao campanha = new CampanhaDoacao();
        campanha.setId(rs.getInt("id"));
        campanha.setInstituicaoUsuarioId(rs.getInt("INSTITUICAO_USUARIO_id"));
        return campanha;
    }
}
