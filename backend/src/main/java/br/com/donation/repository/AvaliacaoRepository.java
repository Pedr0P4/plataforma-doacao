package br.com.donation.repository;

import br.com.donation.model.Avaliacao;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class AvaliacaoRepository extends AbstractRepository {

    public Avaliacao save(Avaliacao avaliacao) {
        if (avaliacao.getId() == null) {
            return insert(avaliacao);
        } else {
            return update(avaliacao);
        }
    }

    private Avaliacao insert(Avaliacao avaliacao) {
        return execute(connection -> {
            String sql = "INSERT INTO AVALIACAO (data_avaliacao, comentario, nota, papel_avaliador, DOACAO_id) VALUES (?, ?, ?, ?, ?)";
            try (PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                ps.setDate(1, avaliacao.getDataAvaliacao() != null ? Date.valueOf(avaliacao.getDataAvaliacao()) : null);
                ps.setString(2, avaliacao.getComentario());
                ps.setInt(3, avaliacao.getNota());
                ps.setString(4, avaliacao.getPapelAvaliador());
                ps.setInt(5, avaliacao.getDoacaoId());
                
                ps.executeUpdate();
                
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    while (rs.next()) {
                        avaliacao.setId(rs.getInt(1));
                    }
                }
            }
            return avaliacao;
        });
    }

    private Avaliacao update(Avaliacao avaliacao) {
        return execute(connection -> {
            String sql = "UPDATE AVALIACAO SET data_avaliacao = ?, comentario = ?, nota = ?, papel_avaliador = ?, DOACAO_id = ? WHERE id = ?";
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setDate(1, avaliacao.getDataAvaliacao() != null ? Date.valueOf(avaliacao.getDataAvaliacao()) : null);
                ps.setString(2, avaliacao.getComentario());
                ps.setInt(3, avaliacao.getNota());
                ps.setString(4, avaliacao.getPapelAvaliador());
                ps.setInt(5, avaliacao.getDoacaoId());
                ps.setInt(6, avaliacao.getId());
                
                ps.executeUpdate();
            }
            return avaliacao;
        });
    }

    public Optional<Avaliacao> findById(Integer id) {
        return execute(connection -> {
            String sql = "SELECT id, data_avaliacao, comentario, nota, papel_avaliador, DOACAO_id FROM AVALIACAO WHERE id = ?";
            Avaliacao avaliacao = null;
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, id);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        avaliacao = mapRow(rs);
                    }
                }
            }
            return Optional.ofNullable(avaliacao);
        });
    }

    public List<Avaliacao> findAll() {
        return execute(connection -> {
            String sql = "SELECT id, data_avaliacao, comentario, nota, papel_avaliador, DOACAO_id FROM AVALIACAO";
            List<Avaliacao> avaliacoes = new ArrayList<>();
            try (PreparedStatement ps = connection.prepareStatement(sql);
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    avaliacoes.add(mapRow(rs));
                }
            }
            return avaliacoes;
        });
    }

    public void deleteById(Integer id) {
        executeWithoutResult(connection -> {
            String sql = "DELETE FROM AVALIACAO WHERE id = ?";
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, id);
                ps.executeUpdate();
            }
        });
    }

    private Avaliacao mapRow(ResultSet rs) throws SQLException {
        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setId(rs.getInt("id"));
        Date date = rs.getDate("data_avaliacao");
        if (date != null) {
            avaliacao.setDataAvaliacao(date.toLocalDate());
        }
        avaliacao.setComentario(rs.getString("comentario"));
        avaliacao.setNota(rs.getInt("nota"));
        avaliacao.setPapelAvaliador(rs.getString("papel_avaliador"));
        avaliacao.setDoacaoId(rs.getInt("DOACAO_id"));
        return avaliacao;
    }

    public List<Avaliacao> findByDoacaoId(Integer doacaoId) {
        return execute(connection -> {
            String sql = "SELECT id, data_avaliacao, comentario, nota, papel_avaliador, DOACAO_id FROM AVALIACAO WHERE DOACAO_id = ?";
            List<Avaliacao> avaliacoes = new ArrayList<>();
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, doacaoId);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        avaliacoes.add(mapRow(rs));
                    }
                }
            }
            return avaliacoes;
        });
    }
}
