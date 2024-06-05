package org.example.config;

import org.example.bean.People;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MyConfig {

    /**
     * 假如我方法名写的是 getPeople 那IOC里面的Bean对象ID就是getPeople
     * @Bean是以方法名作为组件的id    注意了，这是我的一个小失误点
     */
    @Bean
    public People getPeople(){
        return new People();
    }
}
