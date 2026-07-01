package br.com.donation.repository;

import br.com.donation.model.CampanhaLocalDoacao;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class CampanhaLocalDoacaoRepository extends AbstractRepository {

    public CampanhaLocalDoacao save(CampanhaLocalDoacao assoc) {
        return execute(connection -> {
            String checkSql = "SELECT CAMPANHA_DOACAO_id, LOCAL_DOACAO_id FROM CAMPANHA_LOCAL_DOACAO WHERE CAMPANHA_DOACAO_id = ? AND LOCAL_DOACAO_id = ?";
            boolean exists = false;
            try (PreparedStatement psCheck = connection.prepareStatement(checkSql)) {
                psCheck.setInt(1, assoc.getCampanhaDoacaoId());
                psCheck.setInt(2, assoc.getLocalDoacaoId());
                try (ResultSet rsCheck = psCheck.executeQuery()) {
                    while (rsCheck.next()) {
                        exists = true;
                    }
                }
            }

            if (!exists) {
                String insertSql = "INSERT INTO CAMPANHA_LOCAL_DOACAO (CAMPANHA_DOACAO_id, LOCAL_DOACAO_id) VALUES (?, ?)";
                try (PreparedStatement psInsert = connection.prepareStatement(insertSql)) {
                    psInsert.setInt(1, assoc.getCampanhaDoacaoId());
                    psInsert.setInt(2, assoc.getLocalDoacaoId());
                    psInsert.executeUpdate();
                }
            }
            return assoc;
        });
    }

    public Optional<CampanhaLocalDoacao> findById(Integer campanhaDoacaoId, Integer localDoacaoId) {
        return execute(connection -> {
            String sql = "SELECT CAMPANHA_DOACAO_id, LOCAL_DOACAO_id FROM CAMPANHA_LOCAL_DOACAO WHERE CAMPANHA_DOACAO_id = ? AND LOCAL_DOACAO_id = ?";
            CampanhaLocalDoacao assoc = null;
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, campanhaDoacaoId);
                ps.setInt(2, localDoacaoId);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        assoc = mapRow(rs);
                    }
                }
            }
            return Optional.ofNullable(assoc);
        });
    }

    public List<CampanhaLocalDoacao> findAll() {
        return execute(connection -> {
            String sql = "SELECT CAMPANHA_DOACAO_id, LOCAL_DOACAO_id FROM CAMPANHA_LOCAL_DOACAO";
            List<CampanhaLocalDoacao> lista = new ArrayList<>();
            try (PreparedStatement ps = connection.prepareStatement(sql);
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    lista.add(mapRow(rs));
                }
            }
            return lista;
        });
    }

    public void deleteById(Integer campanhaDoacaoId, Integer localDoacaoId) {
        executeWithoutResult(connection -> {
            String sql = "DELETE FROM CAMPANHA_LOCAL_DOACAO WHERE CAMPANHA_DOACAO_id = ? AND LOCAL_DOACAO_id = ?";
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, campanhaDoacaoId);
                ps.setInt(2, localDoacaoId);
                ps.executeUpdate();
            }
        });
    }

    private CampanhaLocalDoacao mapRow(ResultSet rs) throws SQLException {
        CampanhaLocalDoacao assoc = new CampanhaLocalDoacao();
        assoc.setCampanhaDoacaoId(rs.getInt("CAMPANHA_DOACAO_id"));
        assoc.setLocalDoacaoId(rs.getInt("LOCAL_DOACAO_id"));
        return assoc;
    }
}
