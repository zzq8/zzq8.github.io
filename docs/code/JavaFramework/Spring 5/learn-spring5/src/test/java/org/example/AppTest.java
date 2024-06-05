package org.example;

import org.example.bean.BeanLife;
import org.example.bean.People;
import org.example.bean.User;
import org.example.config.MyConfig;
import org.example.service.CRUD;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Unit test for simple App.
 */
public class AppTest {


    /**
     * Bean 的五步生命周期演示
     */
    @Test
    public void test04(){
//        ApplicationContext context = new ClassPathXmlApplicationContext("beans-test.xml");
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("beans-test.xml");  //init 是不是在这个时候跑
        BeanLife bean = context.getBean("beanLife", BeanLife.class);
        System.out.println("第四步：获取实例化后的 Bean 可以开始使用 Bean  "+ bean);
        //手动让 bean 实例销毁
        context.close();  //ClassPathXmlApplicationContext
    }

    /**
     * 这里@Autowired用不了，估计是注入方式不是在这
     */
    @Autowired
    User user;

    @Test
    public void test01(){
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
        User user = context.getBean("user", User.class);
        System.out.println(this.user == user);

        user.getCat().shout();
        user.getDog().shout();
        System.out.println(user);
    }



    @Test
    public void test02(){
        ApplicationContext context = new AnnotationConfigApplicationContext(MyConfig.class);

        People people = context.getBean("getPeople", People.class);
        System.out.println(people.name);
    }


    /**
     * 配置文件版 AOP
     */
    @Test
    public void test03(){
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
        CRUD crudImpl = (CRUD) context.getBean("CRUDImpl");
        crudImpl.delete();
    }

}
