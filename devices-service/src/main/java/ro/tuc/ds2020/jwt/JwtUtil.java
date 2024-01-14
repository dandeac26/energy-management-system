package ro.tuc.ds2020.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtUtil {
    @Value("sdjeile2UdUYfdPeNtskjhdh0dLFKtpNWhhusRP5sy6E=")
    private String secretKey;

    public Claims extractAllClaims(String token) throws SignatureException {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
    }

    public String extractUsername(String token) { return extractAllClaims(token).getSubject();}

    public List<SimpleGrantedAuthority> extractAuthorities(String token){
        Claims claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
        List<String> roles = claims.get("roles", List.class);
        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    public Boolean validateToken(String token){
        try{
            extractAllClaims(token);
            System.out.println("Token validated!\n");
            return true;
        }catch(SignatureException ex){
//            System.out.println("Token NOT validated!\n");
        }
        System.out.println("\nVALIDATION FAILED!!!\n");
        return false;
    }
}
