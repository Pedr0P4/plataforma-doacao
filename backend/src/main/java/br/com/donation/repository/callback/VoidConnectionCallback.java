package br.com.donation.repository.callback;

import java.sql.Connection;
import java.sql.SQLException;

@FunctionalInterface
public interface VoidConnectionCallback {

    void doInConnection(Connection connection) throws SQLException;
}
