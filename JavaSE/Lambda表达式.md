# Lambda表达式 #
## 一、Lambda表达式简介 ##

### 什么是Lambda？ ###

Lambda是JAVA 8添加的新特性，说白了，Lambda是一个匿名函数

### 为什么使用Lambda ###

使用Lambda表达式可以对一个接口的方法进行非常简洁的实现

### Lambda对接口的要求 ###

虽然可以使用Lambda表达式对某些接口进行简单的实现，但是并不是所有的接口都可以用Lambda表达式来实现，要求接口中定义的**必须要实现的抽象方法只能是一个**

```
在JAVA8中 ，对接口加了一个新特性：default
可以使用default对接口方法进行修饰，被修饰的方法在接口中可以默认实现
```

### @FunctionalInterface ###

修饰函数式接口的，接口中的抽象方法只有一个

## 二、Lambda的基础语法 ##

### 1.语法 ###

```java
// 1.Lambda表达式的基础语法
// Lambda是一个匿名函数 一般关注的是以下两个重点
// 参数列表 方法体

/**
* （）：用来描述参数列表
*  {}：用来描述方法体 有时可以省略
*  ->: Lambda运算符 读作goes to
*  例 Test t=()->{System.out.println("hello word")}; 大括号可省略
*/
```



### 2.创建多个接口 ###

```java
/**
 * 无参数无返回值接口
 * @author Alan
 * @version 1.0
 * @date 2020-05-27 10:24
 */
@FunctionalInterface
public interface LambdaNoneReturnNoneParmeter {

    void test();
}

/**
 * 无返回值有单个参数
 * @author Alan
 * @version 1.0
 * @date 2020-05-27 10:26
 */
@FunctionalInterface
public interface LambdaNoneReturnSingleParmeter {

    void test(int n);
}

/**
 * 无返回值 多个参数的接口
 * @author Alan
 * @version 1.0
 * @date 2020-05-27 10:27
 */
@FunctionalInterface
public interface LambdaNoneReturnMutipleParmeter {

    void test(int a,int b);
}

/**
 * 有返回值 无参数接口
 * @author Alan
 * @version 1.0
 * @date 2020-05-27 10:28
 */
@FunctionalInterface
public interface LambdaSingleReturnNoneParmeter {

    int test();
}

/**
 * 有返回值 有单个参数的接口
 * @author Alan
 * @version 1.0
 * @date 2020-05-27 10:29
 */
@FunctionalInterface
public interface LambdaSingleReturnSingleParmeter {

    int test(int n);
}

/**
 * 有返回值 有多个参数的接口
 * @author Alan
 * @version 1.0
 * @date 2020-05-27 10:30
 */
@FunctionalInterface
public interface LambdaSingleReturnMutipleParmeter {

    int test(int a,int b);
}
```

### 3.创建测试类 ###

```java
package com.alan.learn.syntax;

import com.alan.learn.interfaces.*;

/**
 * @author Alan
 * @version 1.0
 * @date 2020-05-27 10:33
 */
public class Syntax1 {

    public static void main(String[] args) {
        // 1.Lambda表达式的基础语法
        // Lambda是一个匿名函数 一般关注的是以下两个重点
        // 参数列表 方法体

        /**
         * （）：用来描述参数列表
         *  {}：用来描述方法体
         *  ->: Lambda运算符 读作goes to
         */

        // 无参无返回  
        LambdaNoneReturnNoneParmeter lambda1=()->{
            System.out.println("hello word");
        };
        lambda1.test();

        // 无返回值 单个参数 
        LambdaNoneReturnSingleParmeter lambda2=(int n)->{
            System.out.println("参数是："+n);
        };
        lambda2.test(10);

        // 无返回值 多个参数
        LambdaNoneReturnMutipleParmeter lambda3=(int a,int b)->{
            System.out.println("参数和是："+(a+b));
        };
        lambda3.test(10,12);

        // 有返回值 无参数
        LambdaSingleReturnNoneParmeter lambda4=()->{
            System.out.println("lambda4：");
            return 100;
        };
        int ret=lambda4.test();
        System.out.println("返回值是："+ret);

        // 有返回值 单个参数
        LambdaSingleReturnSingleParmeter lambda5=(int a)->{
            return a*2;
        };
        int ret2= lambda5.test(3);
        System.out.println("单个参数，lambda5返回值是:"+ret2);

        //有返回值 多个参数
        LambdaSingleReturnMutipleParmeter lambda6=(int a,int b)->{
            return a+b;
        };
        int ret3=lambda6.test(12,14);
        System.out.println("多个参数，lambda6返回值是："+ret3);
    }
}

输出结果：
    hello word
	参数是：10
	参数和是：22
	lambda4：
	返回值是：100
	单个参数，lambda5返回值是:6
    多个参数，lambda6返回值是：26
```

