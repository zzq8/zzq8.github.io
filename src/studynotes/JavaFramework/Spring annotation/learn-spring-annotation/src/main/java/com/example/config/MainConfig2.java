package com.example.config;

import com.example.bean.Car;
import com.example.bean.Dog;
import com.example.bean.Person;
import com.example.condition.LinuxCondition;
import com.example.condition.WindowsCondition;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MainConfig2 {


    @Bean
    @Conditional(WindowsCondition.class)
    public Person Windows(){
        return new Person("win",23);
    }

    @Conditional(LinuxCondition.class)
    @Bean
    public Person linux(){
        return new Person("lin",24);
    }

//    @Bean(initMethod = "init",destroyMethod = "destroy")
    @Bean
    public Car car(){
        return new Car();
    }

    @Bean
    public Dog dog(){
        return new Dog();
    }
}
