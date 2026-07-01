package br.com.donation.repository;

import br.com.donation.model.VagaVoluntario;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class VagaVoluntarioRepository extends AbstractRepository {

    public VagaVoluntario save(VagaVoluntario vaga) {
        return execute(connection -> {
            String checkSql = "SELECT CAMPANHA_DOACAO_id, codigo_vaga FROM VAGA_VOLUNTARIO WHERE CAMPANHA_DOACAO_id = ? AND codigo_vaga = ?";
            boolean exists = false;
            try (PreparedStatement psCheck = connection.prepareStatement(checkSql)) {
                psCheck.setInt(1, vaga.getCampanhaDoacaoId());
                psCheck.setInt(2, vaga.getCodigoVaga());
                try (ResultSet rsCheck = psCheck.executeQuery()) {
                    while (rsCheck.next()) {
                        exists = true;
                    }
                }
            }

            if (exists) {
                String updateSql = "UPDATE VAGA_VOLUNTARIO SET data_inicio = ?, data_fim = ?, quantidade_vagas = ?, descricao_atividades = ?, carga_horaria_semanal = ?, funcao = ? WHERE CAMPANHA_DOACAO_id = ? AND codigo_vaga = ?";
                try (PreparedStatement psUpdate = connection.prepareStatement(updateSql)) {
                    psUpdate.setDate(1, vaga.getDataInicio() != null ? Date.valueOf(vaga.getDataInicio()) : null);
                    psUpdate.setDate(2, vaga.getDataFim() != null ? Date.valueOf(vaga.getDataFim()) : null);
                    psUpdate.setInt(3, vaga.getQuantidadeVagas());
                    psUpdate.setString(4, vaga.getDescricaoAtividades());
                    psUpdate.setInt(5, vaga.getCargaHorariaSemanal());
                    psUpdate.setString(6, vaga.getFuncao());
                    psUpdate.setInt(7, vaga.getCampanhaDoacaoId());
                    psUpdate.setInt(8, vaga.getCodigoVaga());
                    psUpdate.executeUpdate();
                }
            } else {
                String insertSql = "INSERT INTO VAGA_VOLUNTARIO (CAMPANHA_DOACAO_id, codigo_vaga, data_inicio, data_fim, quantidade_vagas, descricao_atividades, carga_horaria_semanal, funcao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                try (PreparedStatement psInsert = connection.prepareStatement(insertSql)) {
                    psInsert.setInt(1, vaga.getCampanhaDoacaoId());
                    psInsert.setInt(2, vaga.getCodigoVaga());
                    psInsert.setDate(3, vaga.getDataInicio() != null ? Date.valueOf(vaga.getDataInicio()) : null);
                    psInsert.setDate(4, vaga.getDataFim() != null ? Date.valueOf(vaga.getDataFim()) : null);
                    psInsert.setInt(5, vaga.getQuantidadeVagas());
                    psInsert.setString(6, vaga.getDescricaoAtividades());
                    psInsert.setInt(7, vaga.getCargaHorariaSemanal());
                    psInsert.setString(8, vaga.getFuncao());
                    psInsert.executeUpdate();
                }
            }
            return vaga;
        });
    }

    public Optional<VagaVoluntario> findById(Integer campanhaDoacaoId, Integer codigoVaga) {
        return execute(connection -> {
            String sql = "SELECT CAMPANHA_DOACAO_id, codigo_vaga, data_inicio, data_fim, quantidade_vagas, descricao_atividades, carga_horaria_semanal, funcao FROM VAGA_VOLUNTARIO WHERE CAMPANHA_DOACAO_id = ? AND codigo_vaga = ?";
            VagaVoluntario vaga = null;
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, campanhaDoacaoId);
                ps.setInt(2, codigoVaga);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        vaga = mapRow(rs);
                    }
                }
            }
            return Optional.ofNullable(vaga);
        });
    }

    public List<VagaVoluntario> findAll() {
        return execute(connection -> {
            String sql = "SELECT CAMPANHA_DOACAO_id, codigo_vaga, data_inicio, data_fim, quantidade_vagas, descricao_atividades, carga_horaria_semanal, funcao FROM VAGA_VOLUNTARIO";
            List<VagaVoluntario> vagas = new ArrayList<>();
            try (PreparedStatement ps = connection.prepareStatement(sql);
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    vagas.add(mapRow(rs));
                }
            }
            return vagas;
        });
    }

    public void deleteById(Integer campanhaDoacaoId, Integer codigoVaga) {
        executeWithoutResult(connection -> {
            String sql = "DELETE FROM VAGA_VOLUNTARIO WHERE CAMPANHA_DOACAO_id = ? AND codigo_vaga = ?";
            try (PreparedStatement ps = connection.prepareStatement(sql)) {
                ps.setInt(1, campanhaDoacaoId);
                ps.setInt(2, codigoVaga);
                ps.executeUpdate();
            }
        });
    }

    private VagaVoluntario mapRow(ResultSet rs) throws SQLException {
        VagaVoluntario vaga = new VagaVoluntario();
        vaga.setCampanhaDoacaoId(rs.getInt("CAMPANHA_DOACAO_id"));
        vaga.setCodigoVaga(rs.getInt("codigo_vaga"));
        Date dataInicio = rs.getDate("data_inicio");
        if (dataInicio != null) {
            vaga.setDataInicio(dataInicio.toLocalDate());
        }
        Date dataFim = rs.getDate("data_fim");
        if (dataFim != null) {
            vaga.setDataFim(dataFim.toLocalDate());
        }
        vaga.setQuantidadeVagas(rs.getInt("quantidade_vagas"));
        vaga.setDescricaoAtividades(rs.getString("descricao_atividades"));
        vaga.setCargaHorariaSemanal(rs.getInt("carga_horaria_semanal"));
        vaga.setFuncao(rs.getString("funcao"));
        return vaga;
    }
}
