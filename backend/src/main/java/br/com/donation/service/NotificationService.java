package br.com.donation.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NotificationService {

    private final Map<Integer, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter criarConexao(Integer userId) {
        // Timeout de 1 hora
        SseEmitter emitter = new SseEmitter(3600000L);
        emitters.put(userId, emitter);

        emitter.onCompletion(() -> emitters.remove(userId));
        emitter.onTimeout(() -> emitters.remove(userId));
        emitter.onError(e -> emitters.remove(userId));

        // Envia mensagem inicial de conexão estabelecida
        try {
            emitter.send(SseEmitter.event().name("conectado").data("Conexão SSE estabelecida com sucesso"));
        } catch (IOException e) {
            emitters.remove(userId);
        }

        return emitter;
    }

    public void notificarUsuario(Integer userId, String evento, Object dados) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name(evento).data(dados));
            } catch (IOException e) {
                emitters.remove(userId);
            }
        }
    }
}
