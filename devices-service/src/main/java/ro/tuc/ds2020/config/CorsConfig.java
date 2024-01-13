//package ro.tuc.ds2020.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//import org.springframework.web.filter.CorsFilter;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//@CrossOrigin(origins = "http://localhost:3003")
//public class CorsConfig implements WebMvcConfigurer {
//
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//                .allowedOrigins("http://localhost:3003")
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                .allowedHeaders("*")
//                .allowCredentials(true);
//    }
////    @Bean
////    public CorsFilter corsFilter() {
////        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
////        CorsConfiguration config = new CorsConfiguration();
////        config.setAllowCredentials(true);
////        config.addAllowedOrigin("http://localhost:3003"); // Allow your frontend origin here
////        config.addAllowedHeader("*");
////        config.addAllowedMethod("*");
////        source.registerCorsConfiguration("/**", config);
////        return new CorsFilter(source);
////    }
////    @Bean
////    public CorsConfigurationSource corsConfigurationSource() {
////        CorsConfiguration configuration = new CorsConfiguration();
////        configuration.addAllowedOrigin("http://localhost:3000");
////        configuration.addAllowedOrigin("http://localhost:3003");
////        configuration.addAllowedMethod("*");
////        configuration.addAllowedHeader("*");
////        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
////        source.registerCorsConfiguration("/**", configuration);
////        return source;
////    }
//}
