package br.com.donation.repository;

import br.com.donation.model.PessoaFisica;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class PessoaFisicaRepository extends AbstractRepository {

    public PessoaFisica save(PessoaFisica pessoaFisica) {
        return execute(connection -> {
            String checkSql = "SELECT USUARIO_id FROM PESSOA_FISICA WHERE USUARIO_id = ?";
            boolean exists = false;
            try (PreparedStatement psCheck = connection.prepareStatement(checkSql)) {
                psCheck.setInt(1, pessoaFisica.getUsuarioId());
                try (ResultSet rsCheck = psCheck.executeQuery()) {
                    while (rsCheck.next()) {
                        exists = true;
                    }
                }
            }

            if (exists) {
                String updateSql = "UPDATE PESSOA_FISICA SET CPF = ?, data_nascimento = ? WHERE USUARIO_id = ?";
                try (PreparedStatement psUpdate = connection.prepareStatement(updateSql)) {
                    psUpdate.setString(1, pessoaFisica.getCpf());
                    psUpdate.setDate(2, pessoaFisica.getDataNascimento() != null ? Date.valueOf(pessoaFisica.getDataNascimento()) : null);
                    psUpdate.setInt(3, pessoaFisica.getUsuarioId());
                    psUpdate.executeUpdate();
                }
            } else {
                String insertSql = "INSERT INTO PESSOA_FISICA (USUARIO_id, CPF, data_nascimento) VALUES (?, ?, ?)";
                try (PreparedStatement psInsert = connection.prepareStatement(insertSql)) {
                    psInsert.setInt(1, pessoaFisica.getUsuarioId());
                    psInsert.setString(2, pessoaFisica.getCpf());
                    psInsert.setDate(3, pessoaFisica.getDataNascimento() != null ? Date.valueOf(pessoaFisica.getDataNascimento()) : null);
                    psInsert.executeUpdate();
                }
            }
            return pessoaFisica;
        });
    }

    public Optional<PessoaFisica> findById(Integer usuarioId) {
        return execute(connection -> {
            String sql = "SELECT USUARIO_id, CPF, data_nascimento FROM PESSOA_FISICA WHERE USUARIO_id = ?";
            PessoaFisica pessoaFisica = null;
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, usuarioId);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        pessoaFisica = mapRow(rs);
                    }
                }
            }
            return Optional.ofNullable(pessoaFisica);
        });
    }

    public List<PessoaFisica> findAll() {
        return execute(connection -> {
            String sql = "SELECT USUARIO_id, CPF, data_nascimento FROM PESSOA_FISICA";
            List<PessoaFisica> pessoas = new ArrayList<>();
            try (PreparedStatement ps = connection.prepareStatement(sql);
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    pessoas.add(mapRow(rs));
                }
            }
            return pessoas;
        });
    }

    public void deleteById(Integer usuarioId) {
        executeWithoutResult(connection -> {
            String sql = "DELETE FROM PESSOA_FISICA WHERE USUARIO_id = ?";
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, usuarioId);
                ps.executeUpdate();
            }
        });
    }

    private PessoaFisica mapRow(ResultSet rs) throws SQLException {
        PessoaFisica pessoaFisica = new PessoaFisica();
        pessoaFisica.setUsuarioId(rs.getInt("USUARIO_id"));
        pessoaFisica.setCpf(rs.getString("CPF"));
        Date date = rs.getDate("data_nascimento");
        if (date != null) {
            pessoaFisica.setDataNascimento(date.toLocalDate());
        }
        return pessoaFisica;
    }
}
