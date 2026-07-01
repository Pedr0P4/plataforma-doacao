package br.com.donation.repository;

import br.com.donation.model.Item;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class ItemRepository extends AbstractRepository {

    public Item save(Item item) {
        return execute(connection -> {
            String checkSql = "SELECT nome, DOACAO_id FROM ITEM WHERE nome = ? AND DOACAO_id = ?";
            boolean exists = false;
            try (PreparedStatement psCheck = connection.prepareStatement(checkSql)) {
                psCheck.setString(1, item.getNome());
                psCheck.setInt(2, item.getDoacaoId());
                try (ResultSet rsCheck = psCheck.executeQuery()) {
                    while (rsCheck.next()) {
                        exists = true;
                    }
                }
            }

            if (exists) {
                String updateSql = "UPDATE ITEM SET quantidade = ?, descricao = ?, motivo = ?, e_novo = ?, categoria = ? WHERE nome = ? AND DOACAO_id = ?";
                try (PreparedStatement psUpdate = connection.prepareStatement(updateSql)) {
                    psUpdate.setInt(1, item.getQuantidade());
                    psUpdate.setString(2, item.getDescricao());
                    psUpdate.setString(3, item.getMotivo());
                    psUpdate.setString(4, item.getENovo());
                    psUpdate.setString(5, item.getCategoria());
                    psUpdate.setString(6, item.getNome());
                    psUpdate.setInt(7, item.getDoacaoId());
                    psUpdate.executeUpdate();
                }
            } else {
                String insertSql = "INSERT INTO ITEM (nome, DOACAO_id, quantidade, descricao, motivo, e_novo, categoria) VALUES (?, ?, ?, ?, ?, ?, ?)";
                try (PreparedStatement psInsert = connection.prepareStatement(insertSql)) {
                    psInsert.setString(1, item.getNome());
                    psInsert.setInt(2, item.getDoacaoId());
                    psInsert.setInt(3, item.getQuantidade());
                    psInsert.setString(4, item.getDescricao());
                    psInsert.setString(5, item.getMotivo());
                    psInsert.setString(6, item.getENovo());
                    psInsert.setString(7, item.getCategoria());
                    psInsert.executeUpdate();
                }
            }
            return item;
        });
    }

    public Optional<Item> findById(String nome, Integer doacaoId) {
        return execute(connection -> {
            String sql = "SELECT nome, DOACAO_id, quantidade, descricao, motivo, e_novo, categoria FROM ITEM WHERE nome = ? AND DOACAO_id = ?";
            Item item = null;
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setString(1, nome);
                ps.setInt(2, doacaoId);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        item = mapRow(rs);
                    }
                }
            }
            return Optional.ofNullable(item);
        });
    }

    public List<Item> findAll() {
        return execute(connection -> {
            String sql = "SELECT nome, DOACAO_id, quantidade, descricao, motivo, e_novo, categoria FROM ITEM";
            List<Item> itens = new ArrayList<>();
            try (PreparedStatement ps = connection.prepareStatement(sql);
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    itens.add(mapRow(rs));
                }
            }
            return itens;
        });
    }

    public List<Item> findByDoacaoId(Integer doacaoId) {
        return execute(connection -> {
            String sql = "SELECT nome, DOACAO_id, quantidade, descricao, motivo, e_novo, categoria FROM ITEM WHERE DOACAO_id = ?";
            List<Item> itens = new ArrayList<>();
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, doacaoId);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        itens.add(mapRow(rs));
                    }
                }
            }
            return itens;
        });
    }

    public void deleteById(String nome, Integer doacaoId) {
        executeWithoutResult(connection -> {
            String sql = "DELETE FROM ITEM WHERE nome = ? AND DOACAO_id = ?";
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setString(1, nome);
                ps.setInt(2, doacaoId);
                ps.executeUpdate();
            }
        });
    }

    private Item mapRow(ResultSet rs) throws SQLException {
        Item item = new Item();
        item.setNome(rs.getString("nome"));
        item.setDoacaoId(rs.getInt("DOACAO_id"));
        item.setQuantidade(rs.getInt("quantidade"));
        item.setDescricao(rs.getString("descricao"));
        item.setMotivo(rs.getString("motivo"));
        item.setENovo(rs.getString("e_novo"));
        item.setCategoria(rs.getString("categoria"));
        return item;
    }
}
