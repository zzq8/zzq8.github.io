package com.example.learn2;

import com.example.learn2.bean.Person;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
//@EnableConfigurationProperties(Person.class)
public class Learn2CoreSpringboot2Application {

    public static void main(String[] args) {
        SpringApplication.run(Learn2CoreSpringboot2Application.class, args);
    }

}
