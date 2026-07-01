package br.com.donation.repository;

import br.com.donation.model.Inscricao;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class InscricaoRepository extends AbstractRepository {

    public Inscricao save(Inscricao inscricao) {
        return execute(connection -> {
            String checkSql = "SELECT PESSOA_FISICA_USUARIO_id, VAGA_VOLUNTARIO_codigo_vaga FROM INSCRICAO WHERE PESSOA_FISICA_USUARIO_id = ? AND VAGA_VOLUNTARIO_codigo_vaga = ?";
            boolean exists = false;
            try (PreparedStatement psCheck = connection.prepareStatement(checkCheckSql(connection, checkSql))) {
                psCheck.setInt(1, inscricao.getPessoaFisicaUsuarioId());
                psCheck.setInt(2, inscricao.getVagaVoluntarioCodigoVaga());
                try (ResultSet rsCheck = psCheck.executeQuery()) {
                    while (rsCheck.next()) {
                        exists = true;
                    }
                }
            }

            if (exists) {
                String updateSql = "UPDATE INSCRICAO SET VAGA_VOLUNTARIO_CAMPANHA_DOACAO_id = ?, data = ?, status = ? WHERE PESSOA_FISICA_USUARIO_id = ? AND VAGA_VOLUNTARIO_codigo_vaga = ?";
                try (PreparedStatement psUpdate = connection.prepareStatement(updateSql)) {
                    if (inscricao.getVagaVoluntarioCampanhaDoacaoId() != null) {
                        psUpdate.setInt(1, inscricao.getVagaVoluntarioCampanhaDoacaoId());
                    } else {
                        psUpdate.setNull(1, Types.INTEGER);
                    }
                    psUpdate.setDate(2, inscricao.getData() != null ? Date.valueOf(inscricao.getData()) : null);
                    psUpdate.setString(3, inscricao.getStatus());
                    psUpdate.setInt(4, inscricao.getPessoaFisicaUsuarioId());
                    psUpdate.setInt(5, inscricao.getVagaVoluntarioCodigoVaga());
                    psUpdate.executeUpdate();
                }
            } else {
                String insertSql = "INSERT INTO INSCRICAO (PESSOA_FISICA_USUARIO_id, VAGA_VOLUNTARIO_codigo_vaga, VAGA_VOLUNTARIO_CAMPANHA_DOACAO_id, data, status) VALUES (?, ?, ?, ?, ?)";
                try (PreparedStatement psInsert = connection.prepareStatement(insertSql)) {
                    psInsert.setInt(1, inscricao.getPessoaFisicaUsuarioId());
                    psInsert.setInt(2, inscricao.getVagaVoluntarioCodigoVaga());
                    if (inscricao.getVagaVoluntarioCampanhaDoacaoId() != null) {
                        psInsert.setInt(3, inscricao.getVagaVoluntarioCampanhaDoacaoId());
                    } else {
                        psInsert.setNull(3, Types.INTEGER);
                    }
                    psInsert.setDate(4, inscricao.getData() != null ? Date.valueOf(inscricao.getData()) : null);
                    psInsert.setString(5, inscricao.getStatus());
                    psInsert.executeUpdate();
                }
            }
            return inscricao;
        });
    }

    private String checkCheckSql(java.sql.Connection conn, String defaultSql) {
        return defaultSql;
    }

    public Optional<Inscricao> findById(Integer pessoaFisicaUsuarioId, Integer vagaVoluntarioCodigoVaga) {
        return execute(connection -> {
            String sql = "SELECT PESSOA_FISICA_USUARIO_id, VAGA_VOLUNTARIO_codigo_vaga, VAGA_VOLUNTARIO_CAMPANHA_DOACAO_id, data, status FROM INSCRICAO WHERE PESSOA_FISICA_USUARIO_id = ? AND VAGA_VOLUNTARIO_codigo_vaga = ?";
            Inscricao inscricao = null;
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, pessoaFisicaUsuarioId);
                ps.setInt(2, vagaVoluntarioCodigoVaga);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        inscricao = mapRow(rs);
                    }
                }
            }
            return Optional.ofNullable(inscricao);
        });
    }

    public List<Inscricao> findAll() {
        return execute(connection -> {
            String sql = "SELECT PESSOA_FISICA_USUARIO_id, VAGA_VOLUNTARIO_codigo_vaga, VAGA_VOLUNTARIO_CAMPANHA_DOACAO_id, data, status FROM INSCRICAO";
            List<Inscricao> inscricoes = new ArrayList<>();
            try (PreparedStatement ps = connection.prepareStatement(sql);
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    inscricoes.add(mapRow(rs));
                }
            }
            return inscricoes;
        });
    }

    public void deleteById(Integer pessoaFisicaUsuarioId, Integer vagaVoluntarioCodigoVaga) {
        executeWithoutResult(connection -> {
            String sql = "DELETE FROM INSCRICAO WHERE PESSOA_FISICA_USUARIO_id = ? AND VAGA_VOLUNTARIO_codigo_vaga = ?";
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, pessoaFisicaUsuarioId);
                ps.setInt(2, vagaVoluntarioCodigoVaga);
                ps.executeUpdate();
            }
        });
    }

    private Inscricao mapRow(ResultSet rs) throws SQLException {
        Inscricao inscricao = new Inscricao();
        inscricao.setPessoaFisicaUsuarioId(rs.getInt("PESSOA_FISICA_USUARIO_id"));
        inscricao.setVagaVoluntarioCodigoVaga(rs.getInt("VAGA_VOLUNTARIO_codigo_vaga"));
        int campanhaId = rs.getInt("VAGA_VOLUNTARIO_CAMPANHA_DOACAO_id");
        if (!rs.wasNull()) {
            inscricao.setVagaVoluntarioCampanhaDoacaoId(campanhaId);
        }
        Date date = rs.getDate("data");
        if (date != null) {
            inscricao.setData(date.toLocalDate());
        }
        inscricao.setStatus(rs.getString("status"));
        return inscricao;
    }
}