## 三、语法精简 ##

针对上述基础语法的精简

### 1.参数类型精简 ###

```java
/**
* 语法精简
* 1.参数类型
* 由于在接口的抽象方法中，已经定义了参数的数量类型 所以在Lambda表达式中参数的类型可以省略
* 备注：如果需要省略类型，则每一个参数的类型都要省略，千万不要一个省略一个不省略
*/
LambdaNoneReturnMutipleParmeter lambda1=(int a,int b)-> {
    System.out.println("hello world"); 
};    
可以精简为:
LambdaNoneReturnMutipleParmeter lambda1=(a,b)-> {
    System.out.println("hello world");
};
```

### 2.参数小括号精简 ###

```java
/**
* 2.参数小括号
* 如果参数列表中，参数的数量只有一个 此时小括号可以省略
*/
LambdaNoneReturnSingleParmeter lambda2=(a)->{
    System.out.println("hello world");
};
可以精简为:
LambdaNoneReturnSingleParmeter lambda2= a->{
    System.out.println("hello world");
};
```

### 3.方法大括号精简 ###

```java
/**
* 3.方法大括号
* 如果方法体中只有一条语句，此时大括号可以省略
*/
LambdaNoneReturnSingleParmeter lambda3=a->{
    System.out.println("hello world");
};
可以精简为:
LambdaNoneReturnSingleParmeter lambda3=a->System.out.println("hello world");
```

### 4.==大括号精简补充== ###

```java
/**
* 4.如果方法体中唯一的一条语句是一个返回语句
* 贼省略大括号的同时 也必须省略return
*/
LambdaSingleReturnNoneParmeter lambda4=()->{
    return 10;
};
可以精简为:
LambdaSingleReturnNoneParmeter lambda4=()->10;
```

### 5.多参数，有返回值 精简 ###

```java
LambdaSingleReturnNoneParmeter lambda4=(a,b)->{
    return a+b;
};
可以精简为:
LambdaSingleReturnMutipleParmeter lambda5=(a,b)->a+b;
```

## 四、Lambda语法进阶 ##

### 1.方法引用(普通方法与静态方法) ###

在实际应用过程中，一个接口在很多地方都会调用同一个实现，例如：

```java
LambdaSingleReturnMutipleParmeter lambda1=(a,b)->a+b;
LambdaSingleReturnMutipleParmeter lambda2=(a,b)->a+b;
```

这样一来每次都要写上具体的实现方法 a+b，如果需求变更，则每一处实现都需要更改，基于这种情况，可以将后续的是实现更改为已定义的 方法，需要时直接调用就行

#### 语法： ####



