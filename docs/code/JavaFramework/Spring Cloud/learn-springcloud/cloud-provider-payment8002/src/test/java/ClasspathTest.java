import org.junit.jupiter.api.Test;
import org.springframework.util.ResourceUtils;

import java.io.FileNotFoundException;

public class ClasspathTest {

    @Test
    public void test01() throws FileNotFoundException {
        // 获取classpath
        String classpath = ResourceUtils.getURL("classpath:").getPath();
        System.out.println(classpath);
    }
}
