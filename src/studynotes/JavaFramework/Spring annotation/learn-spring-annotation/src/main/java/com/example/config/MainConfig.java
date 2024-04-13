package com.example.config;

import com.example.bean.Person;
import com.example.condition.LinuxCondition;
import com.example.condition.WindowsCondition;
import org.springframework.context.annotation.*;
import org.springframework.stereotype.Controller;

@Configuration
//排除规则，可以点进去看看怎么写，是一个@Filter注解数组
//写一下扫描规则
@ComponentScans(
        @ComponentScan(value = "com.example",excludeFilters = {
                @ComponentScan.Filter(type = FilterType.ANNOTATION, classes = {Controller.class})
        })
)
public class MainConfig {

//    @Bean
//    public Person lisi(){
//        return new Person("lisi",20);
//    }
}