```java
/**
*方法引用：
* 可以快速的将一个Lambda表达式的实现指向一个已经实现的方法
* 方法的隶属者 如果是静态方法 隶属的就是一个类  其他的话就是隶属对象
* 语法：方法的隶属者::方法名 (Classname::methodName)
* 注意：
*  1.引用的方法中，参数数量和类型一定要和接口中定义的方法一致
*  2.返回值的类型也一定要和接口中的方法一致
*/
```
![image](https://gitee.com/codezzq/blogImage/raw/master/img/1.bmp)

第一个参数是作为下面的方法调用者出现

![](https://gitee.com/codezzq/blogImage/raw/master/img/1231231245.PNG)
#### 例： ####

- ```java
  package com.alan.learn.syntax;
  
  import com.alan.learn.interfaces.LambdaSingleReturnSingleParmeter;
  
  /**
   * @author Alan
   * @version 1.0
   * @date 2020-05-27 11:48
   */
  public class Syntax3 {
  
      public static void main(String[] args) {
          
          LambdaSingleReturnSingleParmeter lambda1=a->a*2;
          LambdaSingleReturnSingleParmeter lambda2=a->a*2;
          LambdaSingleReturnSingleParmeter lambda3=a->a*2;
  
          //简化
          LambdaSingleReturnSingleParmeter lambda4=a->change(a);
  
          //方法引用
          LambdaSingleReturnSingleParmeter lambda5=Syntax3::change;
      }
  
      /**
      * 自定义的实现方法
      */
      private static int change(int a){
          return a*2;
      }
  }
  
  ```

### 2.方法引用(构造方法) ###

目前有一个实体类

```java
public class Person {
    public String name;
    public int age;

    public Person() {
        System.out.println("Person的无参构造方法执行");
    }

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
        System.out.println("Person的有参构造方法执行");
    }
}
```

需求

两个接口，各有一个方法，一个接口的方法需要引用Person的无参构造，一个接口的方法需要引用Person的有参构造 用于返回两个Person对象，例：

```java
interface PersonCreater{
    //通过Person的无参构造实现
    Person getPerson();
}

interface PersonCreater2{
    //通过Person的有参构造实现
    Person getPerson(String name,int age);
}
```

那么可以写作：

```java
public class Syntax4 {
    public static void main(String[] args) {

        PersonCreater creater=()->new Person();

        //引用的是Person的无参构造
         //PersonCreater接口的方法指向的是Person的方法
        PersonCreater creater1=Person::new; //等价于上面的()->new Person()
        //实际调用的是Person的无参构造 相当于把接口里的getPerson()重写成new Person()。
        Person a=creater1.getPerson(); 

        //引用的是Person的有参构造
        PersonCreater2 creater2=Person::new;
        Person b=creater2.getPerson("张三",18);
    }
}
```

**注意：是引用无参构造还是引用有参构造 在于接口定义的方法参数**

## 五、综合练习 ##

### 1.集合排序案例 ###

```java
package com.alan.exercise;

import com.alan.learn.data.Person;

import java.util.ArrayList;

/**
 * 集合排序案例
 * @author Alan
 * @version 1.0
 * @date 2020-05-27 15:08
 */
public class Exercise1 {

    public static void main(String[] args) {

        //需求：已知在一个ArrayList中有若干各Person对象，将这些Person对象按照年龄进行降序排列
        ArrayList<Person> list=new ArrayList<>();


        list.add(new Person("张三",10));
        list.add(new Person("李四",12));
        list.add(new Person("王五",13));
        list.add(new Person("赵六",14));
        list.add(new Person("李雷",11));
        list.add(new Person("韩梅梅",8));
        list.add(new Person("jack",10));

        System.out.println("排序前："+list);

        //将排列的依据传入 具体的方法指向的是 内部元素的age相减 sort会依据结果的正负进行降序排列
        //sort 使用提供的 Comparator对此列表进行排序以比较元素。
        list.sort((o1, o2) -> o2.age-o1.age);

        System.out.println("排序后："+list);
    }
}

```

### 2.Treeset排序案例 ###

```java
package com.alan.exercise;

import com.alan.learn.data.Person;

import java.util.TreeSet;

/**
 * @author Alan
 * @version 1.0
 * @date 2020-05-27 15:37
 */
public class Exercise2 {
    public static void main(String[] args) {

        /**Treeset 自带排序
         * 但是现在不知道Person谁大谁小无法排序
         * 解决方法：
         * 使用Lambda表达式实现Comparator接口，并实例化一个TreeSet对象
         * 注意：在TreeSet中如果Comparator返回值是 0 会判断这是两个元素是相同的 会进行去重
         * TreeSet<Person> set=new TreeSet<>((o1, o2) -> o2.age-o1.age); 
         * 这个获取的对象打印会少一个Person
         * 此时我们将方法修改
        */
        TreeSet<Person> set=new TreeSet<>((o1, o2) ->{
            if(o1.age>=o2.age){
                return -1;
            }else {
                return 1;
            }
        });

        set.add(new Person("张三",10));
        set.add(new Person("李四",12));
        set.add(new Person("王五",13));
        set.add(new Person("赵六",14));
        set.add(new Person("李雷",11));
        set.add(new Person("韩梅梅",8));
        set.add(new Person("jack",10));

        System.out.println(set);
    }
}

```

### 3.集合的遍历 ###

```java
package com.alan.exercise;

import java.util.ArrayList;
import java.util.Collections;

/**
 * 集合的遍历
 * @author Alan
 * @version 1.0
 * @date 2020-05-27 15:52
 */
public class Exercise3 {

    public static void main(String[] args) {
        ArrayList<Integer> list=new ArrayList<>();

        Collections.addAll(list,1,2,3,4,5,6,7,8,9);
        /**
         * list.forEach(Consumer<? super E> action) 
         * api文档解释： 对 集合中的每个元素执行给定的操作，直到所有元素都被处理或动作引发异常。
         * 将集合中的每一个元素都带入到接口Consumer的方法accept中  然后方法accept指向我们的引用
         * 输出集合中的所有元素
         * list.forEach(System.out::println);
        */

        //输出集合中所有的偶数
        list.forEach(ele->{
            if(ele%2==0){
                System.out.println(ele);
            }
        });
    }
}

```

### 4.删除集合中满足条件的元素 ###

```java
package com.alan.exercise;

import com.alan.learn.data.Person;

import java.util.ArrayList;

/**
 * 删除集合中满足条件的元素
 * @author Alan
 * @version 1.0
 * @date 2020-05-27 16:05
 */
public class Exercise4 {

    public static void main(String[] args) {
        ArrayList<Person> list=new ArrayList<>();

        list.add(new Person("张三",10));
        list.add(new Person("李四",12));
        list.add(new Person("王五",13));
        list.add(new Person("赵六",14));
        list.add(new Person("李雷",11));
        list.add(new Person("韩梅梅",8));
        list.add(new Person("jack",10));

        //删除集合中年龄大于12的元素
        /**
         * 之前迭代器的做法
         * ListIterator<Person> it = list.listIterator();
         * while (it.hasNext()){
         *   Person ele=it.next();
         *   if(ele.age>12){
         *         it.remove();
         *   }
         * }
         */

        /**
         * lambda实现
         * 逻辑
         * 将集合中的每一个元素都带入到接口Predicate的test方法中，
         * 如果返回值是true，则删除这个元素
        */
        list.removeIf(ele->ele.age>10);
        System.out.println(list);
    }
}

```

### 5.开辟一条线程 做一个数字的输出 ###

```java
package com.alan.exercise;

/**
 * 需求：
 * 开辟一条线程 做一个数字的输出
 * @author Alan
 * @version 1.0
 * @date 2020-05-27 16:17
 */
public class Exercise5 {
    public static void main(String[] args) {

        /**
         * 通过Runnable 来实例化线程
         */
        Thread t=new Thread(()->{
            for(int i=0;i<100;i++){
                System.out.println(i);
            }
        });
        t.start();
    }
}

```

## 六、系统内置的函数式接口 ##

```java
package com.alan.functional;

import java.util.function.*;

/**
 * 系统内置的一些函数式接口
 * @author Alan
 * @version 1.0
 * @date 2020-05-27 16:23
 */
public class FunctionalInterface {
    public static void main(String[] args) {

        // Predicate<T>              ：     参数是T 返回值boolean  
        // 在后续如果一个接口需要指定类型的参数，返回boolean时可以指向 Predicate
        //          IntPredicate            int -> boolean
        //          LongPredicate           long -> boolean
        //          DoublePredicate         double -> boolean

        // Consumer<T>               :      参数是T 无返回值(void)
        //          IntConsumer             int ->void
        //          LongConsumer            long ->void
        //          DoubleConsumer          double ->void

        // Function<T,R>             :      参数类型T  返回值R
        //          IntFunction<R>          int -> R
        //          LongFunction<R>         long -> R
        //          DoubleFunction<R>       double -> R
        //          IntToLongFunction       int -> long
        //          IntToDoubleFunction     int -> double
        //          LongToIntFunction       long -> int
        //          LongToDoubleFunction    long -> double
        //          DoubleToLongFunction    double -> long
        //          DoubleToIntFunction     double -> int

        // Supplier<T> : 参数 无 返回值T
        // UnaryOperator<T> :参数T 返回值 T
        // BiFunction<T,U,R> : 参数 T、U 返回值 R
        // BinaryOperator<T> ：参数 T、T 返回值 T
        // BiPredicate<T,U> :  参数T、U  返回值 boolean
        // BiConsumer<T,U> :    参数T、U 无返回值

        /**
         * 常用的 函数式接口
         * Predicate<T>、Consumer<T>、Function<T,R>、Supplier<T>
         */
    }
}

```

## 七、Lambda闭包 ##

```java
package com.alan.closure;

import java.util.function.Supplier;

/**
 * @author Alan
 * @version 1.0
 * @date 2020-05-27 16:59
 */
public class ClosureDemo {
    public static void main(String[] args) {

        /**
         * lambda的闭包会提升包围变量的生命周期
         * 所以局部变量 num在getNumber()方法内被 get()引用 不会在getNumber()方法执行后销毁
         * 这种方法可以在外部获取到某一个方法的局部变量
         */
        int n=getNumber().get();
        System.out.println(n);
    }
    private static Supplier<Integer> getNumber(){
        int num=10;
        /**
         * Supplier supplier=()->num;
         * return supplier;
         */
        return ()->{
            return num;
        };
    }
}
*************************************************************************
    
package com.alan.closure;

import java.util.function.Consumer;

/**
 * @author Alan
 * @version 1.0
 * @date 2020-05-27 17:20
 */
public class ClosureDemo2 {
    public static void main(String[] args) {
        int a=10;
        Consumer<Integer> c=ele->{
            System.out.println(a+1);
            //System.out.println(ele);
            //System.out.println(a++); 会报错
            //在lambda中引用局部变量 这个变量必须是一个常量
        };
        //a++; 这样也会导致内部报错
        //如果在内部已经引用局部变量 参数传递后 打印的还是 10
        c.accept(1);
    }
}

```

