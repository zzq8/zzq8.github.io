package com.example.web;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class LearnWebSpringboot2Application implements CommandLineRunner {

    public static void main(String[] args) {
        ConfigurableApplicationContext run = SpringApplication.run(LearnWebSpringboot2Application.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        //这个接口可以在springboot启动时候做一点事
    }
}
