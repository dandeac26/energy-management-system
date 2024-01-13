//package ro.tuc.ds2020.Controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RestController;
//import ro.tuc.ds2020.jwt.JwtUtil;
//import ro.tuc.ds2020.request.AuthRequest;
//import ro.tuc.ds2020.response.JwtResponse;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@RestController
//public class AuthController {
//    private final JwtUtil jwtUtil;
//
//    @Autowired
//    public AuthController(JwtUtil jwtUtil){ this.jwtUtil = jwtUtil;}
//
////    @PostMapping("/authenticate")
////    public JwtResponse createToken(@RequestBody AuthRequest authRequest){
////        System.out.println(authRequest.getUsername());
////        if("user".equals(authRequest.getUsername()) && "password".equals(authRequest.getPassword())){
////            List<String> userRoles = new ArrayList<>();
////            userRoles.add("ROLE_CLIENT");
////            String jwt = jwtUtil.generateToken(authRequest.getUsername(), userRoles);
////            return new JwtResponse(jwt);
////        }
////        throw new RuntimeException("credentials are invalid");
////    }
//}
