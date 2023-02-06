package com.example.boot.config;

import com.example.boot.bean.Cat;
import com.example.boot.bean.User;
import com.example.boot.bean.Vehicle;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.ImportResource;


/**
 * @author zzq
 * @date 2021/12/24 19:55
 *
 * 配置类本身也是一个组件
 *
 * SpringBoot2的新增点 组件依赖的两种模式
 * @Configuration(proxyBeanMethods = true)
 * Full(proxyBeanMethods = true)
 * Lite(proxyBeanMethods = false)
 */
@Import({Cat.class, User.class}) //导入组件默认组件名字是com.example.boot.bean.Cat 全类名
@Configuration(proxyBeanMethods = false)//默认是true   //告诉SpringBoot这是一个配置类 == 配置文件
@ImportResource("classpath:beans.xml")
/**
 * 配置绑定有两种方法：
 * 适用场景：假如要搞第三方jar包而且它没有注册到容器中，就可以这样！！
 * 不然得那个类有这两个注解 @Component + @ConfigurationProperties 才会生效
 */
@EnableConfigurationProperties(Vehicle.class)

public class MyConfig {

    @Bean("user02")
    public User ss(){
        return new User();
    }

    /**
     * Mark！！！
     * 在spring ioc的过程中，优先解析@Component，@Service，@Controller注解的类。
     * 其次解析配置类，也就是@Configuration标注的类。最后开始解析配置类中定义的bean。
     *
     * 但是tomXXX的条件注解依赖的是user01，user01是被定义的配置类中的，
     * 所以此时配置类的解析无法保证先后顺序，就会出现不生效的情况。
     * @return
     */
    //    User.class 两个，name = "user01"一个
    @ConditionalOnBean(name = "user01") //条件装配，如果容器中有user下面的才生效
    @Bean("tomXXX")
    public Cat tomcatPet(){
        return new Cat("Tom",12);
    }
}
