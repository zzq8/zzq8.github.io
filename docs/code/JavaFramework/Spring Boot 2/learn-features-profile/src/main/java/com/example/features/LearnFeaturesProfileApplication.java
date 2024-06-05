package com.example.features;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;

import java.util.Map;

@SpringBootApplication
public class LearnFeaturesProfileApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext run = SpringApplication.run(LearnFeaturesProfileApplication.class, args);

        ConfigurableEnvironment environment = run.getEnvironment();

        Map<String, Object> systemEnvironment = environment.getSystemEnvironment();
        Map<String, Object> systemProperties = environment.getSystemProperties();

        systemEnvironment.forEach((key,val) -> System.out.println(key + "-" + val + "\t"));
        System.out.println("--------------------------");
        systemProperties.forEach((key,val) -> System.out.println(key + "-" + val + "\t"));
    }

}
