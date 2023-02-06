import com.example.aop.MathCalculator;
import com.example.config.MainConfigOfAOP;
import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class MyTestOfAOP {

    /**
     * 将切面类和业务逻辑组件（目标方法所在类）都加入到容器中，并且要告诉Spring哪个类是切面类（标注了@Aspect注解的那个类）。
     * 在切面类上的每个通知方法上标注通知注解，告诉Spring何时何地运行，当然最主要的是要写好切入点表达式，这个切入点表达式可以参照官方文档来写。
     * 开启基于注解的AOP模式，即加上@EnableAspectJAutoProxy注解，这是最关键的一点。
     */

    @Test
    public void test01(){
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MainConfigOfAOP.class);

        MathCalculator mathCalculator = (MathCalculator) context.getBean("mathCalculator");
        mathCalculator.div(1,1);
    }
}
