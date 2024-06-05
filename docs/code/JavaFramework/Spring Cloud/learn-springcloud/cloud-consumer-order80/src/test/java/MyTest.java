import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;

@PropertySource("classpath:application.yaml")
public class MyTest {

    @Value("${payment.url}")
    public String PAYMENT_URL;

    @Value("${server.port}")
    public String port;

    @Test
    public void test01(){
        System.out.println(PAYMENT_URL);
        System.out.println(port);
    }
}
