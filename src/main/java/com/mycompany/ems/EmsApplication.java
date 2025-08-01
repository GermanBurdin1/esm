package com.mycompany.ems;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.mycompany.ems.task.entity")
@EnableJpaRepositories("com.mycompany.ems.task.repository")
@ComponentScan(basePackages = {
    "com.mycompany.ems.task",
    "com.mycompany.ems.common"
})
public class EmsApplication {
    public static void main(String[] args) {
        SpringApplication.run(EmsApplication.class, args);
    }
}
