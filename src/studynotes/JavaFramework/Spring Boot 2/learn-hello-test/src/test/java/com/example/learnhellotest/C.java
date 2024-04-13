package com.example.learnhellotest;

/**
 * @author zzq
 * @date 2022/1/9 18:01
 */
interface A{
    int x = 0;
}

class B{
    int x = 1;
    int y = 3;
}

public class C extends B implements A {

    public void pX(){
        System.out.println(super.x);
        System.out.println(A.x);
    }

    C(){
        System.out.println(super.x);
    }

    public static void main(String[] args) {
        new C().pX();
        C c = new C();
//        System.out.println(super.x);   //报错   必须在子类的方法或构造器中使用super      构造器也可以看成方法

//        我们可以在子类的方法或构造器中。通过使用"super.属性"或"super.方法"的方式，
//        显式的调用父类中声明的属性或方法。但是，通常情况下，我们习惯省略"super."
        System.out.println(c.y);
//        c.x   报错
//        super.x;
    }
}


