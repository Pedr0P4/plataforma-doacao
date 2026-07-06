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
            String sql = "INSERT INTO DOACAO (doador_id, donatario_id, LOCAL_DOACAO_id, url_imagem) VALUES (?, ?, ?, ?)";
            try (PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                setNullableInt(ps, 1, doacao.getDoadorId());
                setNullableInt(ps, 2, doacao.getDonatarioId());
                setNullableInt(ps, 3, doacao.getLocalDoacaoId());
                ps.setString(4, doacao.getUrlImagem());
                
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
            String sql = "UPDATE DOACAO SET doador_id = ?, donatario_id = ?, LOCAL_DOACAO_id = ?, url_imagem = ? WHERE id = ?";
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                setNullableInt(ps, 1, doacao.getDoadorId());
                setNullableInt(ps, 2, doacao.getDonatarioId());
                setNullableInt(ps, 3, doacao.getLocalDoacaoId());
                ps.setString(4, doacao.getUrlImagem());
                ps.setInt(5, doacao.getId());
                
                ps.executeUpdate();
            }
            return doacao;
        });
    }

    public Optional<Doacao> findById(Integer id) {
        return execute(connection -> {
            String sql = "SELECT id, doador_id, donatario_id, LOCAL_DOACAO_id, url_imagem FROM DOACAO WHERE id = ?";
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
            String sql = "SELECT id, doador_id, donatario_id, LOCAL_DOACAO_id, url_imagem FROM DOACAO";
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
        doacao.setUrlImagem(rs.getString("url_imagem"));
        return doacao;
    }

    public List<Doacao> findByDoadorId(Integer doadorId) {
        return execute(connection -> {
            String sql = "SELECT id, doador_id, donatario_id, LOCAL_DOACAO_id, url_imagem FROM DOACAO WHERE doador_id = ?";
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
            String sql = "SELECT id, doador_id, donatario_id, LOCAL_DOACAO_id, url_imagem FROM DOACAO WHERE donatario_id = ?";
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

    public List<Doacao> findDisponiveis(int page, int size) {
        return findDisponiveis(page, size, null, null);
    }

    public List<Doacao> findDisponiveis(int page, int size, String categoria, String busca) {
        return execute(connection -> {
            StringBuilder sql = new StringBuilder("SELECT DISTINCT d.id, d.doador_id, d.donatario_id, d.LOCAL_DOACAO_id, d.url_imagem FROM DOACAO d LEFT JOIN ITEM i ON i.DOACAO_id = d.id LEFT JOIN USUARIO u ON d.doador_id = u.id WHERE d.donatario_id IS NULL");
            List<Object> params = new ArrayList<>();
            if (categoria != null && !categoria.trim().isEmpty() && !"TODAS".equalsIgnoreCase(categoria)) {
                sql.append(" AND LOWER(i.categoria) = LOWER(?)");
                params.add(categoria.trim());
            }
            if (busca != null && !busca.trim().isEmpty()) {
                sql.append(" AND (LOWER(i.nome) LIKE ? OR LOWER(i.descricao) LIKE ? OR LOWER(u.nome) LIKE ?)");
                String like = "%" + busca.trim().toLowerCase() + "%";
                params.add(like);
                params.add(like);
                params.add(like);
            }
            sql.append(" ORDER BY d.id DESC LIMIT ? OFFSET ?");
            params.add(size);
            params.add(page * size);

            List<Doacao> doacoes = new ArrayList<>();
            try (PreparedStatement ps = connection.prepareStatement(sql.toString())) {
                for (int idx = 0; idx < params.size(); idx++) {
                    Object val = params.get(idx);
                    if (val instanceof Integer) {
                        ps.setInt(idx + 1, (Integer) val);
                    } else {
                        ps.setString(idx + 1, (String) val);
                    }
                }
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        doacoes.add(mapRow(rs));
                    }
                }
            }
            return doacoes;
        });
    }

    public int countDisponiveis() {
        return countDisponiveis(null, null);
    }

    public int countDisponiveis(String categoria, String busca) {
        return execute(connection -> {
            StringBuilder sql = new StringBuilder("SELECT COUNT(DISTINCT d.id) FROM DOACAO d LEFT JOIN ITEM i ON i.DOACAO_id = d.id LEFT JOIN USUARIO u ON d.doador_id = u.id WHERE d.donatario_id IS NULL");
            List<Object> params = new ArrayList<>();
            if (categoria != null && !categoria.trim().isEmpty() && !"TODAS".equalsIgnoreCase(categoria)) {
                sql.append(" AND LOWER(i.categoria) = LOWER(?)");
                params.add(categoria.trim());
            }
            if (busca != null && !busca.trim().isEmpty()) {
                sql.append(" AND (LOWER(i.nome) LIKE ? OR LOWER(i.descricao) LIKE ? OR LOWER(u.nome) LIKE ?)");
                String like = "%" + busca.trim().toLowerCase() + "%";
                params.add(like);
                params.add(like);
                params.add(like);
            }
            try (PreparedStatement ps = connection.prepareStatement(sql.toString())) {
                for (int idx = 0; idx < params.size(); idx++) {
                    ps.setString(idx + 1, (String) params.get(idx));
                }
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        return rs.getInt(1);
                    }
                }
            }
            return 0;
        });
    }
}
