package br.com.donation.repository;

import br.com.donation.model.Instituicao;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class InstituicaoRepository extends AbstractRepository {

    public Instituicao save(Instituicao instituicao) {
        return execute(connection -> {
            String checkSql = "SELECT USUARIO_id FROM INSTITUICAO WHERE USUARIO_id = ?";
            boolean exists = false;
            try (PreparedStatement psCheck = connection.prepareStatement(checkSql)) {
                psCheck.setInt(1, instituicao.getUsuarioId());
                try (ResultSet rsCheck = psCheck.executeQuery()) {
                    while (rsCheck.next()) {
                        exists = true;
                    }
                }
            }

            if (exists) {
                String updateSql = "UPDATE INSTITUICAO SET CNPJ = ?, site = ? WHERE USUARIO_id = ?";
                try (PreparedStatement psUpdate = connection.prepareStatement(updateSql)) {
                    psUpdate.setString(1, instituicao.getCnpj());
                    psUpdate.setString(2, instituicao.getSite());
                    psUpdate.setInt(3, instituicao.getUsuarioId());
                    psUpdate.executeUpdate();
                }
            } else {
                String insertSql = "INSERT INTO INSTITUICAO (USUARIO_id, CNPJ, site) VALUES (?, ?, ?)";
                try (PreparedStatement psInsert = connection.prepareStatement(insertSql)) {
                    psInsert.setInt(1, instituicao.getUsuarioId());
                    psInsert.setString(2, instituicao.getCnpj());
                    psInsert.setString(3, instituicao.getSite());
                    psInsert.executeUpdate();
                }
            }
            return instituicao;
        });
    }

    public Optional<Instituicao> findById(Integer usuarioId) {
        return execute(connection -> {
            String sql = "SELECT USUARIO_id, CNPJ, site FROM INSTITUICAO WHERE USUARIO_id = ?";
            Instituicao instituicao = null;
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, usuarioId);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        instituicao = mapRow(rs);
                    }
                }
            }
            return Optional.ofNullable(instituicao);
        });
    }

    public List<Instituicao> findAll() {
        return execute(connection -> {
            String sql = "SELECT USUARIO_id, CNPJ, site FROM INSTITUICAO";
            List<Instituicao> instituicoes = new ArrayList<>();
            try (PreparedStatement ps = connection.prepareStatement(sql);
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    instituicoes.add(mapRow(rs));
                }
            }
            return instituicoes;
        });
    }

    public void deleteById(Integer usuarioId) {
        executeWithoutResult(connection -> {
            String sql = "DELETE FROM INSTITUICAO WHERE USUARIO_id = ?";
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, usuarioId);
                ps.executeUpdate();
            }
        });
    }

    private Instituicao mapRow(ResultSet rs) throws SQLException {
        Instituicao instituicao = new Instituicao();
        instituicao.setUsuarioId(rs.getInt("USUARIO_id"));
        instituicao.setCnpj(rs.getString("CNPJ"));
        instituicao.setSite(rs.getString("site"));
        return instituicao;
    }
}
