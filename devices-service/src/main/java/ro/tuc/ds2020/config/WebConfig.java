//package ro.tuc.ds2020.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebConfig {
//
////    public void addCorsMappings(CorsRegistry registry) {
////        registry.addMapping("/**")
////                .allowedOrigins("http://localhost:3003")
////                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
////                .allowedHeaders("*")
////                .allowCredentials(true);
////    }
//    @Bean
//    public WebMvcConfigurer corsConfig(){
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
////                WebMvcConfigurer.super.addCorsMappings(registry);
//                registry.addMapping("/**")
//                        .allowedOrigins("http://localhost:3003")
//                        .allowedMethods("/*")
//                        .allowedHeaders("/*");
//            }
//        };
//    }
//}
