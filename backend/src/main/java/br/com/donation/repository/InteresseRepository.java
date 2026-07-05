package br.com.donation.repository;

import br.com.donation.model.Interesse;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class InteresseRepository extends AbstractRepository {

    public Interesse save(Interesse interesse) {
        return execute(connection -> {
            String checkSql = "SELECT USUARIO_id, DOACAO_id FROM INTERESSE WHERE USUARIO_id = ? AND DOACAO_id = ?";
            boolean exists = false;
            try (PreparedStatement psCheck = connection.prepareStatement(checkSql)) {
                psCheck.setInt(1, interesse.getUsuarioId());
                psCheck.setInt(2, interesse.getDoacaoId());
                try (ResultSet rsCheck = psCheck.executeQuery()) {
                    while (rsCheck.next()) {
                        exists = true;
                    }
                }
            }

            if (!exists) {
                String insertSql = "INSERT INTO INTERESSE (USUARIO_id, DOACAO_id) VALUES (?, ?)";
                try (PreparedStatement psInsert = connection.prepareStatement(insertSql)) {
                    psInsert.setInt(1, interesse.getUsuarioId());
                    psInsert.setInt(2, interesse.getDoacaoId());
                    psInsert.executeUpdate();
                }
            }
            return interesse;
        });
    }

    public Optional<Interesse> findById(Integer usuarioId, Integer doacaoId) {
        return execute(connection -> {
            String sql = "SELECT USUARIO_id, DOACAO_id FROM INTERESSE WHERE USUARIO_id = ? AND DOACAO_id = ?";
            Interesse interesse = null;
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, usuarioId);
                ps.setInt(2, doacaoId);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        interesse = mapRow(rs);
                    }
                }
            }
            return Optional.ofNullable(interesse);
        });
    }

    public List<Interesse> findAll() {
        return execute(connection -> {
            String sql = "SELECT USUARIO_id, DOACAO_id FROM INTERESSE";
            List<Interesse> lista = new ArrayList<>();
            try (PreparedStatement ps = connection.prepareStatement(sql);
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    lista.add(mapRow(rs));
                }
            }
            return lista;
        });
    }

    public void deleteById(Integer usuarioId, Integer doacaoId) {
        executeWithoutResult(connection -> {
            String sql = "DELETE FROM INTERESSE WHERE USUARIO_id = ? AND DOACAO_id = ?";
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, usuarioId);
                ps.setInt(2, doacaoId);
                ps.executeUpdate();
            }
        });
    }

    private Interesse mapRow(ResultSet rs) throws SQLException {
        Interesse interesse = new Interesse();
        interesse.setUsuarioId(rs.getInt("USUARIO_id"));
        interesse.setDoacaoId(rs.getInt("DOACAO_id"));
        return interesse;
    }

    public List<Interesse> findByDoacaoId(Integer doacaoId) {
        return execute(connection -> {
            String sql = "SELECT USUARIO_id, DOACAO_id FROM INTERESSE WHERE DOACAO_id = ?";
            List<Interesse> lista = new ArrayList<>();
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, doacaoId);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        lista.add(mapRow(rs));
                    }
                }
            }
            return lista;
        });
    }
}
