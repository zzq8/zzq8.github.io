package com.example.admin;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

//@ServletComponentScan   //指定原生Servlet组件都放在那里    默认的是这个类及所在包下面所有的
@SpringBootApplication
public class LearnWebAdminSpringboot2Application {

    public static void main(String[] args) {
        SpringApplication.run(LearnWebAdminSpringboot2Application.class, args);
    }

}
