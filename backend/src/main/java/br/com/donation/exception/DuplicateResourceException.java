package br.com.donation.exception;

public class DuplicateResourceException extends BusinessException {

    public DuplicateResourceException(String message) {
        super(message);
    }

    public DuplicateResourceException(String recurso, String campo, String valor) {
        super(recurso + " já cadastrado(a) com " + campo + ": " + valor);
    }
}
