package com.zzq.springcloud;

import com.zzq.myrule.MySelfRule;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.ribbon.RibbonClient;

@SpringBootApplication
/**
 * 可以知道@Value和@ConfigurationProperties都可以用于获取配置文件的属性值，不过有个细节容易被忽略，
 * 那就是， 这两个注解在Springboot项目中都是获取默认配置文件的属性值，也就是application.yml或者application.properties的属性值
 */
//@PropertySource("classpath:application.yaml")      应该SpringBoot 自动把application装配了
@EnableEurekaClient//<--- 添加该标签
//添加到此处
@RibbonClient(name = "cloud-payment-service", configuration = MySelfRule.class)
public class OrderMain80 {
    public static void main(String[] args) {
        SpringApplication.run(OrderMain80.class,args);
    }
}

