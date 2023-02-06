package org.example;

import org.example.bean.People;
import org.example.bean.User;
import org.example.config.MyConfig;
import org.example.service.CRUD;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.core.io.ClassPathResource;

import java.util.ArrayDeque;

/**
 * Unit test for simple App.
 */
public class AppTest {

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
