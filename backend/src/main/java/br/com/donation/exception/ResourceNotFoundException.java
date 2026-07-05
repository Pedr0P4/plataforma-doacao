package br.com.donation.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String recurso, Integer id) {
        super(recurso + " não encontrado(a) com id: " + id);
    }
}
