import cn.hutool.core.util.IdUtil;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;

import java.util.UUID;

@Slf4j
public class TestDemo {

    @Test
    public void test01(){
        log.info(UUID.randomUUID().toString().replace("-",""));

        log.info(IdUtil.simpleUUID());
    }
}
