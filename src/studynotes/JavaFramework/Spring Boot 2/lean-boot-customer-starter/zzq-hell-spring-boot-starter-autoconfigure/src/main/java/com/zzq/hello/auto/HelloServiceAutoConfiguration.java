package com.zzq.hello.auto;

import com.zzq.hello.bean.HelloProperties;
import com.zzq.hello.service.HelloService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author zzq
 * @date 2022/1/3 11:13
 */
@Configuration
@EnableConfigurationProperties(HelloProperties.class) //默认HelloProperties放在容器中  两个功能
public class HelloServiceAutoConfiguration {

//    没有认真看注解，导致不生效ConditionalOnBean，排错排半天
    @ConditionalOnMissingBean(HelloService.class)
    @Bean
    public HelloService helloService(){
        HelloService helloService = new HelloService();
        return helloService;
    }
}
