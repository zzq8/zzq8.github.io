package com.zzq;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;

@SpringBootApplication
@MapperScan("com.zzq.mapper")
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SpringSecurityApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext run = SpringApplication.run(SpringSecurityApplication.class, args);

        //重写了登陆的这里就获取不到会报错
//        run.getBean(DefaultSecurityFilterChain.class);
    }

}
