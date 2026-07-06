package br.com.donation.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public long getExpiration() {
        return expiration;
    }

    public String gerarToken(Integer userId, String email, String tipo) {
        return Jwts.builder()
                .subject(userId.toString())
                .claim("email", email)
                .claim("tipo", tipo)
                .claim("purpose", "ACCESS")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public String gerarTokenResetSenha(Integer userId, String email) {
        long resetExpiration = 15 * 60 * 1000L; // 15 minutos
        return Jwts.builder()
                .subject(userId.toString())
                .claim("email", email)
                .claim("purpose", "RESET_PASSWORD")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + resetExpiration))
                .signWith(getSigningKey())
                .compact();
    }

    public Claims extrairClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenValido(String token) {
        try {
            Claims claims = extrairClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isTokenAcessoValido(String token) {
        if (!isTokenValido(token)) return false;
        String purpose = extrairPurpose(token);
        return purpose == null || "ACCESS".equals(purpose);
    }

    public boolean isTokenResetValido(String token) {
        if (!isTokenValido(token)) return false;
        return "RESET_PASSWORD".equals(extrairPurpose(token));
    }

    public Integer extrairUserId(String token) {
        return Integer.valueOf(extrairClaims(token).getSubject());
    }

    public String extrairEmail(String token) {
        return extrairClaims(token).get("email", String.class);
    }

    public String extrairTipo(String token) {
        return extrairClaims(token).get("tipo", String.class);
    }

    public String extrairPurpose(String token) {
        try {
            return extrairClaims(token).get("purpose", String.class);
        } catch (Exception e) {
            return null;
        }
    }
}
