package com.example.learnhellotest.config;

import com.zzq.hello.service.HelloService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author zzq
 * @date 2022/1/3 11:55
 *
 * 我们可以自己写
 */
@Configuration
public class MyConfig {


    /**
     * 这样就把原先那个替换掉了，我们自己写的生效
     * @ConditionalOnMissingBean
     */
    @Bean
    public HelloService helloService(){
        HelloService helloService = new HelloService();
//        helloService.setxxxxx

        return helloService;
    }
}
