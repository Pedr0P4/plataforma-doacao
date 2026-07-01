package br.com.donation.repository;

import br.com.donation.model.LocalDoacao;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class LocalDoacaoRepository extends AbstractRepository {

    public LocalDoacao save(LocalDoacao localDoacao) {
        if (localDoacao.getId() == null) {
            return insert(localDoacao);
        } else {
            return update(localDoacao);
        }
    }

    private LocalDoacao insert(LocalDoacao localDoacao) {
        return execute(connection -> {
            String sql = "INSERT INTO LOCAL_DOACAO (nome, logradouro, bairro, numero, CEP) VALUES (?, ?, ?, ?, ?)";
            try (PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                ps.setString(1, localDoacao.getNome());
                ps.setString(2, localDoacao.getLogradouro());
                ps.setString(3, localDoacao.getBairro());
                ps.setString(4, localDoacao.getNumero());
                ps.setString(5, localDoacao.getCep());
                
                ps.executeUpdate();
                
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    while (rs.next()) {
                        localDoacao.setId(rs.getInt(1));
                    }
                }
            }
            return localDoacao;
        });
    }

    private LocalDoacao update(LocalDoacao localDoacao) {
        return execute(connection -> {
            String sql = "UPDATE LOCAL_DOACAO SET nome = ?, logradouro = ?, bairro = ?, numero = ?, CEP = ? WHERE id = ?";
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setString(1, localDoacao.getNome());
                ps.setString(2, localDoacao.getLogradouro());
                ps.setString(3, localDoacao.getBairro());
                ps.setString(4, localDoacao.getNumero());
                ps.setString(5, localDoacao.getCep());
                ps.setInt(6, localDoacao.getId());
                
                ps.executeUpdate();
            }
            return localDoacao;
        });
    }

    public Optional<LocalDoacao> findById(Integer id) {
        return execute(connection -> {
            String sql = "SELECT id, nome, logradouro, bairro, numero, CEP FROM LOCAL_DOACAO WHERE id = ?";
            LocalDoacao localDoacao = null;
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, id);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        localDoacao = mapRow(rs);
                    }
                }
            }
            return Optional.ofNullable(localDoacao);
        });
    }

    public List<LocalDoacao> findAll() {
        return execute(connection -> {
            String sql = "SELECT id, nome, logradouro, bairro, numero, CEP FROM LOCAL_DOACAO";
            List<LocalDoacao> locais = new ArrayList<>();
            try (PreparedStatement ps = connection.prepareStatement(sql);
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    locais.add(mapRow(rs));
                }
            }
            return locais;
        });
    }

    public void deleteById(Integer id) {
        executeWithoutResult(connection -> {
            String sql = "DELETE FROM LOCAL_DOACAO WHERE id = ?";
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, id);
                ps.executeUpdate();
            }
        });
    }

    private LocalDoacao mapRow(ResultSet rs) throws SQLException {
        LocalDoacao localDoacao = new LocalDoacao();
        localDoacao.setId(rs.getInt("id"));
        localDoacao.setNome(rs.getString("nome"));
        localDoacao.setLogradouro(rs.getString("logradouro"));
        localDoacao.setBairro(rs.getString("bairro"));
        localDoacao.setNumero(rs.getString("numero"));
        localDoacao.setCep(rs.getString("CEP"));
        return localDoacao;
    }
}
