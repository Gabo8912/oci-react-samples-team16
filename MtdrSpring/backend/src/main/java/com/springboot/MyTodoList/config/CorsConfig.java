package com.springboot.MyTodoList.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {
    Logger logger = LoggerFactory.getLogger(CorsConfig.class);

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // ✅ Solo define una vez los orígenes permitidos
        config.setAllowedOrigins(List.of(
            "http://localhost:8080",
            "http://localhost:3000",
            "https://objectstorage.us-phoenix-1.oraclecloud.com",
            "https://petstore.swagger.io"
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "OPTIONS", "DELETE", "PATCH"));
        config.addAllowedHeader("*");

        // ✅ Permite cookies si es necesario
        config.setAllowCredentials(true);

        // ✅ Exponer cabeceras si se necesitan
        config.addExposedHeader("location");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
