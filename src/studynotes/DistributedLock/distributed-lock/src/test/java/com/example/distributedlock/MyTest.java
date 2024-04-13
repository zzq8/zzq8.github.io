package com.example.distributedlock;

import org.junit.jupiter.api.Test;

import java.util.HashMap;

public class MyTest {


    @Test
    public void test01() {
        System.out.println(testReturn(5));
    }

    private int testReturn(int n) {
        try{
            n++;
            System.out.println("try: "+(n/0));
            return n;
        }catch(Exception e){
            n++;
            System.out.println("catch: "+n);
        }finally{
            n++;
            System.out.println("finally: "+n);
        }
        return n;
    }


    static Byte x;
    static byte y;

    public static void main(String[] args) {
        /**
         * K、V 都可以为 null
         */
        HashMap<String, String> map = new HashMap<>();
        map.put(null, "123");
        System.out.println(map.get(null));


        System.out.println(x);
        System.out.println(y);
//        x = 128;


        String s1 = "张三";
        String s2 = "李四";
        // 张三 李四 和 李四 张三 这两条只有一条可以
        System.out.println(s1.compareTo(s2) > 0);   // s1 > s2  false
        System.out.println(s2.compareTo(s1) > 0);   // s2 > s1  true
    }
}


class Two {
    Byte x;
}

class PassO {
    public static void main(String[] args) {
        PassO p = new PassO();
        p.start();
    }

    void start() {
        Two t = new Two();
        System.out.print(t.x + "");
        Two t2 = fix(t);
        System.out.print(t.x + " " + t2.x);
    }

    Two fix(Two tt) {
        tt.x = 42;
        return tt;
    }


    /**
     * A：错，静态内部类才可以声明静态方法。
     * B：错，抽象方法不能有方法体。
     * C：错，静态内部类的静态方法不能访问外部类的非静态成员（外部类需要实例化）
     * D：错，静态内部类才可以声明静态方法。
     */
  /*  private float f=1.0f;
    class InnerClass{
        public static float func(){return f;}
    }

    abstract class InnerClass1{
        public abstract float func(){}
    }

    static class InnerClass3{
        protected static float func(){return f;}
    }

    public class InnerClass4{
        static float func(){return f;}
    }*/
}







/*public class Test {
    static String x="1";
    static int y=1;
    public static void main(String args[]) {
        static int z=2;
        System.out.println(x+y+z);
    }
}*/




