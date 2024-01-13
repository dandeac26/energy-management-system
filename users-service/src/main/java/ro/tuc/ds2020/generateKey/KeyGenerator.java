package ro.tuc.ds2020.generateKey;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;

public class KeyGenerator {
    public static void main(String[] args){
        SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        String base64Key = java.util.Base64.getEncoder().encodeToString(key.getEncoded());
        System.out.println("Secret key: " + base64Key);
    }
}
