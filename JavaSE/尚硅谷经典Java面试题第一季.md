# [第一季](https://blog.csdn.net/qq_42999092/article/details/109068522)

> Title 为评论区别人的笔记，很详细
>
> 这一季基础的东西，每一集一道面试题。我全是错的，没对过一道  230920

### [* i++](https://www.bilibili.com/video/BV1Eb411P7bP/?vd_source=0f3bf62c50d57c4a7d85b89b4d2633e0)

> - 栈帧（Stack Frame）：
>   - 栈帧是用于支持方法调用和方法执行的数据结构，也称为方法帧或活动记录。
>   - 每个方法在运行时都会创建一个对应的栈帧，用于存储局部变量、操作数栈、动态链接、方法返回地址等信息。
>   - 栈帧以后进先出（LIFO）的方式组织在线程的虚拟机栈中，每个线程都有自己的虚拟机栈。
>   - 当一个方法被调用时，会创建一个新的栈帧并压入虚拟机栈顶，当方法执行结束后，对应的栈帧会被弹出。
> - 程序计数器（PC）：XD 可以理解为行号指示器

```java
i++  => i=i+1
i = i++ => i=1 

题目：
 int i = 1;
 i = i++;
 int j = i++;
 int k = i + ++i * i++;
 System.out.println("i=" + i);
 System.out.println("j=" + j);
 System.out.println("k=" + k);
```

`i = i++;`

```
  2: iload_1
  3: iinc          1, 1
  6: istore_1
```

![image-20230915223439680](http://images.zzq8.cn/img/image-20230915223439680.png)





### * Singleton单例模式

> 饿汉式: 在类初始化时直接创建实例对象,不管你是否需要这个对象都会创建
> 饿汉式: 直接创建对象,不存在线程安全问题
>
> **如果是饿汉式,枚举形式最简单**
> **如果是懒汉式,静态内部类形式最简单**

1) 直接实例化饿汉式(简洁直观)

```java
public class Singleton1 {
    public static final Singleton1 INSTANCE = new Singleton1();
    private Singleton1() {}
}
```

2. **枚举式(最简洁)  => 同上是一样的**

```java
/**
 * 枚举类型:表示该类型的对象是有限的几个
 * 我们可以限定为一个,就成了单例
 */
public enum Singleton2 {
    INSTANCE
}
```

3. 静态代码块饿汉式(适合复杂实例化)

```java
/**
 * 可能想初始化一些变量，不要构造参数给值(这样要改代码不灵活)。。。是配置文件给值
 * 文件的位置在src下的才能用类加载器加载 
 */
public class Singleton3 {
    public static final Singleton3 INSTANCE;
    private String info;

    static {
        try {
            Properties pro = new Properties();
            pro.load(Singleton3.class.getClassLoader().getResourceAsStream("single.properties"));
            INSTANCE = new Singleton3(pro.getProperty("info"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private Singleton3(String info){
        this.info = info;
    }
}
```



PS：注意，以上三个的属性都是 final 修饰！！！但是懒汉不是

> 懒汉式:延迟创建对象

1) 线程不安全(适用于单线程)    需要学习多线程使用!!!

```java
public class Singleton4 {
    static Singleton4 instance;
    private Singleton4() {}
    public static Singleton4 getInstance() {
            if (instance == null) {
                instance = new Singleton4();
            }
            return instance;
    }
}
```

2. 线程安全(适用于多线程)

```java
public class Singleton5 {
    /**
     * 说白了，就是在上面的基础上加 synchronized
     */
    static Singleton5 instance;
    private Singleton5() {}
    public static Singleton5 getInstance() {
        if (instance == null) {
            synchronized (Singleton5.class) {
                if (instance == null) {
                    instance = new Singleton5();
                }
                return instance;
            }
        }
        return instance;
    }
}
```

3. **静态内部类形式(适用于多线程)**

```java
/**
 * 推荐静态内部类方式，既能懒加载，又保证了线程安全
 */
 public class Singleton6 {
    /**
     * 1、内部类被加载和初始化时，才创建INSTANCE实例对象
     * 2、静态内部类不会自动创建,随着外部类的加载初始化而初始化，他是要单独去加载和实例化的
     * 3、因为是在内部类加载和初始化时，创建的，因此线程安全
     */
    private Singleton6(){}

    public static class Inner{
        private static final Singleton6 INSTANCE = new Singleton6();
    }
    public static Singleton6 getInstance() {
        return Inner.INSTANCE;
    }
}
```



### * 方法参数传递机制

> String的不可变性我又没理解！！！   ==已经无数次==  只对了数组，我真废物阿
>
> String、包装类等对象的不可变性（本来像对象这种都会跟着变，但这两者是会产生新对象所以。。）
> XD：可以参考下构造 this.a=a 之所以要这一步可能就是因为这样  方法一执行完，形参都没的情况  所以要赋值出去

```java
public class Exam4 {
    public static void main(String[] args) {
        int i = 1;
        String str = "hello";
        Integer num = 200;
        int[] arr = {1,2,3,4,5};
        MyData my = new MyData();

        change(i,str,num,arr,my);
  
        System.out.println("i= " + i);
        System.out.println("str= " + str);
        System.out.println("num= " + num);
        System.out.println("arr= " + Arrays.toString(arr));
        System.out.println("my.a= " + my.a);

    }
    public static void change(int j, String s, Integer n, int[] a, MyData m) {
        j += 1;
        s += "world";
        n += 1;
        a[0] += 1;
        m.a += 1;
    }
}
class MyData {
    int a = 10;

}
```

<details>
    <summary>答案：</summary>
	<p>arr my变了
    i= 1
str= hello
num= 200
arr= [2, 2, 3, 4, 5]
my.a= 11
    </p>
</details>

![变量初始化 以及运算时 栈堆内存的变化](http://images.zzq8.cn/img/20201014104401137.png)
