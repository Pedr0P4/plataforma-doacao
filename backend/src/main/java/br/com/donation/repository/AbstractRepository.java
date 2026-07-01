package br.com.donation.repository;

import br.com.donation.exception.DatabaseException;
import br.com.donation.repository.callback.ConnectionCallback;
import br.com.donation.repository.callback.VoidConnectionCallback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Repository
public abstract class AbstractRepository {

    @Autowired
    protected DataSource dataSource;

    public AbstractRepository() {
    }

    public AbstractRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    protected <T> T execute(ConnectionCallback<T> action) {
        try (Connection connection = dataSource.getConnection()) {
            return action.doInConnection(connection);
        } catch (SQLException e) {
            throw new DatabaseException("Erro ao executar operação JDBC no banco de dados", e);
        }
    }

    protected void executeWithoutResult(VoidConnectionCallback action) {
        try (Connection connection = dataSource.getConnection()) {
            action.doInConnection(connection);
        } catch (SQLException e) {
            throw new DatabaseException("Erro ao executar operação JDBC no banco de dados", e);
        }
    }

    protected void executeInTransaction(VoidConnectionCallback action) {
        Connection connection = null;
        try {
            connection = dataSource.getConnection();
            connection.setAutoCommit(false);
            
            action.doInConnection(connection);
            
            connection.commit();
        } catch (SQLException e) {
            if (connection != null) {
                try {
                    connection.rollback();
                } catch (SQLException ex) {
                    e.addSuppressed(ex);
                }
            }
            throw new DatabaseException("Erro na transação JDBC; rollback realizado com sucesso", e);
        } finally {
            if (connection != null) {
                try {
                    connection.setAutoCommit(true);
                    connection.close();
                } catch (SQLException e) {
                }
            }
        }
    }
}
