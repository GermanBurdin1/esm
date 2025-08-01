package com.mycompany.ems.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Конфигурация безопасности для разработки
 * Отключает аутентификацию для всех endpoints чтобы можно было тестировать API
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Конфигурация цепочки фильтров безопасности
     * В режиме разработки разрешает доступ ко всем endpoints
     * 
     * @param http HttpSecurity объект для настройки
     * @return SecurityFilterChain
     * @throws Exception если произошла ошибка конфигурации
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // On désactive CSRF pour les tests d'API
            .csrf(AbstractHttpConfigurer::disable)
            
            // On autorise l'accès à tous les endpoints
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/**").permitAll()           // Tous les endpoints API
                .requestMatchers("/swagger-ui/**").permitAll()    // Swagger UI
                .requestMatchers("/v3/api-docs/**").permitAll()   // OpenAPI docs
                .requestMatchers("/api-docs/**").permitAll()      // API docs
                .anyRequest().permitAll()                         // Tous les autres requests
            )
            
            // On désactive le formulaire de login
            .formLogin(AbstractHttpConfigurer::disable)
            
            // On désactive l'authentification HTTP Basic
            .httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }
}