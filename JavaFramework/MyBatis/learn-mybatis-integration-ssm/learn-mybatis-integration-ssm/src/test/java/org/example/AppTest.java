package org.example;

import org.apache.ibatis.session.SqlSession;
import org.example.mapper.EmployeeMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * 所以说在用单元测试的时候是有引入配置文件的，mapper对象是可以正常注入的。
 * 但在调用方法的时候没有引入配置文件，不能生成mapper代理对象，所以会出现空指针异常。
 *
 * @RunWith(SpringJUnit4ClassRunner.class)作用是让测试运行于Spring测试环境
 * @ContextConfiguration注解表示，在整合JUnit4测试时，使用注解引入多个配置文件
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations="classpath:applicationContext.xml")
public class AppTest {

    @Autowired
    EmployeeMapper mapper;


    /**
     * 这里使用了自动注入的mapper，所以这个类要加两个注解
     */
    @Test
    public void shouldAnswerWithTrue() {
        System.out.println(mapper);
    }

}
