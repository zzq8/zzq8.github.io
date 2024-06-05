package org.example.bean;

public class BeanLife {

    public BeanLife() {
        System.out.println("第一步：Construction 构造Bean对象");
    }

    String properties;

    public void setProperties(String properties) {
        System.out.println("第二步：set Bean 属性值");
        this.properties = properties;
    }


    public void init(){
        System.out.println("第三步：init调用自定义的初始化方法");
    }

    public void destroy(){
        System.out.println("第五步：destroy调用自定义销毁的方法");
    }
}
