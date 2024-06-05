package org.example.bean;


import org.springframework.stereotype.Component;

@Component  //将这个类标注为Spring的一个组件，放到容器中
public class People {

    public String name = "zhangsan";
}
