import com.example.bean.Person;
import com.example.config.MainConfig;
import com.example.config.MainConfig2;
import com.example.config.MainConfigOfPropertyValues;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.core.env.Environment;

public class MyTest {
    @Test
    public void test01() {
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");

        Person bean = context.getBean(Person.class);
        System.out.println(bean);

        System.out.println("--------------------");

        ApplicationContext context1 = new AnnotationConfigApplicationContext(MainConfig.class);
        String[] names = context1.getBeanNamesForType(Person.class);
        for (String name : names) {
            System.out.println(name);
        }
    }

    /**
     * 测试@ComponentScan
     */
    @Test
    public void test02() {
        ApplicationContext context = new AnnotationConfigApplicationContext(MainConfig.class);
        String[] names = context.getBeanDefinitionNames();
        for (String name : names) {
            System.out.println(name);
        }
    }

    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MainConfigOfPropertyValues.class);

    /**
     * condition
     * <p>
     * Q：如果我想测试linux能否装配可以改jvm参数改成os.name=linux
     * 可以配置一些运行时变量，改jvm参数-Dos.name   -D固定写法 多个参数用空格隔开
     */
    @Test
    public void test03() {
        String[] names = context.getBeanNamesForType(Person.class);
        for (String name : names) {
            System.out.println(name);
        }

        context.close();
    }


    /**
     * @Autoware是Spring的
     * @Resource是java的脱离Spring也可以用
     */
    @Test
    public void test04() {
        ApplicationContext context = new AnnotationConfigApplicationContext(MainConfigOfPropertyValues.class);
        Person bean = context.getBean(Person.class);
        System.out.println(bean);
        Environment environment = context.getEnvironment();
        String nickname = environment.getProperty("nickname");
        System.out.println(nickname);
    }
}
