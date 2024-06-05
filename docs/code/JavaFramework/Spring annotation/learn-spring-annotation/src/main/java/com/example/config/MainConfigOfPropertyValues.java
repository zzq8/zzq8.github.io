package com.example.config;

import com.example.bean.Person;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

//@PropertySource("classpath:/application.properties")
//取外部配置文件的k/v保存到运行环境中
@PropertySource("classpath:/application.yaml")
@Configuration
public class MainConfigOfPropertyValues {

    @Bean
    public Person person(){
        return new Person();
    }
}
