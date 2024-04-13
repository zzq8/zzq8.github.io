package org.example.demo1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationEvent;

/**
 * 监听到了所有事件：包括Spring的一些内置事件以及Demo1Listener自定义事件
 *      内置事件显然是不想要的和我们业务没多大关系，所以看 demo2
 */
@SpringBootApplication
public class Demo1App implements ApplicationRunner, CommandLineRunner {
    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(Demo1App.class, args);
    }

//    @Autowired
//    ApplicationEventPublisher eventPublisher;

    @Autowired
    ApplicationContext eventPublisher;
    @Override
    public void run(ApplicationArguments args) throws Exception {
//        System.out.println(args.getOptionNames());
        eventPublisher.publishEvent(new ApplicationEvent(this) {});

    }

    @Override
    public void run(String... args) throws Exception {
//        System.out.println(args);
    }
}
