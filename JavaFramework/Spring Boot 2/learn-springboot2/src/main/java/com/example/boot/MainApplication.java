package com.example.boot;

import com.example.boot.bean.Cat;
import com.example.boot.bean.User;
import com.example.boot.config.MyConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ImportResource;

import java.util.Arrays;

/**
 * @author zzq
 * @date 2021/12/24 17:03
 *
 * @SpringBootApplication: 告诉这是个SpringBoot项目
 * 这个主程序及其以下的包都会被自动扫描
 */
@SpringBootApplication
//@ImportResource("classpath:beans.xml") //使用以前spring开发的做法beans.xml
public class MainApplication {

    public static void main(String[] args) {
        //返回一个IOC容器
        ConfigurableApplicationContext run = SpringApplication.run(MainApplication.class, args);

        String[] names = run.getBeanDefinitionNames();
        Arrays.stream(names).forEach(System.out::println);
        //使用getBean("tomXXX", Cat.class)这个构造方法返回的就是Cat类型，如使用getBean("tomXXX")返回Object
        //都是Singleton，那么Spring IoC容器中只会存在一个共享的bean实例
//        System.out.println(run.getBean("tomXXX", Cat.class) == run.getBean("tomXXX", Cat.class));
//        System.out.println(run.getBean("user01", User.class) == run.getBean("user01", User.class));
//
//        System.out.println("---------------------");
//        //com.example.boot.config.MyConfig$$EnhancerBySpringCGLIB$$a63b12fa@60723d6a 代理对象
//        MyConfig bean = run.getBean(MyConfig.class);
//        System.out.println(bean);
//        System.out.println(bean.tomcatPet() == bean.tomcatPet());
        System.out.println("---------------------");
        String[] beanNamesForType = run.getBeanNamesForType(Cat.class);
        for (String s : beanNamesForType) {
            System.out.println(s);
        }

        System.out.println(run.containsBean("user01"));
    }
}
