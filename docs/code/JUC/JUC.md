---
article: false
---
# JUC & JVM +GC

Links that usually browsed: 

[2）new ThreadPoolExecutor(线程池七大参数)](#2）new ThreadPoolExecutor(线程池七大参数))



> 2022/11/9 学于    [教学视频](https://www.bilibili.com/video/BV18b411M7xz/?spm_id_from=333.999.top_right_bar_window_default_collection.content.click&vd_source=0f3bf62c50d57c4a7d85b89b4d2633e0)         [脑图](./2019互联网面试题第2季.mmap)        [Gitee 别人笔记（全）](https://gitee.com/moxi159753/LearningNotes/blob/master/%E6%A0%A1%E6%8B%9B%E9%9D%A2%E8%AF%95/JUC)      [别人的笔记 ](https://blog.csdn.net/u011863024/article/details/114684428)    21:32 预计 每天 2h  11d 完成！于22nd
>
> 会用只是 API 调用工程师、CURD 程序员！缩招不是不招聘，而是招聘更多更加优质的开发工程师。1 拿 1.8  干  3
>
> 大学毕业后丧失学习能力的90后将彻底被挤出 IT 行业

# 一、volatile

> 使用场景：
>
> - 标志位：当一个共享的标志位需要在多个线程之间进行读写操作时，可以使用 `volatile` 关键字来保证其可见性，以便线程能够及时获取最新的状态。
> - 双重检查锁定（Double-Checked Locking）：在单例模式中，当使用双重检查锁定来确保只有一个实例被创建时，需要将共享的实例变量声明为 `volatile`，以避免由于指令重排序导致的潜在问题。【看下面 5. 例子！！！】
>   - 禁止指令重排
> - ==轻量级同步==：**这个变量是共享且不稳定的,每次使用它都到主存中进行读取**，可以使用 `volatile` 替代 `synchronized` 来实现更轻量级的同步。
>   - 保证可见性

> 能保证两个：主要自己不要把这个和 CAS 搞混了！应该是这个的缺点需要用到 CAS，==它本身是和 CAS 没任何关系的！==
>
> 对volatile变量的操作不会造成阻塞。--> C选项中，volatile修饰一个变量时，是不会加锁的；而只有在加锁情况下才会造成阻塞，所以C正确；

1. `保证可见性`（这就指示 JVM，这个变量是共享且不稳定的，每次使用它都到主存中进行读取）
2. **不保证原子性**
   * 所以需要配 CAS（CPU并发原语） ？
3. `禁止指令重排`（保证有序性 - 因为加入了CPU指令「内存屏障」所以能禁止指令优化重排 XD）

## 0. JMM（前置知识）

JMM(Java内存模型Java Memory Model,简称JMM)本身是一种抽象的概念 并不真实存在,**它描述的是一组规则或规范通过规范定制了程序中各个变量(包括实例字段,静态字段和构成数组对象的元素)的访问方式.**

> JMM 三大特性：

* 可见性（在自己的工作内存写好 volatile 的变量值，写入主内存。**立刻通知其它线程让他们看到，前值作废拿直接拿主物理内存的最新值**）
* 原子性
* 有序性



## 1. 可见性

#### 弹幕：

我替前面的朋友解释一下，为什么说多核，首先你们要明白单核多线程和多核多线程的区别。

单核多线程，在同一时间点，只有一个线程在执行。多核多线程，在同一时间点，有几个核心就会执行几个线程。

这个时候就出现了一个问题，缓存是跟线程挂钩的还是跟核心挂钩的？答案是跟核心，所以单核多线程不会有缓存共享问题。请记住是缓存数据共享，但是依旧会产生并发。

![image-20221109115044681](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202211091150769.png)
数据传输速率：硬盘 < 内存 < < cache < CPU



#### 脑图：

由于JVM运行程序的实体是线程,而每个线程创建时JVM都会为其创建一个工作内存(有些地方成为栈空间),工作内存是每个线程的私有数据区域,而Java内存模型中规定所有变量都存储在主内存,主内存是共享内存区域,所有线程都可访问,**但线程对变量的操作(读取赋值等)必须在工作内存中进行,首先要将变量从主内存拷贝到自己的工作空间,然后对变量进行操作,操作完成再将变量写回主内存**,不能直接操作主内存中的变量,各个线程中的工作内存储存着主内存中的**变量副本拷贝**,因此不同的线程无法访问对方的工作内存,此案成间的通讯(传值) 必须通过主内存来完成,其简要访问过程如下图:

![image-20221109175055161](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202211091750424.png)



#### 开始：

通过前面对JMM的介绍,我们知道
各个线程对主内存中共享变量的操作都是各个线程各自拷贝到自己的工作内存操作后再写回主内存中的.
这就可能存在一个线程AAA修改了共享变量X的值还未写回主内存中时 ,另外一个线程BBB又对内存中的一个共享变量X进行操作,但此时A线程工作内存中的共享比那里X对线程B来说并不不可见.这种工作内存与主内存同步延迟现象就造成了可见性问题.



## 2. 原子性

### 复现：

![image-20200309174220675](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202211111100844.png)

下面我们将一个简单的number++操作，转换为字节码文件一探究竟

```java
public class T1 {
    volatile int n = 0;
    public void add() {
        n++;
    }
}


  public void add();
    Code:
       0: aload_0
       1: dup
       2: getfield      #2    // Field n:I
       5: iconst_1
       6: iadd
       7: putfield      #2    // Field n:I
      10: return
```

我们能够发现 n++这条命令，被拆分成了3个指令

- 执行`getfield` 从主内存拿到原始n
- 执行`iadd` 进行加1操作
- 执行`putfileld` 把累加后的值写回主内存

假设我们没有加 `synchronized`那么第一步就可能存在着，三个线程同时通过getfield命令，拿到主存中的 n值，然后三个线程，各自在自己的工作内存中进行加1操作，但他们并发进行 `iadd` 命令的时候，因为只能一个进行写，所以其它操作会被挂起，假设1线程，先进行了写操作，在写完后，volatile的可见性，应该需要告诉其它两个线程，主内存的值已经被修改了，但是因为太快了，其它两个线程，陆续执行 `iadd`命令，进行写入操作，这就造成了其他线程没有接受到主内存n的改变，从而覆盖了原来的值，出现写丢失，这样也就让最终的结果少于20000

**自己的理解：由于调度算法有些线程执行着执行着会被挂起！**



### 解决：

* synchronized（牛刀）
* 使用原子包装类 AtomicInteger
  * 底层 CAS（Unsafe类、自旋锁）



## 3.==有序性==

计算机在执行程序时，为了提高性能，编译器和处理器常常会对指令重排，一般分为以下三种：

```
源代码 -> 编译器优化的重排 -> 指令并行的重排 -> 内存系统的重排 -> 最终执行指令
```

**单线程环境里面确保最终执行结果和代码顺序的结果一致**（因为就一个人，没人给你抢指令重排无所谓）

处理器在进行重排序时，必须要考虑指令之间的**<font color=red>`数据依赖性`</font>**(具体看下面例子，例如先得有你妈才能有你)

**多线程环境中线程交替执行，由于编译器优化重排的存在**，两个线程中使用的变量能否保证一致性是无法确定的，结果无法预测。（例如高考，老师说先把会做的做了。不见得非得按卷子题目顺序来）



### 指令重排 - example 1

```
public void mySort() {
	int x = 11;
	int y = 12;
	x = x + 5;
	y = x * x;
}
```

按照正常单线程环境，执行顺序是 1 2 3 4

但是在多线程环境下，可能出现以下的顺序：

- 2 1 3 4
- 1 3 2 4

上述的过程就可以当做是指令的重排，即内部执行顺序，和我们的代码顺序不一样

但是指令重排也是有限制的，即不会出现下面的顺序

- 4 3 2 1

因为处理器在进行重排时候，必须考虑到指令之间的 **数据依赖性**

因为步骤 4：需要依赖于 y的申明，以及x的申明，故因为存在数据依赖，无法首先执行



#### 例子

int a,b,x,y = 0

| 线程1        | 线程2  |
| ------------ | ------ |
| x = a;       | y = b; |
| b = 1;       | a = 2; |
|              |        |
| x = 0; y = 0 |        |

因为上面的代码，不存在数据的依赖性，因此编译器可能对数据进行重排

| 线程1        | 线程2  |
| ------------ | ------ |
| b = 1;       | a = 2; |
| x = a;       | y = b; |
|              |        |
| x = 2; y = 1 |        |

这样造成的结果，和最开始的就不一致了，这就是导致重排后，结果和最开始的不一样，因此为了防止这种结果出现，volatile就规定禁止指令重排，为了保证数据的一致性  



### 指令重排 - example 2

比如下面这段代码

```
/**
 * ResortSeqDemo
 *
 * @author: 陌溪
 * @create: 2020-03-10-16:08
 */
public class ResortSeqDemo {
    int a= 0;
    boolean flag = false;

    public void method01() {
        a = 1;
        flag = true;
    }

    public void method02() {
        if(flag) {
            a = a + 5;
            System.out.println("reValue:" + a);
        }
    }
}
```

我们按照正常的顺序，分别调用method01() 和 method02() 那么，最终输出就是 a = 6

但是如果在多线程环境下，因为方法1 和 方法2，他们之间不能存在数据依赖的问题，因此原先的顺序可能是

```
a = 1;
flag = true;

a = a + 5;
System.out.println("reValue:" + a);
        
```

但是在经过编译器，指令，或者内存的重排后，可能会出现这样的情况

```
flag = true;

a = a + 5;
System.out.println("reValue:" + a);

a = 1;
```

也就是先执行 flag = true后，另外一个线程马上调用方法2，满足 flag的判断，最终让a + 5，结果为5，这样同样出现了数据不一致的问题

为什么会出现这个结果：多线程环境中线程交替执行，由于编译器优化重排的存在，两个线程中使用的变量能否保证一致性是无法确定的，结果无法预测。

这样就需要通过volatile来修饰，来保证线程安全性



### Volatile针对指令重排做了啥

Volatile实现禁止指令重排优化，从而避免了多线程环境下程序出现乱序执行的现象

首先了解一个概念，==内存屏障（Memory Barrier）==又称内存栅栏，是一个CPU指令，它的作用有两个：

- 保证特定操作的顺序
- 保证某些变量的内存可见性（利用该特性实现volatile的内存可见性）

由于编译器和处理器都能执行指令重排的优化，如果在指令间插入一条Memory Barrier则会告诉编译器和CPU，不管什么指令都不能和这条Memory Barrier指令重排序，也就是说 `通过插入内存屏障禁止在内存屏障前后的指令执行重排序优化`。 内存屏障另外一个作用是刷新出各种CPU的缓存数，因此任何CPU上的线程都能读取到这些数据的最新版本。

![image-20200310162654437](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202211121459789.png)

也就是过在Volatile的写 和 读的时候，加入屏障，防止出现指令重排的

### 线程安全获得保证

工作内存与主内存同步延迟现象导致的可见性问题

- 可通过synchronized或volatile关键字解决，他们都可以使一个线程修改后的变量立即对其它线程可见

对于指令重排导致的可见性问题和有序性问题

- 可以使用volatile关键字解决，因为volatile关键字的另一个作用就是禁止重排序优化



## 4. 使用场景

单例模式

读写锁手写缓存

CAS 底层  JUC 包里大规模使用到



## 5. Volatile的应用

> 一般我们写单例模式都是加 sychronized ，但是这样的话就整个代码都锁了（它包的这个方法）。为了数据一致性，并发性就下降了，实际只用锁一行

### 单例模式的逐步优化：

#### 1. DCL（Double Check Lock）双端检锁机制

> 通俗的说：加锁前后都进行了一次判断，用 sychronized 同步代码块

```java
  public static SingletonDemo getInstance() {
        if(instance == null) {
            // 同步代码段的时候，进行检测
            synchronized (SingletonDemo.class) {
                if(instance == null) {
                    instance = new SingletonDemo();
                }
            }
        }
        return instance;
    }
```



> **问题：因为有指令重排，可能运行一千万次会出现一次错误**
>
> 就是说，还没初始化完成（刚进第一个 if），又有一个线程来了，发现instance不为空，返回Instance，但实际没有完成初始化，这个对象还没创建成功，返回了一个寂寞

原因是在某一个线程执行到第一次检测的时候，读取到 instance 不为null，instance的引用对象 **可能没有完成实例化**。因为 instance = new SingletonDemo()；可以分为以下三步进行完成：

```java
memory = allocate(); // 1、分配对象内存空间
instance(memory); // 2、初始化对象
instance = memory; // 3、设置instance指向刚刚分配的内存地址，此时instance != null
```

但是我们通过上面的三个步骤，能够发现，步骤2 和 步骤3之间不存在 `数据依赖关系`，而且无论重排前 还是重排后，程序的执行结果在单线程中并没有改变，因此这种重排优化是允许的。

```java
memory = allocate(); // 1、分配对象内存空间
instance = memory; // 3、设置instance指向刚刚分配的内存地址，此时instance != null，但是对象还没有初始化完成
instance(memory); // 2、初始化对象
```

这样就会造成什么问题呢？

也就是当我们执行到重排后的步骤2，试图获取instance的时候，会得到null，因为对象的初始化还没有完成，而是在重排后的步骤3才完成，因此执行单例模式的代码时候，就会重新在创建一个instance实例

```
指令重排只会保证串行语义的执行一致性（单线程），但并不会关系多线程间的语义一致性
```

所以当一条线程访问instance不为null时，由于instance实例未必已初始化完成，这就造成了线程安全的问题

所以需要引入volatile，来保证出现指令重排的问题，从而保证单例模式的线程安全性

```
private static volatile SingletonDemo instance = null;
```



#### 2. + volatile 解决上述问题

> 注意：是多线程环境
>
> > XD 以下解释很清白了：
> >
> > `uniqueInstance` 采用 `volatile` 关键字修饰也是很有必要的， `uniqueInstance = new Singleton();` 这段代码其实是分为三步执行：
> >
> > 1. 为 `uniqueInstance` 分配内存空间
> > 2. 初始化 `uniqueInstance`
> > 3. 将 `uniqueInstance` 指向分配的内存地址
> >
> > 但是由于 JVM 具有指令重排的特性，执行顺序有可能变成 1->3->2。指令重排在单线程环境下不会出现问题，但是在多线程环境下会导致一个线程获得还没有初始化的实例。例如，线程 T1 执行了 1 和 3，此时 T2 调用 `getUniqueInstance`() 后发现 `uniqueInstance` 不为空，因此返回 `uniqueInstance`，但此时 `uniqueInstance` 还未被初始化。
> >
> > ------
> >
> > 著作权归JavaGuide(javaguide.cn)所有 基于MIT协议 原文链接：https://javaguide.cn/java/concurrent/java-concurrent-questions-02.htms

```java
		private static volatile SingletonDemo instance = null;

    private SingletonDemo () {
        System.out.println(Thread.currentThread().getName() + "\t 我是构造方法SingletonDemo");
    }

    public static SingletonDemo getInstance() {
        if(instance == null) {
            // a 双重检查加锁多线程情况下会出现某个线程虽然这里已经为空，但是另外一个线程已经执行到d处
            synchronized (SingletonDemo.class) //b
            { 
           //c不加volitale关键字的话有可能会出现尚未完全初始化就获取到的情况。原因是内存模型允许无序写入
                if(instance == null) { 
                	// d 此时才开始初始化
                    instance = new SingletonDemo();
                }
            }
        }
        return instance;
    }
```







# 二、CAS

> CAS的全称是Compare-And-Swap，它是**CPU并发原语 **，是实现并发算法时常用到的一种技术
>
> * 所谓原语，一般是指由若干条指令组成的程序段，用来实现某个特定功能，在执行过程中不可被中断。
>
> * 原语一旦开始执行，就要连续执行完，不允许中断 [1] 。
>
> 它的功能是判断内存某个位置的值是否为预期值，如果是则更改为新的值，这个过程是原子的
>
> 
>
> > 我们都知道，CAS 是一条 CPU 的原子指令（cmpxchg 指令），不会造成所谓的数据不一致问题，`Unsafe` 提供的 CAS 方法（如 `compareAndSwapXXX`）底层实现即为 CPU 指令 `cmpxchg`
> >
> > ------
> >
> > 著作权归JavaGuide(javaguide.cn)所有 基于MIT协议 原文链接：https://javaguide.cn/java/basis/unsafe.html

##  1. 概念

==CAS并发原语体现在Java语言中就是sun.misc.Unsafe类的各个方法。==调用UnSafe类中的CAS方法，JVM会帮我们实现出CAS汇编指令，这是一种完全依赖于硬件的功能，通过它实现了原子操作，再次强调，由于CAS是一种系统原语，原语属于操作系统用于范畴，是由若干条指令组成，用于完成某个功能的一个过程，并且原语的执行必须是连续的，在执行过程中不允许被中断，也就是说CAS是一条CPU的原子指令，不会造成所谓的数据不一致的问题，也就是说**CAS是线程安全的**。

为什么能保证原子性：靠的底层汇编



<font color=red>CAS 可以看成这个方法 `atomicInteger.compareAndSet(expect, update);//期望值， 更新值` </font>



这个就类似于SVN或者Git的版本号，如果没有人更改过，就能够正常提交，否者需要先将代码pull下来，合并代码后，然后提交



## 2. 底层原理：Unsafe.class（rt.jar）+ CAS 思想（自旋）

> 多线程环境下不要用 `i++` 要用 `atomicInteger.getAndIncrement();`

这个方法其实底层调用的是 Unsafe 类下面的方法 

![image-20200310203030720](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202211121750557.png)

Unsafe是CAS的核心类，由于Java方法无法直接访问底层系统，需要通过本地（Native）方法来访问，Unsafe相当于一个后门，基于该类可以直接操作特定的内存数据。Unsafe类存在sun.misc包中，其内部方法操作可以像C的指针一样直接操作内存，因为Java中的CAS操作的执行依赖于Unsafe类的方法。

总结：==Unsafe  相当于jdk留的后门，可通过指针操作内存   有大量硬件级别的 CAS 原子操作==

```
注意Unsafe类的所有方法都是native修饰的，也就是说unsafe类中的方法都直接调用操作系统底层资源执行相应的任务
```

为什么Atomic修饰的包装类，能够保证原子性，依靠的就是底层的unsafe类

Unsafe就是根据内存偏移地址获取数据的。



## 3. 自旋锁源码

重要：看一下理解 √

为什么用 CAS（两者都保证） 不用 synchronized（只保证一致性不保证并发性）

![image-20200310210701761](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202211121801105.png)

var5：就是我们从主内存中拷贝到工作内存中的值(每次都要从主内存拿到最新的值到自己的本地内存，然后执行compareAndSwapInt()在再和主内存的值进行比较。因为线程不可以直接越过高速缓存，直接操作主内存，所以执行上述方法需要比较一次，在执行加1操作)

那么操作的时候，需要比较工作内存中的值，和主内存中的值进行比较

假设执行 compareAndSwapInt返回false，那么就一直执行 while方法，直到期望的值和真实值一样

- val1：AtomicInteger对象本身
- var2：该对象值得引用地址
- var4：需要变动的数量
- var5：用var1和var2找到的内存中的真实值
  - 用该对象当前的值与var5比较
  - 如果相同，更新var5 + var4 并返回true
  - 如果不同，继续取值然后再比较，直到更新完成

这里没有用synchronized，而用CAS，这样提高了并发性，也能够实现一致性，是因为每个线程进来后，进入的do while循环，然后不断的获取内存中的值，判断是否为最新，然后在进行更新操作。

假设线程A和线程B同时执行getAndInt操作（分别跑在不同的CPU上）

1. AtomicInteger里面的value原始值为3，即主内存中AtomicInteger的 value 为3，根据JMM模型，线程A和线程B各自持有一份价值为3的副本，分别存储在各自的工作内存
2. 线程A通过getIntVolatile(var1 , var2) 拿到value值3，这是线程A被挂起（该线程失去CPU执行权）
3. 线程B也通过getIntVolatile(var1, var2)方法获取到value值也是3，此时刚好线程B没有被挂起，并执行了compareAndSwapInt方法，比较内存的值也是3，成功修改内存值为4，线程B打完收工，一切OK
4. 这是线程A恢复，执行CAS方法，比较发现自己手里的数字3和主内存中的数字4不一致，说明该值已经被其它线程抢先一步修改过了，那么A线程本次修改失败，只能够重新读取后在来一遍了，也就是在执行do while
5. 线程A重新获取value值，因为变量value被volatile修饰，所以其它线程对它的修改，线程A总能够看到，线程A继续执行compareAndSwapInt进行比较替换，直到成功。

Unsafe类 + CAS思想： 也就是自旋，自我旋转

## 4. 底层汇编

Unsafe类中的compareAndSwapInt是一个本地方法，该方法的实现位于unsafe.cpp中

- 先想办法拿到变量value在内存中的地址
- 通过Atomic::cmpxchg实现比较替换，其中参数X是即将更新的值，参数e是原内存的值

## 5. CAS缺点

**CAS不加锁**，保证一次性，但是需要多次比较

- 循环时间长，开销大（因为执行的是do while，如果比较不成功一直在循环，最差的情况，就是某个线程一直取到的值和预期值都不一样，这样就会无限循环）
- 只能保证一个共享变量的原子操作
  - 当对一个共享变量执行操作时，我们可以通过循环CAS的方式来保证原子操作
  - 但是对于多个共享变量操作时，循环CAS就无法保证操作的原子性，这个时候只能用锁来保证原子性
- 引出来ABA问题？



## 6. ABA问题

> [狸猫换太子](../分布式锁/分布式锁全家桶#乐观锁)
>
> #### 连环套路：
>
> 从AtomicInteger引出下面的问题
>
> CAS -> Unsafe -> CAS底层思想 -> ABA -> 原子引用更新 -> 如何规避ABA问题



> 抛出问题

两个线程 t1、t2：t2执行比较快2s，t1慢要10s。（时间差）

主内存：A

t2 快把 A 改成 B，又改成 A

t1 可以执行了，看了下还是 A 觉得没问题！但真的没问题吗？（首尾是一样的，但中途有猫腻被改过）

**尽管线程t1的CAS操作成功，但是不代表这个过程就是没有问题的**



> ABA我听懂了，但是没想到什么场景会产生危害
>
> 
>
> > 假设有一个库存管理系统，其中有一个共享的原子变量`stock`表示某个商品的库存数量。
> >
> > 1. 初始状态：`stock`的值为10，表示商品的库存数量为10个。
> > 2. 线程A和线程B同时读取`stock`的值为10。
> > 3. 线程A将`stock`的值减少2，并执行一些操作。
> > 4. 线程B将`stock`的值减少3，并执行一些操作。
> > 5. 线程A将`stock`的值增加2，并执行一些操作。
> > 6. 线程B将`stock`的值增加3，并执行一些操作。
> >
> > 在这个简化的例子中，线程A和线程B分别对`stock`进行了多次操作，其中包括减少和增加操作。==由于CAS操作只关注`stock`的当前值，而不考虑过程中的变化，可能导致ABA问题的发生。==
> >
> > 假设线程A的操作执行顺序是减少2，然后增加2，此时`stock`的值仍为10，CAS操作可以成功。然而，线程B在线程A执行过程中执行了减少3和增加3的操作，并将`stock`的值从10减少到7，然后又增加回10。由于CAS操作只检查当前值与预期值是否相等，而不考虑过程中的变化，线程B的操作可能会被误判为未修改过`stock`的值。
> >
> > 为了解决这个问题，可以使用带有版本号的原子引用或其他适当的同步机制，以确保CAS操作同时考虑值的变化和状态的变化，避免ABA问题的发生。

我把太子换成狸猫，中途打了太子一顿，再换回太子。但中途太子受到了伤害

所以在A线程的10秒内，A并没有进行修改写回主物理内存
CAS的好处就是保证的数据一致性的同时，也保证了并发性
CPU底层的指令原语的原子性是在修改的时候保证不受其他线程抢断



> 解决：原子引用 + 新增一种机制，也就是修改版本号，类似于时间戳的概念

#### 原子引用

原子引用其实和原子包装类是差不多的概念，就是将一个java类，用原子引用类进行包装起来，那么这个类就具备了原子性

```java
		User z3 = new User("z3", 22);

        User l4 = new User("l4", 25);

        // 创建原子引用包装类
        AtomicReference<User> atomicReference = new AtomicReference<>();

        // 现在主物理内存的共享变量，为z3
        atomicReference.set(z3);

        // 比较并交换，如果现在主物理内存的值为z3，那么交换成l4
        System.out.println(atomicReference.compareAndSet(z3, l4) + "\t " + atomicReference.get().toString());

        // 比较并交换，现在主物理内存的值是l4了，但是预期为z3，因此交换失败
        System.out.println(atomicReference.compareAndSet(z3, l4) + "\t " + atomicReference.get().toString());
```

#### 版本号

也就是每次更新的时候，需要比较期望值和当前值，以及期望版本号和当前版本号





##  [7. LongAdder（CAS机制优化）](https://gitee.com/moxi159753/LearningNotes/blob/master/%E6%A0%A1%E6%8B%9B%E9%9D%A2%E8%AF%95/JUC/3_%E8%B0%88%E8%B0%88%E5%8E%9F%E5%AD%90%E7%B1%BB%E7%9A%84ABA%E9%97%AE%E9%A2%98/6_%E5%8E%9F%E5%AD%90%E7%B1%BBAtomicInteger%E7%9A%84ABA%E9%97%AE%E9%A2%98/README.md#longaddercas%E6%9C%BA%E5%88%B6%E4%BC%98%E5%8C%96)

但是这个CAS有没有问题呢？肯定是有的。比如说大量的线程同时并发修改一个AtomicInteger，可能有**很多线程会不停的自旋**，进入一个无限重复的循环中。

这些线程不停地获取值，然后发起CAS操作，但是发现这个值被别人改过了，于是再次进入下一个循环，获取值，发起CAS操作又失败了，再次进入下一个循环。

在大量线程高并发更新AtomicInteger的时候，这种问题可能会比较明显，导致大量线程空循环，自旋转，性能和效率都不是特别好。

于是，当当当当，Java 8推出了一个新的类，**LongAdder**，他就是尝试使用分段CAS以及自动分段迁移的方式来大幅度提升多线程高并发执行CAS操作的性能！



# 三、Java 锁

## 1）Java锁之公平锁和非公平锁

### 1. 概念

#### 公平锁

是指多个线程按照申请锁的顺序来获取锁，类似于排队买饭，先来后到，先来先服务，就是公平的，也就是队列

#### 非公平锁

是指多个线程获取锁的顺序，并不是按照申请锁的顺序，有可能申请的线程比先申请的线程优先获取锁，在高并发环境下，有可能造成优先级翻转，或者饥饿的线程（也就是某个线程一直得不到锁）

#### 如何创建

并发包中ReentrantLock的创建可以指定析构函数的boolean类型来得到公平锁或者非公平锁，默认是非公平锁

```java
/**
* 创建一个可重入锁，true 表示公平锁，false 表示非公平锁。默认非公平锁
*/
Lock lock = new ReentrantLock(true);

####### 两个构造方法
/**
* Creates an instance of ReentrantLock with the given fairness policy.
* Params: fair – true if this lock should use a fair ordering policy
*/
public ReentrantLock(boolean fair) {
    sync = fair ? new FairSync() : new NonfairSync();
}

/**
* Creates an instance of {@code ReentrantLock}.
* This is equivalent to using {@code ReentrantLock(false)}.
*/
public ReentrantLock() {
    sync = new NonfairSync();
}
```

#### 两者区别

**公平锁**：就是很公平，在并发环境中，每个线程在获取锁时会先查看此锁维护的等待队列，如果为空，或者当前线程是等待队列中的第一个，就占用锁，否者就会加入到等待队列中，以后安装FIFO的规则从队列中取到自己

**非公平锁：** 非公平锁比较粗鲁，上来就直接尝试占有锁，如果尝试失败，就再采用类似公平锁那种方式。

#### 题外话

Java ReenttrantLock通过构造函数指定该锁是否公平，默认是非公平锁，因为非公平锁的优点在于吞吐量比公平锁大，==`对于synchronized而言，也是一种非公平锁`==





## 2）可重入锁和递归锁ReentrantLock

### 概念

> 可重入锁就是递归锁（例如湘就是湖南）
>
> GPT 真正理解了：A->B(inner->A)
>
> 假设有一个方法 A，它是一个 synchronized 方法，然后在方法 A 中调用了另一个方法 B，也是一个 synchronized 方法，而且方法 B 中又调用了方法 A，那么就会出现死锁的问题。这是因为当方法 A 调用方法 B 时，它已经获取了方法 A 所对应的锁，但是当方法 B 又调用方法 A 时，由于方法 A 已经被锁住了，所以它无法获得方法 A 所对应的锁，从而导致死锁的问题。
>
> 如果使用可重入锁，就可以避免出现这种死锁的问题。在可重入锁中，同一个线程在获取同一个锁的时候，**只需要增加该锁的计数器即可，而不需要重新获取锁**，所以即使在方法 A 中调用方法 B，也不会出现死锁的问题。这就是可重入锁的好处。

指的是同一线程外层函数获得锁之后，内层递归函数仍然能获取到该锁的代码，在同一线程在外层方法获取锁的时候，在进入内层方法会自动获取锁

也就是说：`线程可以进入任何一个它已经拥有的锁所同步的代码块`

ReentrantLock / Synchronized 就是一个典型的可重入锁



###  代码

可重入锁就是，在一个method1方法中加入一把锁，方法2也加锁了，那么他们拥有的是同一把锁

```java
public synchronized void method1() {
	method2();
}

public synchronized void method2() {

}
```

也就是说我们只需要进入method1后，那么它也能直接进入method2方法，因为他们所拥有的锁，是同一把。

比喻：进了大门，厕所卧室就不需要加锁了



### 作用

🤺 ==可重入锁的最大作用就是避免死锁==





## 3） 自旋锁

自旋锁：spinlock，是指尝试获取锁的线程不会立即阻塞，而是采用循环的方式去尝试获取锁，这样的好处是减少线程上下文切换的消耗，缺点是循环会消耗CPU

原来提到的比较并交换，底层使用的就是自旋，自旋就是多次尝试，多次访问，不会阻塞的状态就是自旋。

####  优缺点

优点：循环比较获取直到成功为止，没有类似于wait的阻塞

缺点：当不断自旋的线程越来越多的时候，会因为执行while循环不断的消耗CPU资源





## 4） 独占锁（写锁） / 共享锁（读锁） / 互斥锁

> 多个线程 同时读一个资源类没有任何问题，所以为了满足并发量，读取共享资源应该可以同时进行，但是如果一个线程想去写共享资源，就不应该再有其它线程可以对该资源进行读或写

读-读：能共存

读-写：不能共存

写-写：不能共存



```java
/**
* 创建一个读写锁
* 它是一个读写融为一体的锁，在使用的时候，需要转换
*/
private ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();

// 创建一个写锁
rwLock.writeLock().lock();
// 写锁 释放
rwLock.writeLock().unlock();


// 创建一个读锁
rwLock.readLock().lock();
// 读锁 释放
rwLock.readLock().unlock();
```

写入操作是一个一个线程进行执行的，并且中间不会被打断，而读操作的时候，是同时5个线程进入，然后并发读取操作



## 5）为什么Synchronized无法禁止指令重排，却能保证有序性

> as-if-serial 学习，拔高自己的高度！（现在看的迷迷糊糊）

### 前言

首先我们要分析下这道题，这简单的一个问题，其实里面还是包含了很多信息的，要想回答好这个问题，面试者至少要知道一下概念：

- Java内存模型
- 并发编程有序性问题
- 指令重排
- synchronized锁
- 可重入锁
- 排它锁
- as-if-serial语义
- 单线程&多线程

### 标准解答

为了进一步提升计算机各方面能力，在硬件层面做了很多优化，如处理器优化和指令重排等，但是这些技术的引入就会导致有序性问题。

> 先解释什么是有序性问题，也知道是什么原因导致的有序性问题

我们也知道，最好的解决有序性问题的办法，就是禁止处理器优化和指令重排，就像volatile中使用内存屏障一样。

> 表明你知道啥是指令重排，也知道他的实现原理

==但是，虽然很多硬件都会为了优化做一些重排，但是在Java中，不管怎么排序，都不能影响单线程程序的执行结果。这就是as-if-serial语义，所有硬件优化的前提都是必须遵守as-if-serial语义。==

as-if-serial语义把**单线程**程序保护了起来，遵守as-if-serial语义的编译器，runtime 和处理器共同为编写单线程程序的程序员创建了一个幻觉：单线程程序是按程序的顺序来执行的。as-if-serial语义使单线程程序员无需担心重排序会 干扰他们，也无需担心内存可见性问题。

> 重点！解释下什么是as-if-serial语义，因为这是这道题的第一个关键词，答上来就对了一半了

再说下synchronized，他是Java提供的锁，可以通过他对Java中的对象加锁，并且他是一种排他的、可重入的锁。

所以，当某个线程执行到一段被synchronized修饰的代码之前，会先进行加锁，执行完之后再进行解锁。在加锁之后，解锁之前，其他线程是无法再次获得锁的，只有这条加锁线程可以重复获得该锁。

> 介绍synchronized的原理，这是本题的第二个关键点，到这里基本就可以拿满分了。

synchronized通过排他锁的方式就保证了同一时间内，被synchronized修饰的代码是单线程执行的。所以呢，这就满足了as-if-serial语义的一个关键前提，那就是**单线程**，因为有as-if-serial语义保证，单线程的有序性就天然存在了。

### 来源

[https://mp.weixin.qq.com/s/Pd6dOXaMQFUHfAUnOhnwtw](https://mp.weixin.qq.com/s/Pd6dOXaMQFUHfAUnOhnwtw)



# 四、JUC 常用 API

> 基本看例子理解了就行

## 1）CountDownLatch 闭锁

> 指定第八个线程 main 得在其余 7 个线程执行完才能执行（计数器倒计数为0就执行）

### 概念

让一些线程阻塞直到另一些线程完成一系列操作才被唤醒

CountDownLatch主要有两个方法，当一个或多个线程调用await方法时，调用线程就会被阻塞。其它线程调用CountDown方法会将计数器减1（调用CountDown方法的线程不会被阻塞），当计数器的值变成零时，因调用await方法被阻塞的线程会被唤醒，继续执行

### 场景

现在有这样一个场景，假设一个自习室里有7个人，其中有一个是班长，班长的主要职责就是在其它6个同学走了后，关灯，锁教室门，然后走人，因此班长是需要最后一个走的，那么有什么方法能够控制班长这个线程是最后一个执行，而其它线程是随机执行的

### 解决方案

这个时候就用到了CountDownLatch，计数器了。我们一共创建6个线程，然后计数器的值也设置成6

```
// 计数器
CountDownLatch countDownLatch = new CountDownLatch(6);
```

然后每次学生线程执行完，就让计数器的值减1

```
for (int i = 0; i <= 6; i++) {
    new Thread(() -> {
        System.out.println(Thread.currentThread().getName() + "\t 上完自习，离开教室");
        countDownLatch.countDown();
    }, String.valueOf(i)).start();
}
```

最后我们需要通过CountDownLatch的await方法来控制班长主线程的执行，这里 countDownLatch.await()可以想成是一道墙，**只有当计数器的值为0的时候，墙才会消失，主线程才能继续往下执行**

```
countDownLatch.await();

System.out.println(Thread.currentThread().getName() + "\t 班长最后关门");
```

不加CountDownLatch的执行结果，我们发现main线程提前已经执行完成了

```
1	 上完自习，离开教室
0	 上完自习，离开教室
main	 班长最后关门
2	 上完自习，离开教室
3	 上完自习，离开教室
4	 上完自习，离开教室
5	 上完自习，离开教室
6	 上完自习，离开教室
```

引入CountDownLatch后的执行结果，我们能够控制住main方法的执行，这样能够保证前提任务的执行

```
0	 上完自习，离开教室
2	 上完自习，离开教室
4	 上完自习，离开教室
1	 上完自习，离开教室
5	 上完自习，离开教室
6	 上完自习，离开教室
3	 上完自习，离开教室
main	 班长最后关门
```

### 完整代码

```java
public static void main(String[] args) throws InterruptedException {
        CountDownLatch countDownLatch = new CountDownLatch(7);

        for (int i = 0; i <= 6; i++) {
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + "\t 上完自习，离开教室");
                countDownLatch.countDown();
            }, String.valueOf(i)).start();
        }

        countDownLatch.await();
        System.out.println(Thread.currentThread().getName() + "\t 班长最后关门");
    }
```





## 2）CyclicBarrier

> 第一个线程执行的条件：后七个执行完才能执行

### 概念

和CountDownLatch相反，需要集齐七颗龙珠，召唤神龙。也就是做加法，开始是0，加到某个值的时候就执行

CyclicBarrier的字面意思就是可循环（cyclic）使用的屏障（Barrier）。它要求做的事情是，让一组线程到达一个屏障（也可以叫同步点）时被阻塞，直到最后一个线程到达屏障时，屏障才会开门，所有被屏障拦截的线程才会继续干活，线程进入屏障通过CyclicBarrier的await方法

### 案例

集齐7个龙珠，召唤神龙的Demo，我们需要首先创建CyclicBarrier

```
/**
* 定义一个循环屏障，参数1：需要累加的值，参数2 需要执行的方法
*/
CyclicBarrier cyclicBarrier = new CyclicBarrier(7, () -> {
	System.out.println("召唤神龙");
});
```

然后同时编写七个线程，进行龙珠收集，但一个线程收集到了的时候，我们需要让他执行await方法，等待到7个线程全部执行完毕后，我们就执行原来定义好的方法

```
        for (int i = 0; i < 7; i++) {
            final Integer tempInt = i;
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + "\t 收集到 第" + tempInt + "颗龙珠");

                try {
                    // 先到的被阻塞，等全部线程完成后，才能执行方法
                    cyclicBarrier.await();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
            }, String.valueOf(i)).start();
        }
```

### 完整代码

```java
public static void main(String[] args) {
        //定义一个循环屏障，参数1：需要累加的值（在触发障碍之前必须调用的线程数量），参数2 需要执行的方法
        CyclicBarrier barrier = new CyclicBarrier(7, () -> {
            System.out.println("召唤神龙");
        });

        for (int i = 0; i < 7; i++) {
            final Integer tempInt = i;
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + "\t 收集到 第" + tempInt + "颗龙珠");
                try {
                    // 先到的被阻塞，等全部线程完成后，才能执行方法
                    // 我的理解：需要7个线程摸一下这个方法
                    barrier.await();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }, String.valueOf(i)).start();
        }
    }
```





## 3）Semaphore：信号量

### 概念

信号量主要用于两个目的

- 一个是用于共享资源的互斥使用
- 另一个用于并发线程数的控制

### 代码

我们模拟一个抢车位的场景，假设一共有6个车，3个停车位

那么我们首先需要定义信号量为3，也就是3个停车位

```java
/**
* 初始化一个信号量为3，默认是false 非公平锁， 模拟3个停车位
*/
Semaphore semaphore = new Semaphore(3, false);
```

然后我们模拟6辆车同时并发抢占停车位，但第一个车辆抢占到停车位后，信号量需要减1

```java
// 代表一辆车，已经占用了该车位
semaphore.acquire(); // 抢占
```

同时车辆假设需要等待3秒后，释放信号量

```java
// 每个车停3秒
try {
	TimeUnit.SECONDS.sleep(3);
} catch (InterruptedException e) {
	e.printStackTrace();
}
```

最后车辆离开，释放信号量

```java
// 释放停车位
semaphore.release();
```

### 完整代码

```java
public static void main(String[] args) {
        // 还有一个构造方法只填数，默认非公平锁 NonfairSync
        // 模拟3个停车位
        Semaphore semaphore = new Semaphore(3, false);

        // 模拟6部车
        for (int i = 1; i <= 6; i++) {
            new Thread(() -> {
                try {
                    // 代表一辆车，已经占用了该车位
                    semaphore.acquire();
                    System.out.println(Thread.currentThread().getName() + "\t 抢到车位");
                    // 每个车停3秒
                    TimeUnit.SECONDS.sleep(3);
                    System.out.println(Thread.currentThread().getName() + "\t 离开车位");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    // 释放停车位
                    semaphore.release();
                }
            }, String.valueOf(i)).start();
        }
    }
```



## 4）阻塞队列

> **只有知道阻塞队列，才能真正懂线程池。我这里没有深入【待补】**

### 概念

- `当阻塞队列是空时，从队列中获取元素的操作将会被阻塞`
  - 当蛋糕店的柜子空的时候，无法从柜子里面获取蛋糕
- `当阻塞队列是满时，从队列中添加元素的操作将会被阻塞`
  - 当蛋糕店的柜子满的时候，无法继续向柜子里面添加蛋糕了

也就是说 试图从空的阻塞队列中获取元素的线程将会被阻塞，直到其它线程往空的队列插入新的元素

同理，试图往已经满的阻塞队列中添加新元素的线程，直到其它线程往满的队列中移除一个或多个元素，或者完全清空队列后，使队列重新变得空闲起来，并后续新增

###  为什么要用？

去海底捞吃饭，大厅满了，需要进候厅等待，但是这些等待的客户能够对商家带来利润，因此我们非常欢迎他们阻塞

在多线程领域：所谓的阻塞，在某些清空下会挂起线程（即阻塞），一旦条件满足，被挂起的线程又会自动唤醒



####  为什么需要BlockingQueue

好处是我们**不需要关心什么时候需要阻塞线程，什么时候需要唤醒线程**，因为这一切BlockingQueue都帮你一手包办了

在concurrent包发布以前，在多线程环境下，我们每个程序员都必须自己取控制这些细节，尤其还要兼顾效率和线程安全，而这会给我们的程序带来不小的复杂度。



### 生产者消费者模式

有个虚假唤醒问题，需要用 while 循坏。我这里暂时掠过，用到的时候再回头看[别人笔记](https://gitee.com/moxi159753/LearningNotes/blob/master/%E6%A0%A1%E6%8B%9B%E9%9D%A2%E8%AF%95/JUC/8_%E9%98%BB%E5%A1%9E%E9%98%9F%E5%88%97/README.md#%E7%94%9F%E6%88%90%E8%80%85%E5%92%8C%E6%B6%88%E8%B4%B9%E8%80%8530) Coding

在回顾发现一个虚假唤醒的 https://blog.csdn.net/jerry11112/article/details/114481542



## 5）Synchronized和Lock的区别

### 前言	

早期的时候我们对线程的主要操作为：

- synchronized wait notify

然后后面出现了替代方案

- lock await signal

![image-20200317101210376](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202211261015124.png)

### 问题

#### synchronized 和 lock 有什么区别？用新的lock有什么好处？举例说明

- synchronized 和 lock 有什么区别？用新的lock有什么好处？举例说明

1）synchronized属于JVM层面，属于java的关键字

-  monitorenter（底层是通过**monitor**对象来完成，其实wait/notify等方法也依赖于monitor对象 只能在同步块或者方法中才能调用 wait/ notify等方法）
- Lock是**具体类**（java.util.concurrent.locks.Lock）是api层面的锁   **new**

javap 看底层

![image-20221126101938997](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202211261019143.png)

2）使用方法：

- synchronized：不需要用户去手动释放锁，当synchronized代码执行后，系统会自动让线程释放对锁的占用
- ReentrantLock：则需要用户去手动释放锁，若没有主动释放锁，就有可能出现死锁的现象，需要lock() 和 unlock() 配置try catch语句来完成

3）等待是否中断

- synchronized：不可中断，除非抛出异常或者正常运行完成
- ReentrantLock：可中断，可以设置超时方法
  - 设置超时方法，trylock(long timeout, TimeUnit unit)
  - lockInterrupible() 放代码块中，调用interrupt() 方法可以中断

4）加锁是否公平

- synchronized：非公平锁
- ReentrantLock：默认非公平锁，构造函数可以传递boolean值，true为公平锁，false为非公平锁

5）锁绑定多个条件Condition

- synchronized：没有，要么随机，要么全部唤醒
- ReentrantLock：用来实现分组唤醒需要唤醒的线程，可以==精确唤醒==，而不是像synchronized那样，要么随机，要么全部唤醒
  - 精准唤醒 synchronized 能实现，但是很麻烦



==我的问题：Condition 的作用==

简单点，就是替代对象监视器了。它的两个常用方法分别是`await()`和`signal()`，相当于之前的`wait()`和`notify()`。我们具体来看代码实现

```java
package com.zzq.vlt;


import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Synchronized 和 Lock的区别
 */

class ShareResource {
    // A 1   B 2   c 3
    private int number = 1;
    // 创建一个重入锁
    private Lock lock = new ReentrantLock();

    // 这三个相当于备用钥匙
    private Condition condition1 = lock.newCondition();
    private Condition condition2 = lock.newCondition();
    private Condition condition3 = lock.newCondition();


    public void print5() {
        lock.lock();
        try {
            // 判断
            while (number != 1) {
                // 不等于1，需要等待
                condition1.await();
            }

            // 干活
            for (int i = 0; i < 5; i++) {
                System.out.println(Thread.currentThread().getName() + "\t " + number + "\t" + i);
            }

            // 唤醒 （干完活后，需要通知B线程执行）
            number = 2;
            // 通知2号去干活了
            condition2.signal();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }

    public void print10() {
        lock.lock();
        try {
            // 判断
            while (number != 2) {
                // 不等于2，需要等待
                condition2.await();
            }

            // 干活
            for (int i = 0; i < 10; i++) {
                System.out.println(Thread.currentThread().getName() + "\t " + number + "\t" + i);
            }

            // 唤醒 （干完活后，需要通知C线程执行）
            number = 3;
            // 通知2号去干活了
            condition3.signal();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }

    public void print15() {
        lock.lock();
        try {
            // 判断
            while (number != 3) {
                // 不等于3，需要等待
                condition3.await();
            }

            // 干活
            for (int i = 0; i < 15; i++) {
                System.out.println(Thread.currentThread().getName() + "\t " + number + "\t" + i);
            }

            // 唤醒 （干完活后，需要通知C线程执行）
            number = 1;
            // 通知1号去干活了
            condition1.signal();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
}

public class SyncAndReentrantLockDemo {

    public static void main(String[] args) {

        ShareResource shareResource = new ShareResource();

        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                shareResource.print5();
            }
        }, "A").start();

        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                shareResource.print10();
            }
        }, "B").start();

        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                shareResource.print15();
            }
        }, "C").start();
    }
}
```





# [五、异步&线程池](../gulimall/07、异步&线程池.pdf)

> 主要是 GUlimall Movies + 部分 JUC Movies

## 1.异步

> 注意：测试类测不出多线程的效果   
>
> 原因：junit在运行时，在主线程结束后就关闭了进程，不会等待各个线程运行结束，junit源码可见

### 1.1 初始化线程的 4 种方式

> 1）、继承 Thread 2）、实现 Runnable 接口 3）、实现 Callable 接口 + FutureTask （可以拿到返回结果，可以处理异常）4）、线程池

都是靠着 Thread 的 start() 启动，而new的这个 Thread 都是直接或者间接实现了 Runnable 接口



#### 1）Thread 方式启动

​        `new thread01().start();`

#### 2）Runnable

​        `new Thread(new runnable01()).start();`

#### 3）Callable+FutureTask 【陌生】

```java
/*好像相对上面两个来说 可以拿返回值！！！这才是重点*/
//以下语句也可替换成线程池版本  Future<Singleton04> futureTask1 = pool.submit(callable);
FutureTask<Integer> futureTask = new FutureTask<>(new callable01());  //FutureTask 间接实现了 Runnable
 new Thread(futureTask).start();
 //阻塞等待整个线程执行完成,获取返回结果    你可以把这个get放在逻辑最后面,不影响其他逻辑的执行
 System.out.println(futureTask.get());  //get()获取 run()的返回值
```



<center>以上三种都不能控制资源，只有线程池能控制 性能稳定</center>

***

==4）线程池【ExecutorService】==



<center>Tips: 四种实现方式追其底层，其实只有一种，实现Runnble</center>

## ==2.线程池==

### 2.1 池化技术

> 比较常用的池化技术还是很多：1）线程池 2）连接池 3）内存池 4）对象池

Java中的线程池是通过Executor框架实现的，该框架中用到了Executor，Executors，ExecutorService，ThreadPoolExecutor这几个类。

补充-代码书写规范：一般 Set 注入，构造方法注入。能传接口就传接口（写：足够的抽象往高处写。传：足够的落地往细节传）

**屁股后带 s 的辅助工具类：**

* Array Arrays
* Collection Colletcions
* Executor Executors



### 2.2 线程池实际中使用哪一个

> （超级大坑警告）你在工作中单一的/固定数的/可变的三种创建线程池的方法，你用那个多？
>
> 答案是一个都不用，我们生产上只能使用自定义的
>
> Executors vs `ThreadPoolExecutor`

#### 1）Executors 工具类

```java
//注意这个是属性，但是最好还是在方法中先写会有提示！然后再剪切到属性。
//不然光在属性中写点方法没提示不说左边也不给自动生成，光只有右半边会报错就又要去源码copy
public static ExecutorService pool = Executors.newFixedThreadPool(10);//注意带了 s 是Executors工具类
pool.execute(new thread01()); //给线程池直接提交任务  注意submit() 有返回值，execute()没
```



#### 2）new ThreadPoolExecutor(线程池七大参数)

参数是面试重点  ---> 线程池建议用原生是为了规避资源耗尽的风险，也就是 OOM

1. `corePoolSize` – the number of threads to keep in the pool, even if they are idle, unless allowCoreThreadTimeOut is set
2. `maximumPoolSize` – the maximum number of threads to allow in the pool
3. `keepAliveTime` – when the number of threads is greater than the core, this is the maximum time that excess idle threads will wait for new tasks before terminating.  
   * 解雇临时工，针对核心线程数外的线程超出这个时间还没有被使用就解雇

4. `unit` – the time unit for the keepAliveTime argument
5. `workQueue` – the queue to use for holding tasks before they are executed. This queue will hold only the Runnable tasks submitted by the execute method. 
   * 阻塞队列-如果任务有很多,就会将目前多的任务放在队列里面。只要有线程空闲,就会去队列里面取出新的任务继续执行
6. `threadFactory` – the factory to use when the executor creates a new thread 
   * 一般默认的，除非想自定义比如想给线程名字一个约束
7. `RejectedExecutionHandler handler` – the handler to use when execution is blocked because the thread bounds and queue capacities are reached
   * 如果队列和maximumPoolSize要满了,按照我们指定的拒绝策略拒绝执行任务
   * 丢老的 DiscardOldestPolicy、丢新的AbortPolicy 抛异常  DiscardPolicy 不抛、只执行run方法[同步]CallerRunsPolicy...

#### 3）运行流程： 

1. 线程池创建，准备好 core 数量的核心线程，准备接受任务 
2. 新的任务进来，用 core 准备好的空闲线程执行。 
   1. core 满了，就将再进来的任务放入阻塞队列中。空闲的core 就会自己去阻塞队列获取任务执行 
   2. 阻塞队列满了，就直接开新线程执行，最大只能开到 max 指定的数量
   3. max 都执行好了。Max-core 数量空闲的线程会在 keepAliveTime 指定的时间后自动销毁。最终保持到 core 大小 
   4. 如果线程数开到了 max 的数量，还有新任务进来，就会使用reject 指定的拒绝策略进行处理 
3. 所有的线程创建都是由指定的 factory 创建的。

```java
new ThreadPoolExecutor(5,
                200,
                10,
                TimeUnit.SECONDS,
                new LinkedBlockingQueue<>(100000), //这里注意要填 capacity 不填默认 this(Integer.MAX_VALUE); 内存不够
                Executors.defaultThreadFactory(),
                new ThreadPoolExecutor.AbortPolicy());//抛出异常，并且丢弃掉任务
```



#### 4）面试： 一个线程池 core 7； max 20 ，queue：50，100 并发进来怎么分配的；

先有 7 个能直接得到执行，接下来 50 个进入队列排队，在多开 13 个继续执行。现在70 个被安排上了。剩下 30 个默认拒绝策略。



#### 5）Executors 常见的 4 种线程池

* newCachedThreadPool：创建一个可缓存线程池，如果线程池长度超过处理需要，可灵活回收空闲线程，若无可回收，则新建线程
* newFixedThreadPool：创建一个定长线程池，可控制线程最大并发数，超出的线程会在队列中等待。
* newScheduledThreadPool：创建一个定长线程池，支持定时及周期性任务执行。
* newSingleThreadExecutor：创建一个单线程化的线程池，它只会用唯一的工作线程来执行任务，保证所有任务按照指定顺序(FIFO, LIFO, 优先级)执行。【秒杀确保数据一致性】

#### 6）Executors 中JDK已经给你提供了，为什么不用?

> 3.【强制】**线程资源必须通过线程池提供，不允许在应用中自行显式创建线程。**
>
> 说明：线程池的好处是减少在创建和销毁线程上所消耗的时间以及系统资源的开销，解决资源不足的问题。 如果不使用线程池，有可能造成系统创建大量同类线程而导致消耗完内存或者“过度切换”的问题。
>
> 4.【强制】**线程池不允许使用 Executors 去创建，而是通过 ThreadPoolExecutor 的方式，这样的处理方式让写的同学更加明确线程池的运行规则，`规避资源耗尽的风险`**。
>
> 说明：Executors 返回的线程池对象的弊端如下：
>
> 1） FixedThreadPool 和 SingleThreadPool： 允许的请求队列长度为 Integer.MAX_VALUE，可能会堆积大量的请求，从而导致 OOM。
>
> 2） CachedThreadPool： 允许的创建线程数量为 Integer.MAX_VALUE，可能会创建大量的线程，从而导致 OOM。
>
> [阿里巴巴《Java 开发手册》](https://developer.aliyun.com/topic/download?spm=a2c6h.15028928.J_5293118740.2&id=805)



#### 7）开发中为什么使用线程池

* 降低资源的消耗
  * 通过重复利用已经创建好的线程降低线程的创建和销毁带来的损耗
* 提高响应速度
  * 因为线程池中的线程数没有超过线程池的最大上限时，有的线程处于等待分配任务的状态，当任务来时无需创建新的线程就能执行
* 提高线程的可管理性
  * 线程池会根据当前系统特点对池内的线程进行优化处理，减少创建和销毁线程带来的系统开销。无限的创建和销毁线程不仅消耗系统资源，还降低系统的稳定性，使用线程池进行统一分配



#### 8）项目中使用

##### 一、MyThreadConfig.java

```java
@Bean
public ThreadPoolExecutor getPool(ThreadPoolConfigProperties properties) //properties放前3个常用的参数
```

##### 二、ThreadPoolConfigProperties.java

```java
@Component
@ConfigurationProperties(prefix = "gulimall.thread")
@Data
public class ThreadPoolConfigProperties
```

##### 三、Use

```java
@Autowired
private ThreadPoolExecutor executor;

结合 CompletableFuture 使用，这个类的一些API第二个参数就放上面注入的线程池！
```



## ==3.CompletableFuture 异步编排==

> Promise 的感觉， 嵌套 调用，变成 链式 调用        能提升系统的性能和吞吐量！
>
> > vs @Async
> >
> > 需要注意的是，`@Async` 是基于线程池的异步执行方式，而 `CompletableFuture` 可以更加灵活地控制异步执行的方式，例如使用指定的线程池、设置超时等。
> >
> > 这是 `@Async` 和 `CompletableFuture` 两种常见的异步编程方式，你可以根据具体的需求选择合适的方式来实现异步操作。

业务场景： 查询商品详情页的逻辑比较复杂，有些数据还需要远程调用，必然需要花费更多的时间。

<img src="https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202212311607836.png" alt="image-20221231160756132" style="zoom: 67%;" />

假如商品详情页的每个查询，需要如下标注的时间才能完成 那么，用户需要 5.5s 后才能看到商品详情页的内容。很显然是不能接受的。`如果有多个线程同时完成这 6 步操作，也许只需要 1.5s 即可完成响应。`

还需要考虑关联性，例如 4 需要 1、2、3 的结果才能执行 -> 异步编排，别的线程需要这个结果，肯定的拿到这个结构来能执行啊 Future.get() 会阻塞



#### 1）whenComplete(res,exception) 方法完成后的感知，看下面例子

#### 2）handle(res,exception) 方法完成后的处理，相对上面可以 return

```java
		public static ExecutorService pool = Executors.newFixedThreadPool(10);

		CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> {//如调用 runAsync() 则是不带返回值
            System.out.println(Thread.currentThread().getName() + " Begin.");
            int c = 10 / 0;
            System.out.println(Thread.currentThread().getName() + " End.");
            return c;
        }, pool).whenComplete((res,exception)->{
            //虽然能得到异常信息,但是没法修改返回数据.
            System.out.println("异步任务成功完成了...结果是:"+res+";异常是:"+exception);
        }).exceptionally(throwable -> {
            //可以感知异常,同时返回默认值
            return 10;
        });
        Integer integer = future.get();
```

#### 3）线程串行化方法

下面这三组API区别：是否需要拿上一个的返回值，以及自己是不是要return  -> 第一组感知上个返回值自己也返回、二、感知上个返回值、三、只执行

倒着看由简入繁

<img src="https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202212311649553.png" alt="image-20221231164942303" style="zoom: 67%;" />



#### 4）两任务组合 - 都要完成  -> 解决上面一开始说的关联性的问题

任务一二完后我才做 xxx / 这两个任务完成其中一个我就开始 / 所有任务执行完我才做    一些API同串行化的感觉返回值要不要那一块





### 3）项目中使用

图上的6步执行获取6个CompletableFuture，最后CompletableFuture.allOf再return

`com.zzq.gulimall.product.service.impl.SkuInfoServiceImpl#item`



此方法的应用之一是在继续程序之前等待一组独立的CompletableFutures完成，如： `CompletableFuture.allOf(c1, c2, c3).join();`

一般方法后面要给个 CompletableFuture.allOf 等异步方法都完成后才能放数据之类的操作。。。









# 六、死锁

> 死锁很难人为干预，只能说是预防

**发生死锁的四个条件**：

1. 互斥条件，线程使用的资源至少有一个不能共享的。
2. 至少有一个线程必须持有一个资源**且**正在等待获取一个当前被别的线程持有的资源。
3. 资源不能被抢占。
4. 循环等待。

**如何避免死锁：**

破坏发生死锁的四个条件其中之一即可。





从 线程池 和 死锁 开始就略过后面的了！！！





# 七、面试题

## # AQS

AQS 的全称为 `AbstractQueuedSynchronizer` ，翻译过来的意思就是抽象队列同步器。这个类在 `java.util.concurrent.locks` 包下面。

AQS 就是一个抽象类，主要用来构建锁和同步器

AQS 为构建锁和同步器提供了一些通用功能的实现，因此，使用 AQS 能简单且高效地构造出应用广泛的大量的同步器，比如我们提到的 `ReentrantLock`，`Semaphore`，其他的诸如 `ReentrantReadWriteLock`，`SynchronousQueue`等等皆是基于 AQS 的

------

著作权归JavaGuide(javaguide.cn)所有 基于MIT协议 原文链接：https://javaguide.cn/java/concurrent/java-concurrent-questions-03.html





## # 了解锁升级吗？

> 中软猎头问到，我不会！           高级工程师问题

synchroinzed升级过程：无锁---->偏向锁----->轻量级锁(自旋锁)----->重量级锁

具体流程：

初次执行到synchronized代码块时候，锁对象变成偏向锁，偏向于第一个获得它的线程的锁，执行完同步代码块后，线程不主动释放偏向锁，第二次到达同步代码块时，线程会判断此时持有锁的线程是否是自己，正常则往下执行，由于没有释放锁，这里不需要重新加锁，性能高

有第二个线程加入锁竞争，偏向锁升级为轻量级锁，在锁竞争下，没有获得到锁的线程自旋：不停地循环判断是否能够成功获取锁，自旋线程会原地空耗CPU，执行不了任务，处于忙等状态，如果多个线程用一个锁但是没有锁竞争或者轻微锁竞争，synchronized用轻量级锁。轻量级锁的目的是用短时间忙等换取线程在用户态和内核态切换的开销。

如果锁竞争严重，某个达到最大自旋次数的线程会升级为重量级锁，后续线程尝试获取锁时，发现被占用的是重量级锁直接将自己挂起



【XD 这个up汇总的很好】

作者：raxcl
链接：https://www.nowcoder.com/discuss/465219671411773440?sourceSSR=users
来源：牛客网





## # ReenTrantLock和Synchronized区别

​    首先都是可重入锁，然后他们的区别主要有几个方面，第一个是锁的实现不同，

​        synchronized是JVM实现的关键字

​        ReentrantLock是JDK实现的类

​    第二个是性能，

​         synchronized与ReentrantLock大致相同，但是新版本Java对synchronized进行了很多优化，如自旋锁

​    第三个是等待可中断

​        可中断：当持有锁的线程长期不释放锁的时候，正在等待的线程可以选择放弃等待，处理其他事情

​        ReentrantLock可中断

​        synchronized不可中断

​    第四个是公平锁

​        synchronized的锁是非公平的

​        ReentranlLock默认非公平，也可以调为公平

​    第五个是可以实现选择性通知

​        一个ReentrantLock可以同时绑定多个Condition对象，可以指定线程信息去实现选择性通知

当时错误的回答：

说了分布式锁

面试官提示：可以结合业务场景去说

业务场景：防止用户点击多次，要保证只有一个请求能进方法里面（这里应该是同单据number下），需要加分布式锁，用单据号作为分布式锁的key，原理采用到了 ReentrantLock ,以及lua脚本去保证它的原子性



作者：raxcl
链接：https://www.nowcoder.com/discuss/465219671411773440?sourceSSR=users
来源：牛客网
