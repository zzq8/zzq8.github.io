package com.example.config;

import com.example.aop.LogAspects;
import com.example.aop.MathCalculator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

/**
 * AOP(动态代理)
 * 指程序运行期间，动态的把某段代码切入到指定方法指定位置进行运行的编程方式
 */

@EnableAspectJAutoProxy
@Configuration
public class MainConfigOfAOP {

    @Bean
    public LogAspects logAspects(){
        return new LogAspects();
    }

    @Bean
    public MathCalculator mathCalculator(){
        return new MathCalculator();
    }
}
