package br.com.donation.repository;

import br.com.donation.model.Doacao;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class DoacaoRepository extends AbstractRepository {

    public Doacao save(Doacao doacao) {
        if (doacao.getId() == null) {
            return insert(doacao);
        } else {
            return update(doacao);
        }
    }

    private Doacao insert(Doacao doacao) {
        return execute(connection -> {
            String sql = "INSERT INTO DOACAO (doador_id, donatario_id, LOCAL_DOACAO_id) VALUES (?, ?, ?)";
            try (PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                setNullableInt(ps, 1, doacao.getDoadorId());
                setNullableInt(ps, 2, doacao.getDonatarioId());
                setNullableInt(ps, 3, doacao.getLocalDoacaoId());
                
                ps.executeUpdate();
                
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    while (rs.next()) {
                        doacao.setId(rs.getInt(1));
                    }
                }
            }
            return doacao;
        });
    }

    private Doacao update(Doacao doacao) {
        return execute(connection -> {
            String sql = "UPDATE DOACAO SET doador_id = ?, donatario_id = ?, LOCAL_DOACAO_id = ? WHERE id = ?";
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                setNullableInt(ps, 1, doacao.getDoadorId());
                setNullableInt(ps, 2, doacao.getDonatarioId());
                setNullableInt(ps, 3, doacao.getLocalDoacaoId());
                ps.setInt(4, doacao.getId());
                
                ps.executeUpdate();
            }
            return doacao;
        });
    }

    public Optional<Doacao> findById(Integer id) {
        return execute(connection -> {
            String sql = "SELECT id, doador_id, donatario_id, LOCAL_DOACAO_id FROM DOACAO WHERE id = ?";
            Doacao doacao = null;
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, id);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        doacao = mapRow(rs);
                    }
                }
            }
            return Optional.ofNullable(doacao);
        });
    }

    public List<Doacao> findAll() {
        return execute(connection -> {
            String sql = "SELECT id, doador_id, donatario_id, LOCAL_DOACAO_id FROM DOACAO";
            List<Doacao> doacoes = new ArrayList<>();
            try (PreparedStatement ps = connection.prepareStatement(sql);
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    doacoes.add(mapRow(rs));
                }
            }
            return doacoes;
        });
    }

    public void deleteById(Integer id) {
        executeWithoutResult(connection -> {
            String sql = "DELETE FROM DOACAO WHERE id = ?";
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, id);
                ps.executeUpdate();
            }
        });
    }

    private void setNullableInt(PreparedStatement ps, int parameterIndex, Integer value) throws SQLException {
        if (value != null) {
            ps.setInt(parameterIndex, value);
        } else {
            ps.setNull(parameterIndex, Types.INTEGER);
        }
    }

    private Doacao mapRow(ResultSet rs) throws SQLException {
        Doacao doacao = new Doacao();
        doacao.setId(rs.getInt("id"));
        int doadorId = rs.getInt("doador_id");
        doacao.setDoadorId(rs.wasNull() ? null : doadorId);
        int donatarioId = rs.getInt("donatario_id");
        doacao.setDonatarioId(rs.wasNull() ? null : donatarioId);
        int localId = rs.getInt("LOCAL_DOACAO_id");
        doacao.setLocalDoacaoId(rs.wasNull() ? null : localId);
        return doacao;
    }

    public List<Doacao> findByDoadorId(Integer doadorId) {
        return execute(connection -> {
            String sql = "SELECT id, doador_id, donatario_id, LOCAL_DOACAO_id FROM DOACAO WHERE doador_id = ?";
            List<Doacao> doacoes = new ArrayList<>();
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, doadorId);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        doacoes.add(mapRow(rs));
                    }
                }
            }
            return doacoes;
        });
    }

    public List<Doacao> findByDonatarioId(Integer donatarioId) {
        return execute(connection -> {
            String sql = "SELECT id, doador_id, donatario_id, LOCAL_DOACAO_id FROM DOACAO WHERE donatario_id = ?";
            List<Doacao> doacoes = new ArrayList<>();
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, donatarioId);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        doacoes.add(mapRow(rs));
                    }
                }
            }
            return doacoes;
        });
    }

    public List<Doacao> findDisponiveis() {
        return execute(connection -> {
            String sql = "SELECT id, doador_id, donatario_id, LOCAL_DOACAO_id FROM DOACAO WHERE donatario_id IS NULL";
            List<Doacao> doacoes = new ArrayList<>();
            try (PreparedStatement ps = connection.prepareStatement(sql);
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    doacoes.add(mapRow(rs));
                }
            }
            return doacoes;
        });
    }
}
