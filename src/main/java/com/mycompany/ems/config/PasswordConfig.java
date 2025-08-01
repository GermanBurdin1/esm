package com.mycompany.ems.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Конфигурация для кодирования паролей
 * Используется для безопасного хранения паролей пользователей
 */
@Configuration
public class PasswordConfig {

    /**
     * Bean для кодирования паролей
     * Использует BCrypt алгоритм для хеширования паролей
     * 
     * @return PasswordEncoder instance
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // Force 12 pour la sécurité bien
    }
}