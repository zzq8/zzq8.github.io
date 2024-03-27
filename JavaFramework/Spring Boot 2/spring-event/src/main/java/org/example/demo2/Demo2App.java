package org.example.demo2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

/**
 * 好处：
 * 自定义事件 Demo2Event 继承 ApplicotionEvent实现对指定类型事件进行监听
 * 避免监听到 Spring 自带的与业务无关的类
 */
@SpringBootApplication
public class Demo2App implements CommandLineRunner {
    public static void main(String[] args) {
        SpringApplication.run(Demo2App.class, args);
    }

    @Autowired
    ApplicationContext eventPublisher;

    @Override
    public void run(String... args) throws Exception {
        eventPublisher.publishEvent(new Demo2Event(this));
    }
}
