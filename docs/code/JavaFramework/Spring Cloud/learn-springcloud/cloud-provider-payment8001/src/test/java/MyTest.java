import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * 访问不到，不知是不是 这个是测试类的原因
 */
@Component
@Slf4j
public class MyTest {
    /**
     * 由于是 Spring 的注解，所以得是组件里才生效才能享受 Spring 带来的福利
     */
    @Value("${mytest.location1}")
    String location1;

    @Value("${mytest.location2}")
    String location2;

    @GetMapping("test")
    public void test01(){
        log.info("location1：{}",location1);
    }
}
