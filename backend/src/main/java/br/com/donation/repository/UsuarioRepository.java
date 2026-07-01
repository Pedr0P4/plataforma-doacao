package br.com.donation.repository;

import br.com.donation.model.Usuario;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class UsuarioRepository extends AbstractRepository {

    public Usuario save(Usuario usuario) {
        if (usuario.getId() == null) {
            return insert(usuario);
        } else {
            return update(usuario);
        }
    }

    private Usuario insert(Usuario usuario) {
        return execute(connection -> {
            String sql = "INSERT INTO USUARIO (nome, email, logradouro, bairro, numero, CEP) VALUES (?, ?, ?, ?, ?, ?)";
            try (PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                ps.setString(1, usuario.getNome());
                ps.setString(2, usuario.getEmail());
                ps.setString(3, usuario.getLogradouro());
                ps.setString(4, usuario.getBairro());
                ps.setString(5, usuario.getNumero());
                ps.setString(6, usuario.getCep());
                
                ps.executeUpdate();
                
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    while (rs.next()) {
                        usuario.setId(rs.getInt(1));
                    }
                }
            }
            return usuario;
        });
    }

    private Usuario update(Usuario usuario) {
        return execute(connection -> {
            String sql = "UPDATE USUARIO SET nome = ?, email = ?, logradouro = ?, bairro = ?, numero = ?, CEP = ? WHERE id = ?";
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setString(1, usuario.getNome());
                ps.setString(2, usuario.getEmail());
                ps.setString(3, usuario.getLogradouro());
                ps.setString(4, usuario.getBairro());
                ps.setString(5, usuario.getNumero());
                ps.setString(6, usuario.getCep());
                ps.setInt(7, usuario.getId());
                
                ps.executeUpdate();
            }
            return usuario;
        });
    }

    public Optional<Usuario> findById(Integer id) {
        return execute(connection -> {
            String sql = "SELECT id, nome, email, logradouro, bairro, numero, CEP FROM USUARIO WHERE id = ?";
            Usuario usuario = null;
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, id);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        usuario = mapRow(rs);
                    }
                }
            }
            return Optional.ofNullable(usuario);
        });
    }

    public List<Usuario> findAll() {
        return execute(connection -> {
            String sql = "SELECT id, nome, email, logradouro, bairro, numero, CEP FROM USUARIO";
            List<Usuario> usuarios = new ArrayList<>();
            try (PreparedStatement ps = connection.prepareStatement(sql);
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    usuarios.add(mapRow(rs));
                }
            }
            return usuarios;
        });
    }

    public void deleteById(Integer id) {
        executeWithoutResult(connection -> {
            String sql = "DELETE FROM USUARIO WHERE id = ?";
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, id);
                ps.executeUpdate();
            }
        });
    }

    private Usuario mapRow(ResultSet rs) throws SQLException {
        Usuario usuario = new Usuario();
        usuario.setId(rs.getInt("id"));
        usuario.setNome(rs.getString("nome"));
        usuario.setEmail(rs.getString("email"));
        usuario.setLogradouro(rs.getString("logradouro"));
        usuario.setBairro(rs.getString("bairro"));
        usuario.setNumero(rs.getString("numero"));
        usuario.setCep(rs.getString("CEP"));
        return usuario;
    }
}
