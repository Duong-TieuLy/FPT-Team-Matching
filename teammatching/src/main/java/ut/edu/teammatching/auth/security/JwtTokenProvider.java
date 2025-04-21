package ut.edu.teammatching.auth.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;  // Use @Value to inject the secret key from configuration

    // Method to validate token
    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            // Token expired
            System.out.println("Token expired");
        } catch (SignatureException e) {
            // Invalid signature
            System.out.println("Invalid signature");
        } catch (Exception e) {
            // Other exceptions
            System.out.println("Invalid token");
        }
        return false;
    }

    // Method to extract userId from token (subject)
    public String getUserIdFromToken(String token) {
        Claims claims = getClaims(token);
        return claims.getSubject();  // Subject is typically the userId
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey.getBytes(StandardCharsets.UTF_8))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
