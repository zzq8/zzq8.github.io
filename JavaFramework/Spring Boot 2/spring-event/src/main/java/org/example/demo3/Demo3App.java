package org.example.demo3;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

/**
 * 1.自定义事件 Demo3Event 添加业务参数
 * 2.忽略事件源根据实际业务情况而定减少参数
 * 3.使用 @EventListener 替换 implements ApplicationListener<Demo2Event>增加监听者的可扩展性
 *      XD: 不需要要整个类实现接口，只需要方法上加上此注解随便放在哪个被Spring管理的类中都行了！！！
 */
@SpringBootApplication
public class Demo3App implements CommandLineRunner {
    public static void main(String[] args) {
        SpringApplication.run(Demo3App.class, args);
    }

    @Autowired
    ApplicationContext eventPublisher;

    @Override
    public void run(String... args) throws Exception {
        /**
         * 发布两个，打印出来就消费两个
         */
        String argument = "xd-01";
        eventPublisher.publishEvent(new Demo3Event(argument));
        eventPublisher.publishEvent(new Demo3Event("xd-002"));
    }
}
