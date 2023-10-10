# JavaGuide

> [《Java面试指北》](https://www.yuque.com/snailclimb/mf2z3k?key=cnk4)
>
> 先放到这一个文件，再去和自己的笔记合并。。。按模块汇总到自己的里面

# 系统设计&场景题

## * 如何解决大文件上传问题?

如果你的项目涉及到文件上传的话,面试官很可能会问你这个问题.

我们先看第一个场景:大文件上传中途,突然失败  试想一个,你想上传一个5g的视频,上传进度到99%的时候,特么的,突然网络断了,这个时候,你发现自己竟然需要重新上传.我就问你抓狂不? 有没有解决办法呢?

答案就是:分片上传!
什么是分片上传呢

简单来说,我们只需要先将文件切分成多个文件分片,然后再上传这些小的文件分片.

**前端发送了所有文件分片之后,服务端再将这些文件分片进行合并即可.**



前端可以通过Blob.slice()方法来对文件进行切割(File 对象是继承Blob对象的,因此File对象也有slice()方法).
后端可以RandomAccessFile类帮助我们合并文件分片



# JAVA

## * JavaIO模型常见面试题总结

根据冯.诺依曼结构,计算机结构分为5大部分:运算器、控制器、存储器、输入设备、输出设备.

输入设备(比如键盘)和输出设备(比如显示屏)都属于外部设备. 网卡、硬盘这种既可以属于输入设备,也可以属于输出设备.
输入设备向计算机输入数据,输出设备接收计算机输出的数据.

从计算机结构的视角来看的话， I/O 描述了计算机系统与外部设备之间通信的过程。

***

**我们再先从应用程序的角度来解读一下 I/O。**

根据大学里学到的操作系统相关的知识：为了保证操作系统的稳定性和安全性，一个进程的地址空间划分为 **用户空间（User space） 和 内核 空间（Kernel space）** 

像我们平常运行的应用程序都是运行在用户空间，**只有内核空间才能进行系统态级别的资源有关的操作**，比如如文件管理、进程通信、内存管理等等。也就是说，我们想要进行 IO 操作，一定是要依赖内核空间的能力。
并且，用户空间的程序不能直接访问内核空间。

当想要执行 IO 操作时，由于没有执行这些操作的权限，只能发起系统调用请求操作系统帮忙完成。
因此，用户进程想要执行 IO 操作的话，必须通过 **系统调用** 来间接访问内核空间

我们在平常开发过程中接触最多的就是 **磁盘 IO（读写文件）** 和 **网络 IO（网络请求和响应）**

**从应用程序的视角来看的话，我们的应用程序对操作系统的内核发起 IO 调用（系统调用），操作系统负责的内核执行具体的 IO 操作。也就 是说，我们的应用程序实际上只是发起了 IO 操作的调用而已，具体 IO 的执行是由操作系统的内核来完成的。**

我们电脑上跑着的应用程序，其实是需要经过操作系统，才能做一些特殊操作，如磁盘文件读写、内存的读写等等。因为这些都是比较危险的操作，不可以由应用程序乱来，只能交给底层操作系统来。

当应用程序发起 I/O 调用后，会经历两个步骤： 

1. 内核等待 I/O 设备准备好数据 
2. 内核将数据从内核空间拷贝到用户空间。

### Java 中 3 种常见 IO 模型

#### BIO (Blocking I/O)

BIO 属于同步阻塞 IO 模型

同步阻塞 IO 模型中，应用程序发起 read 调用后，会一直阻塞，直到在内核把数据拷贝到用户空间。

![image-20230905102522350](http://image.zzq8.cn/img/202309051025531.png)

在客户端连接数量不高的情况下，是没问题的。但是，当面对十万甚至百万级连接的时候，传统的 BIO 模型是无能为力的。因此，我们需要 一种更高效的 I/O 处理模型来应对更高的并发量。

### NIO (Non-blocking/New I/O)

Java 中的 NIO 于 Java 1.4 中引入，对应 java.nio 包，提供了 Channel , Selector ， Buffer 等抽象。NIO 中的 N 可以理解为 Nonblocking，不单纯是 New。它支持面向缓冲的，基于通道的 I/O 操作方法。 对于高负载、高并发的（网络）应用，应使用 NIO 。

Java 中的 NIO 可以看作是 I/O 多路复用模型。也有很多人认为，Java 中的 NIO 属于同步非阻塞 IO 模型。 跟着我的思路往下看看，相信你会得到答案！ 我们先来看看 同步非阻塞 IO 模型。

![image-20230905132212180](http://image.zzq8.cn/img/202309051322615.png)

同步非阻塞 IO 模型中，应用程序会一直发起 read 调用，等待数据从内核空间拷贝到用户空间的这段时间里，线程依然是阻塞的，直到在内 核把数据拷贝到用户空间。

相比于同步阻塞 IO 模型，同步非阻塞 IO 模型确实有了很大改进。通过轮询操作，避免了一直阻塞。

但是，这种 IO 模型同样存在问题：应用程序不断进行 I/O 系统调用轮询数据是否已经准备好的过程是十分消耗 CPU 资源的。 这个时候，I/O 多路复用模型 就上场了。

（XD：感觉像CAS Unsafe自旋）

![image-20230905132406455](http://image.zzq8.cn/img/202309051324373.png)

IO 多路复用模型中，**线程首先发起 select 调用，询问内核数据是否准备就绪**，等内核把数据准备好了，用户线程再发起 read 调用。read 调 用的过程（数据从内核空间->用户空间）还是阻塞的。

目前支持 IO 多路复用的系统调用，有 select，epoll 等等。select 系统调用，是目前几乎在所有的操作系统上都有支持

* select 调用 ：内核提供的系统调用，它支持一次查询多个系统调用的可用状态。几乎所有的操作系统都支持。 

* epoll 调用 ：linux 2.6 内核，属于 select 调用的增强版本，优化了 IO 的执行效率。

IO 多路复用模型，通过减少无效的系统调用，减少了对 CPU 资源的消耗。

Java 中的 NIO ，有一个非常重要的**选择器 ( Selector )** 的概念，也可以被称为 **多路复用器**。通过它，只需要一个线程便可以管理多个客户端 连接。当客户端数据到了之后，才会为其服务。

![image-20230905132922223](http://image.zzq8.cn/img/202309051329784.png)

> Java NIO（New I/O）在设计上综合了两种模型的特性：I/O 多路复用和同步非阻塞 I/O。
>
> 1. I/O 多路复用模型：NIO 使用选择器（Selector）来实现 I/O 多路复用。选择器允许一个线程同时监听多个通道的事件，例如读就绪或写就绪。这种机制允许一个线程同时处理多个连接，而不需要为每个连接创建一个线程。这是 I/O 多路复用模型的特点。
> 2. 同步非阻塞 I/O 模型：NIO 提供了非阻塞的 I/O 操作方式，这意味着当一个通道没有数据可读取时，读取操作不会阻塞线程，而会立即返回。类似地，当一个通道不能立即写入数据时，写入操作也不会阻塞线程。这种机制使得线程可以在等待 I/O 操作完成的同时继续执行其他任务，而不会被阻塞。这是同步非阻塞 I/O 模型的特点。
>
> 因此，Java NIO 结合了 I/O 多路复用和同步非阻塞 I/O 模型的特性。通过选择器进行 I/O 多路复用，以及使用非阻塞的方式进行读写操作，Java NIO 提供了高效、可扩展的 I/O 处理方式。

> NIO 中的关键组件是 Selector（选择器），它使用了 I/O 多路复用的机制，可以同时监控多个通道的状态。当一个或多个通道就绪时，Selector 会通知应用程序进行相应的处理。这种机制可以提高系统的并发性能，但它并不是 NIO 的核心特性，而是在 NIO 的基础上实现的。

> 所以IO多路复用设计目的其实不是为了快，而是为了解决线程/进程数量过多对服务器开销造成的压力
> ，但它通过减少线程或进程的数量和上下文切换的开销，间接地提高了系统的性能和吞吐量。

#### AIO (Asynchronous I/O)

AIO 也就是 NIO 2。Java 7 中引入了 NIO 的改进版 NIO 2,它是**异步** IO 模型。

异步 IO 是基于事件和回调机制实现的，也就是应用操作之后会直接返回，不会堵塞在那里，当后台处理完成，操作系统会通知相应的线程进 行后续的操作。

![image-20230905133105910](http://image.zzq8.cn/img/202309051331897.png)

目前来说 AIO 的应用还不是很广泛。Netty 之前也尝试使用过 AIO，不过又放弃了。这是因为，Netty 使用了 AIO 之后，在 Linux 系统上的性能并没有多少提升。

最后，来一张图，简单总结一下 Java 中的 BIO、NIO、AIO。

![image-20230905133151070](http://image.zzq8.cn/img/202309051331853.png)

> 补充：Netty
>
> 很多小伙伴搞不清楚为啥要学习 Netty ，正式今天这篇文章开始之前，简单说一下自己的看法：
>
> * Netty 基于 NIO （NIO 是一种同步非阻塞的 I/O 模型，在 Java 1.4 中引入了 NIO），使用 Netty 可以极大地简化 TCP 和 UDP 套接字服务器等网络编程，并且性能以及安全性等很多方面都非常优秀。
> * 我们平常经常接触的 Dubbo、RocketMQ、Elasticsearch、gRPC、Spark 等等热门开源项目都用到了 Netty。
> * 大部分微服务框架底层涉及到网络通信的部分都是基于 Netty 来做的，比如说 Spring Cloud 生态系统中的网关 Spring Cloud Gateway。
>
> 好的！那我就简单用 3 点来概括一下 Netty 吧！
>
> 1. Netty 是一个 基于 NIO 的 ==client-server(客户端服务器)框架==，使用它可以快速简单地开发网络应用程序。
> 2. 它极大地简化并优化了 TCP 和 UDP 套接字服务器等网络编程,并且性能以及安全性等很多方面甚至都要更好。
> 3. 支持多种协议 如 FTP，SMTP，HTTP 以及各种二进制和基于文本的传统协议。
>
> 用官方的总结就是：Netty 成功地找到了一种在不妥协可维护性和性能的情况下实现易于开发，性能，稳定性和灵活性的方法。
>
> 网络编程我愿意称中 Netty 为王 。
>
>
> 不用 NIO 主要是因为 NIO 的编程模型复杂而且存在一些 BUG，并且对编程功底要求比较高。下图就是一个典型的使用 NIO 进行编程的案例：
>
> 因为 Netty 具有下面这些优点，并且相比于直接使用 JDK 自带的 NIO 相关的 API 来说更加易用
>
> 凭借自己的了解，简单说一下吧！理论上来说，NIO 可以做的事情 ，使用 Netty 都可以做并且更好。Netty 主要用来做网络通信   
>
> * 作为 RPC 框架的网络通信工具 ： 我们在分布式系统中，不同服务节点之间经常需要相互调用，这个时候就需要 RPC 框架了。不同服务节点的通信是如何做的呢？可以使用 Netty 来做。比如我调用另外一个节点的方法的话，至少是要让对方知道我调用的是哪个类中的哪个方法以及相关参数吧！
> * 实现一个自己的 HTTP 服务器 ：通过 Netty 我们可以自己实现一个简单的 HTTP 服务器，这个大家应该不陌生。说到 HTTP 服务器的话，作为 Java 后端开发，我们一般使用 Tomcat 比较多。一个最基本的 HTTP 服务器可要以处理常见的 HTTP Method 的请求，比如 POST 请求、GET 请求等等。
> * 实现一个即时通讯系统 ： 使用 Netty 我们可以实现一个可以聊天类似微信的即时通讯系统，这方面的开源项目还蛮多的，可以自行去 Github 找一找。
> * 实现消息推送系统 ：市面上有很多消息推送系统都是基于 Netty 来做的。







## * 泛型

### * 什么是泛型擦除机制？为什么要擦除?

Java 的泛型是伪泛型，这是因为 Java 在编译期间，所有的泛型信息都会被擦掉，这也就是通常所说类型擦除 。

编译器会在编译期间会动态地将泛型 T 擦除为 Object 或将 T extends xxx 擦除为其限定类型 xxx 。

因此，泛型本质上其实还是编译器的行为，为了保证引入泛型机制但不创建新的类型，减少虚拟机的运行开销，编译器通过擦除将泛型类转化 为一般类。（这句话的意思是在编译期而不是运行期进行泛型擦除，可以减少虚拟机在运行期间的代价。并不是说泛型擦除这件事情本身能够有这个效果。）

这里说的可能有点抽象，我举个例子：

```java
List<Integer> list = new ArrayList<>();
list.add(12);
//1.编译期间直接添加会报错
list.add("a");
Class<? extends List> clazz = list.getClass();
Method add = clazz.getDeclaredMethod("add", Object.class);
//2.运行期间通过反射添加，是可以的
add.invoke(list, "kl");
System.out.println(list)
```

再来举一个例子 : 由于泛型擦除的问题，下面的方法重载会报错。

```java
public void print(List<String> list) { }
public void print(List<Integer> list) { }
//原因也很简单，泛型擦除之后， List<String> 与 List<Integer> 在编译以后都变成了 List 。
```

既然编译器要把泛型擦除，那为什么还要用泛型呢？用 Object 代替不行吗？

这个问题其实在变相考察泛型的作用： 

* **使用泛型可在编译期间进行类型检测**
* **使用 Object 类型需要手动添加强制类型转换，降低代码可读性，提高出错概率。**
* 泛型可以使用自限定类型如 T extends Comparable 。

> 评论补充：
>
> 1、对于泛型类，有：
>
> ```java
> public class Generic<T> {
>     T elem;
>     // ...
> }
> // 擦除后相当于
> public class Generic {
>     Object elem;
>     // ...
> }
> ```
>
> 2、对于泛型方法，有：
>
> ```java
> <T> T method(T a, T b);
> 
> // 擦除后
> Object method(Object a, Object b);
> 
>   
> <T extends Number> T method(T a, T b);
> 
> // 擦除后
> Number method(Number a, Number b);
> ```

### * 什么是桥方法？(呈上)

桥方法(Bridge Method) 用于继承泛型类时保证多态。

```java
class Node<T> {
    public T data;
    public Node(T data) { this.data = data; }
    public void setData(T data) {
        System.out.println("Node.setData");
        this.data = data;
    }
}

class MyNode extends Node<Integer> {
    public MyNode(Integer data) { super(data); }

  	// Node<T> 泛型擦除后为 setData(Object data)，而子类 MyNode 中并没有重写该方法，所以编译器会加入该桥方法保证多态
   	public void setData(Object data) {
        setData((Integer) data);
    }

    public void setData(Integer data) {
        System.out.println("MyNode.setData");
        super.setData(data);
    }
}
```

⚠️注意 ：桥方法为编译器自动生成，非手写。

### * 泛型有哪些限制？为什么？

泛型的限制一般是由泛型擦除机制导致的。擦除为 Object 后无法进行类型判断

* 只能声明不能实例化 T 类型变量。
* 泛型参数不能是基本类型。因为基本类型不是 Object 子类，应该用基本类型对应的引用类型代替。
* 不能实例化泛型参数的数组。擦除后为 Object 后无法进行类型判断。
* 不能实例化泛型数组。
  * 《Thinking in java》一书中指出，由于泛型具有擦除机制，在运行时的类型参数会被擦除，Java只知道存储的对象是一个Object而已，而对于Java的数组来说，他必须知道它持有的所有对象的具体类型，而泛型的这种运行时擦除机制违反了数组安全检查的原则。
* 泛型无法使用 Instance of 和 getClass() 进行类型判断。
* 不能实现两个不同泛型参数的同一接口，擦除后多个父类的桥方法将冲突
* 不能使用 static 修饰泛型变量
  * 在java中泛型只是一个[占位符](https://so.csdn.net/so/search?q=占位符&spm=1001.2101.3001.7020)，必须在传递类型后才能使用就泛型而言，类实例化时才能真正的传递类型参数，由于静态方法的加载先于类的实例化，也就是说类中的泛型还没有传递真正的类型参数静态的方法就已经加载完成了
* ......

#### 以下代码是否能编译，为什么？

```java
public final class Algorithm {
    public static <T> T max(T x, T y) {
        return x > y ? x : y;
    }
}
```

无法编译，因为 x 和 y 都会被擦除为 Object 类型， Object 无法使用 > 进行比较

```java
public class Singleton<T> {
    public static T getInstance() {
        if (instance == null)
            instance = new Singleton<T>();

        return instance;
    }
    private static T instance = null;
}
```

无法编译，因为不能使用 static 修饰泛型 T 。



## * String 类常见面试题总结

### 第 1 题，奇怪的 nullnull

下面这段代码最终会打印什么？

```java
public class Test1 {
    private static String s1;
    private static String s2;

    public static void main(String[] args) {
        String s= s1+s2;
        System.out.println(s);
    }
}
```

运行之后，你会发现打印了nullnull：

在分析这个结果之前，先扯点别的，说一下为空null的字符串的打印原理。查看一下PrintStream类的源码，print方法在打印null前进行了处理：

```java
public void print(String s) {
    if (s == null) {
        s = "null";
    }
    write(s);
}
```

因此，一个为null的字符串就可以被打印在我们的控制台上了。

再回头看上面这道题，s1和s2没有经过初始化所以都是空对象null，需要注意这里不是字符串的"null"，打印结果的产生我们可以看一下字节码文件：

![image-20230906155942752](http://image.zzq8.cn/img/202309061559885.png)

编译器会对String字符串相加的操作进行优化，会把这一过程转化为StringBuilder的append方法。那么，让我们再看看append方法的源码：

```java
public AbstractStringBuilder append(String str) {
    if (str == null)
        return appendNull();
    	//...
}
```

如果append方法的参数字符串为null，那么这里会调用其父类AbstractStringBuilder的appendNull方法：

```java
private AbstractStringBuilder appendNull() {
    int c = count;
    ensureCapacityInternal(c + 4);
    final char[] value = this.value;
    value[c++] = 'n';
    value[c++] = 'u';
    value[c++] = 'l';
    value[c++] = 'l';
    count = c;
    return this;
}
```

这里的value就是底层用来存储字符的char类型数组，到这里我们就可以明白了，其实StringBuilder也对null的字符串进行了特殊处理，在append的过程中如果碰到是null的字符串，那么就会以"null"的形式被添加进字符数组，这也就导致了两个为空null的字符串相加后会打印为"nullnull"。

### 第 2 题，改变 String 的值

如何改变一个 String 字符串的值，这道题可能看上去有点太简单了，像下面这样直接赋值不就可以了吗？

```java
String s="Hydra";
s="Trunks";
```

恭喜你，成功掉进了坑里！在回答这道题之前，我们需要知道 String 是不可变的，打开 String 的源码在开头就可以看到：

`private final char value[];`

可以看到，String 的本质其实是一个char类型的数组，然后我们再看两个关键字。先看final，我们知道final在修饰引用数据类型时，就像这里的数组时，能够保证指向该数组地址的引用不能修改，但是数组本身内的值可以被修改。

是不是有点晕，没关系，我们看一个例子：

```java
final char[] one={'a','b','c'};
char[] two={'d','e','f'};
one=two;
```

如果你这样写，那么编译器是会报错提示 `Cannot assign a value to final variable 'one'`，说明被final修饰的数组的引用地址是不可改变的。但是下面这段代码却能够正常的运行：

```java
final char[] one={'a','b','c'};
one[1]='z';
```

**也就是说，即使被final修饰，但是我直接操作数组里的元素还是可以的，所以这里还加了另一个关键字`private`，防止从外部进行修改。此外，String 类本身也被添加了final关键字修饰，防止被继承后对属性进行修改。**

...

那么，回到上面的问题，如果我想要改变一个 String 的值，而又不想把它重新指向其他对象的话，应该怎么办呢？答案是利用反射修改char数组的值：

```java
public static void main(String[] args) throws NoSuchFieldException, IllegalAccessException {
    String s="Hydra";
    System.out.println(s+":  "+s.hashCode());

    Field field = String.class.getDeclaredField("value");
    field.setAccessible(true);
    field.set(s,new char[]{'T','r','u','n','k','s'});
    System.out.println(s+": "+s.hashCode());
}
```

再对比一下hashCode，修改后和之前一样，对象没有发生任何变化：

最后，再啰嗦说一点题外话，这里看的是jdk8中 String 的源码，到这为止还是使用的char类型数组来存储字符，但是在jdk9中这个char数组已经被替换成了byte数组，能够使 String 对象占用的内存减少。

### 第 3 题，创建了几个对象？

相信不少小伙伴在面试中都遇到过这道经典面试题，下面这段代码中到底**创建**了几个对象？

```java
String s = new String("Hydra");
```

其实真正想要回答好这个问题，要铺垫的知识点还真是不少。首先，我们需要了解 3 个关于**常量池**的概念，下面还是基于jdk8版本进行说明：

* class 文件常量池：在 class 文件中保存了一份常量池（Constant Pool），主要存储编译时确定的数据，包括代码中的字面量(literal)和符号引用
* 运行时常量池：位于方法区中，全局共享，class 文件常量池中的内容会在类加载后存放到方法区的运行时常量池中。除此之外，在运行期间可以将新的变量放入运行时常量池中，相对 class 文件常量池而言运行时常量池更具备动态性
* 字符串常量池：位于堆中，全局共享，这里可以先粗略的认为它存储的是 String 对象的直接引用，而不是直接存放的对象，具体的实例对象是在堆中存放

> 补充：
>
> 当虚拟机要使用一个类时，它需要读取并解析 Class 文件获取相关信息，再将信息存入到方法区。方法区会存储已被虚拟机加载的 **类信息、字段信息、方法信息、常量、静态变量、即时编译器编译后的代码缓存等数据**。
>
> ![method-area-jdk1.7](https://oss.javaguide.cn/github/javaguide/java/jvm/method-area-jdk1.7.png)
>
> ------
>
> 著作权归JavaGuide(javaguide.cn)所有 基于MIT协议 原文链接：https://javaguide.cn/java/jvm/memory-area.html

可以用一张图来描述它们各自所处的位置：

![image-20230906170526190](http://image.zzq8.cn/img/202309061705871.png)

接下来，我们来细说一下**字符串常量池**的结构，其实在 Hotspot JVM 中，字符串常量池StringTable的本质是一张HashTable，那么当我们说将一个字符串放入字符串常量池的时候，实际上放进去的是什么呢？

以字面量的方式创建 String 对象为例，字符串常量池以及堆栈的结构如下图所示（忽略了 jvm 中的各种OopDesc实例）：

![image-20230906170643575](http://image.zzq8.cn/img/202309061706773.png)

实际上字符串常量池 HashTable 采用的是**数组加链表**的结构，链表中的节点是一个个的 HashTableEntry，而 HashTableEntry 中的 value 则存储了堆上 String 对象的**引用**。
XD: HashMap 和 Hashtable 在内部都使用了数组加链表（或红黑树）的形式来存储键值对【自己对hashtable太生疏了】

那么，下一个问题来了，这个字符串对象的引用是**什么时候**被放到字符串常量池中的？具体可为两种情况：

* 使用字面量声明 String 对象时，也就是被双引号包围的字符串，在堆上创建对象，并驻留到字符串常量池中（注意这个用词）
* 调用intern()方法，当字符串常量池没有相等的字符串时，会保存该字符串的引用

注意！我们在上面用到了一个词驻留，这里对它进行一下规范。当我们说驻留一个字符串到字符串常量池时，指的是创 HashTableEntry，再使它的value指向堆上的 String 实例，并把 HashTableEntry 放入字符串常量池，而不是直接把 String 对象放入字符串常量池中。简单来说，可以理解为将 String 对象的引用保存在字符串常量池中。

我们把intern()方法放在后面细说，先主要看第一种情况，这里直接整理引用 R 大的结论：

> 在类加载阶段，JVM 会在堆中创建对应这些 class 文件常量池中的字符串对象实例，并在字符串常量池中驻留其引用。
>
> 这一过程具体是在 resolve 阶段(个人理解就是 resolution 解析阶段)执行，但是并不是立即就创建对象并驻留了引用，因为在 JVM 规范里指明了 resolve 阶段可以是 lazy 的。CONSTANT_String 会在第一次引用该项的 ldc 指令被第一次执行到的时候才会 resolve。
>
> 就 HotSpot VM 的实现来说，加载类时字符串字面量会进入到运行时常量池，不会进入全局的字符串常量池，即在 StringTable 中并没有相应的引用，在堆中也没有对应的对象产生。

...

到这里，我们可以看到一共创建了`两个String 对象`，并且两个都是在堆上创建的，且字面量方式创建的 String 对象的引用被驻留到了字符串常量池中。而栈里的s只是一个变量，并不是实际意义上的对象，我们不把它包括在内。



最后再看一下下面的这种情况，当字符串常量池已经驻留过某个字符串引用，再使用构造方法创建 String 时，创建了几个对象？

```java
public static void main(String[] args) {
	String s = "Hydra";
	String s2 = new String("Hydra");
}
```

答案是只创建`一个对象`，对于这种重复字面量的字符串

### 第 4 题，烧脑的 intern

上面我们在研究字符串对象的引用如何驻留到字符串常量池中时，还留下了调用intern方法的方式，下面我们来具体分析。

从字面上理解intern这个单词，作为动词时它有禁闭、关押的意思，通过前面的介绍，与其说是将字符串关押到字符串常量池StringTable中，可能将它理解为缓存它的引用会更加贴切。

String 的intern()是一个本地方法，可以强制将 String 驻留进入字符串常量池，可以分为两种情况：

* 如果字符串常量池中已经驻留了一个等于此 String 对象内容的字符串引用，则返回此字符串在常量池中的引用
* 否则，在常量池中创建一个引用指向这个 String 对象，然后返回常量池中的这个引用

好了，我们下面看一下这段代码，它的运行结果应该是什么？ XD：我答错了

```JAVA
public static void main(String[] args) {
    String s1 = new String("Hydra");
    String s2 = s1.intern();
    System.out.println(s1 == s2);
    System.out.println(s1 == "Hydra");
    System.out.println(s2 == "Hydra");
}
```

<details>
    <summary>答案：</summary>
false
false
true
</details>

![img](http://image.zzq8.cn/img/202309061735445.webp)

其实有了第三题的基础，了解这个结构已经很简单了：

* 在创建s1的时候，其实堆里已经创建了两个字符串对象StringObject1和StringObject2，并且在字符串常量池中驻留了StringObject2
* 当执行s1.intern()方法时，字符串常量池中已经存在内容等于"Hydra"的字符串StringObject2，直接返回这个引用并赋值给s2
* s1和s2指向的是两个不同的 String 对象，因此返回 false
* s2指向的就是驻留在字符串常量池的StringObject2，因此s2=="Hydra"为 true，而s1指向的不是常量池中的对象引用所以返回 false

> XD：我这题要理解成**只要是 字面量 就是对应字符串常量池中的变量！（也得指向堆中一个变量，这样变量才能引用）**vs **只要是new的就是在堆中** 才想得通
> 查资料，new String 到底几个对象  这时候字符串常量池会不会有！！！！看这个文章迷惑了
> 应该是 2 个对象，具体可以看下 GoodNotes
>
> > 当调用 `s1.intern()` 方法时，如果字符串常量池中已经存在与 `s1` 相同内容的字符串对象，那么 `s2` 将引用该已存在的对象。这意味着 `s2` 和 `s1` 引用的是同一个字符串常量对象，而不是堆空间中的 `s1` 对象。
> >
> > 需要注意的是，字符串常量池是全局共享的，而堆空间中的对象是独立的。通过 `s1.intern()` 方法获取的对象是在字符串常量池中的对象，与堆空间中的对象没有直接关联。
>
> > 看以下好理解：字面量不止在字符串常量池中有，堆中也得有才能给变量拿去用！！！
> > 看上图，可理解为第一步new的时候就有 堆中 现在能看到的所有东西了！！！！！！
> >
> > ```java
> > // 在堆中创建字符串对象”ab“
> > // 将字符串对象”ab“的引用保存在字符串常量池中
> > String aa = "ab";
> > // 直接返回字符串常量池中字符串对象”ab“的引用
> > String bb = "ab";
> > ```
>
> ###  String s1 = new String("abc");这句话创建了几个字符串对象？
>
> 会创建 1 或 2 个字符串对象。
>
> 1、如果字符串常量池中不存在字符串对象“abc”的引用，那么它将首先在字符串常量池中创建，然后在堆空间中创建，因此将创建总共 2 个字符串对象。
>
> ------
>
> 著作权归JavaGuide(javaguide.cn)所有 基于MIT协议 原文链接：https://javaguide.cn/java/basis/java-basic-questions-02.html

上面是常量池中已存在内容相等的字符串驻留的情况，下面再看看常量池中不存在的情况，看下面的例子：

```java
String s1 = new String("Hy") + new String("dra");
s1.intern();  //这里注释掉，结果就会相反
String s2 = "Hydra";
System.out.println(s1 == s2);
```

<details>
    <summary>答案：</summary>
true
</details>

简单分析一下这个过程，第一步会在堆上创建"Hy"和"dra"的字符串对象。第二部驻留到字符串常量池中。

接下来，完成字符串的拼接操作，前面我们说过，实际上 jvm 会把拼接优化成StringBuilder的append方法，并最终调用toString方法返回一个 String 对象。在完成字符串的拼接后，字符串常量池中并没有驻留一个内容等于"Hydra"的字符串。

<img src="http://images.zzq8.cn/img/image-20230906204748712.png" alt="image-20230906204748712" style="zoom:80%;" />

所以，执行s1.intern()时，会在字符串常量池创建一个引用，指向前面StringBuilder创建的那个字符串，也就是变量s1所指向的字符串对象。在《深入理解 Java 虚拟机》这本书中，作者对这进行了解释，因为从 jdk7 开始，字符串常量池就已经移到了堆中，那么这里就只需要在字符串常量池中记录一下首次出现的实例引用即可。

![image-20230906204837682](http://images.zzq8.cn/img/image-20230906204837682.png)

最后，当执行String s2 = "Hydra"时，发现字符串常量池中已经驻留这个字符串，直接返回对象的引用，因此s1和s2指向的是相同的对象。

![**image-20230906204951575**](http://images.zzq8.cn/img/image-20230906204951575.png)

### 第 5 题，还是创建了几个对象？

解决了前面数 String 对象个数的问题，那么我们接着加点难度，看看下面这段代码，创建了几个对象？

`String s="a"+"b"+"c";`

先揭晓答案，只创建了一个对象！ 可以直观的对比一下源代码和反编译后的字节码文件：

![image-20230906212720611](http://images.zzq8.cn/img/image-20230906212720611.png)

如果使用前面提到过的 debug 小技巧，也可以直观的看到语句执行完后，只增加了一个 String 对象，以及一个 char 数组对象。并且这个字符串就是驻留在字符串常量池中的那一个，如果后面再使用字面量"abc"的方式声明一个字符串，指向的仍是这一个，堆中 String 对象的数量不会发生变化。

至于为什么源代码中字符串拼接的操作，在编译完成后会消失，直接呈现为一个拼接后的完整字符串，是因为在编译期间，应用了编译器优化中一种被称为常量折叠(Constant Folding)的技术。

> 常量折叠会将编译期常量的加减乘除的运算过程在编译过程中折叠。编译器通过语法分析，会将常量表达式计算求值，并用求出的值来替换表达式，而不必等到运行期间再进行运算处理，从而在运行期间节省处理器资源。

而上边提到的编译期常量的特点就是它的值在编译期就可以确定，并且需要完整满足下面的要求，才可能是一个编译期常量：

* 被声明为final
* 基本类型或者字符串类型
* 声明时就已经初始化
* 使用常量表达式进行初始化

下面我们通过几段代码加深对它的理解： XD-看我图片文件夹String，只要字符串拼接带变量的都是在堆中 不是字符串常量池

```java
public static void main(String[] args) {
    final String h1 = "hello";
    String h2 = "hello";
    String s1 = h1 + "Hydra";
    String s2 = h2 + "Hydra";
    System.out.println((s1 == "helloHydra"));
    System.out.println((s2 == "helloHydra"));
}
```

<details>
    <summary>答案：</summary>
true
false
</details>

代码中字符串h1和h2都使用常量赋值，区别在于是否使用了final进行修饰，对比编译后的代码，s1进行了折叠而s2没有，可以印证上面的理论，final修饰的字符串变量才有可能是编译期常量。

![image-20230906213034838](http://images.zzq8.cn/img/image-20230906213034838.png)

再看一段代码，执行下面的程序，结果会返回什么呢？

```java
public static void main(String[] args) {
    String h ="hello";
    final String h2 = h;
    String s = h2 + "Hydra";
    System.out.println(s=="helloHydra");
}
```

答案是false，因为虽然这里字符串h2被final修饰，**但是初始化时没有使用常量表达式**，因此它也不是编译期常量。那么，有的小伙伴就要问了，到底什么才是常量表达式呢？

在Oracle官网的文档中，列举了很多种情况，下面对常见的情况进行列举（除了下面这些之外官方文档上还列举了不少情况，如果有兴趣的话，可以自己查看）：

* 基本类型和 String 类型的字面量
* 基本类型和 String 类型的强制类型转换
* 使用+或-或!等一元运算符（不包括++和--）进行计算
* 使用加减运算符+、-，乘除运算符*、 / 、% 进行计算
* 使用移位运算符 >>、 <<、 >>>进行位移操作
* ……

至于我们从文章一开始就提到的字面量（literals），是用于表达源代码中一个固定值的表示法，在 Java 中创建一个对象时需要使用new关键字，但是给一个基本类型变量赋值时不需要使用new关键字，这种方式就可以被称为字面量。

再说点题外话，和编译期常量相对的，另一种类型的常量是运行时常量，看一下下面这段代码：

```java
final String s1="hello "+"Hydra";
final String s2=UUID.randomUUID().toString()+"Hydra";
```

编译器能够在编译期就得到s1的值是hello Hydra，不需要等到程序的运行期间，因此s1属于编译期常量。而对s2来说，虽然也被声明为final类型，并且在声明时就已经初始化，但使用的不是常量表达式，因此不属于编译期常量，这一类型的常量被称为运行时常量。



# SpringBoot

> 我只挑重点记录

## * 简单介绍一下 Spring?有啥缺点?

**虽然 Spring 的组件代码是轻量级的，但它的配置却是重量级的（需要大量 XML 配置）**

为此，Spring 2.5 引入了基于注解的组件扫描，这消除了大量针对应用程序自身组件的显式 XML 配置。Spring 3.0 引入了基于 Java 的配置，这是一种类型安全的可重构配置方式，可以代替 XML。

尽管如此，我们依旧没能逃脱配置的魔爪。开启某些 Spring 特性时，比如事务管理和 Spring MVC，还是需要用 XML 或 Java 进行显式配置。启用第三方库时也需要显式配置，比如基于 Thymeleaf 的 Web 视图。配置 Servlet 和过滤器（比如 Spring 的DispatcherServlet）同样需要在 web.xml 或 Servlet 初始化代码里进行显式配置。组件扫描减少了配置量，Java 配置让它看上去简洁不少，但 Spring 还是需要不少配置。

光配置这些 XML 文件都够我们头疼的了，占用了我们大部分时间和精力。除此之外，相关库的依赖非常让人头疼，不同库之间的版本冲突也非常常见。

## * 什么是 Spring Boot Starters?

**Spring Boot Starters 是一系列依赖关系的集合**，因为它的存在，项目的依赖之间的关系对我们来说变的更加简单了。

举个例子：在没有 Spring Boot Starters 之前，我们开发 REST 服务或 Web 应用程序时; 我们需要使用像 Spring MVC，Tomcat 和 Jackson 这样的库，这些依赖我们需要手动一个一个添加。但是，有了 Spring Boot Starters 我们只需要一个只需添加一个spring-boot-starter-web一个依赖就可以了，这个依赖包含的子依赖中包含了我们开发 REST 服务需要的所有依赖。

## * Spring&SpringBoot常用注解总结

https://javaguide.cn/system-design/framework/spring/spring-common-annotations.html

## * 如何使用 Spring Boot 实现全局异常处理？

可以使用 @ControllerAdvice 和 @ExceptionHandler 处理全局异常。

更多内容请参考我的原创 ：[Spring Boot 异常处理在实际项目中的应用](https://snailclimb.gitee.io/springboot-guide/#/./docs/advanced/springboot-handle-exception-plus)

## *Spring Boot 中如何实现定时任务 ? 

我们使用 @Scheduled 注解就能很方便地创建一个定时任务。

```java
@Component
public class ScheduledTasks {
    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

    /**
     * fixedRate：固定速率执行。每5秒执行一次。
     */
    @Scheduled(fixedRate = 5000)
    public void reportCurrentTimeWithFixedRate() {
        log.info("Current Thread : {}", Thread.currentThread().getName());
        log.info("Fixed Rate Task : The time is now {}", dateFormat.format(new Date()));
    }
}
```

单纯依靠 @Scheduled 注解 还不行，我们还需要在 SpringBoot 中我们只需要在启动类上加上@EnableScheduling 注解，这样才可以启动定时任务。@EnableScheduling 注解的作用是发现注解 @Scheduled 的任务并在后台执行该任务。

## * SpringBoot自动配置原理

[guiqp](https://www.yuque.com/guiqp)[2022-04-10 17:38](https://www.yuque.com/snailclimb/mf2z3k/vqe4gz#comment-22144694)

SpringBoot自动配置原理，我的理解是这样的：

1. 引入Starter组件
2. SpringBoot基于约定去Starter组件的路径下（META-INF/spring.factories）去找配置类
3. SpringBoot使用ImportSelector去导入这些配置类，并根据@Conditional动态加载配置类里面的Bean到容器

有类似问题的小伙伴可以看看我写的这篇文章，写的比较详细：[https://javaguide.cn/system-design/framework/spring/spring-boot-auto-assembly-principles.htm](https://javaguide.cn/system-design/framework/spring/spring-boot-auto-assembly-principles.html#必看专栏) 





简单来说就是自动去把第三方组件的Bean装载到IOC容器中，不需要开发人员再去写Bean相关的配置，在springboot应用里面只需要在启动类上去加上@SpringBootApplication注解，就可以去实现自动装配，它是一个复合注解真正去实现自动装配的注解是@EnableAutoConfiguration这样一个注解，自动装配的实现呢，主要依靠三个核心的关键技术。

第一个，引入starter启动依赖组件的时候，这个组件里面必须包含有一个@Configuration配置类，而在这个配置类里面，我们需要通过@Bean这个注解去声明需要装配到IOC容器里面的Bean对象。

第二个，第三方jar包里面的配置类全路径都将放在classpath:/META-INF/spring.factories文件里面，这样的话springboot就可以知道第三方jar包里面这个配置类的位置。这个步骤主要是用到了spring里面的SpringFactoriesLoader来完成的。

第三个，springboot拿到所有第三方jar包里面声明的配置类以后，再通过Spring提供的ImportSelector这样一个接口（@Import注解功能），来实现对这些配置类的动态加载，从而去完成自动装配的动作。

![image-20230906220544568](http://images.zzq8.cn/img/image-20230906220544568.png)



# 分布式&微服务

## * 分布式事务

我已经部分集成到自己的笔记

## * 分布式下日志收集

### 痛点：

没有日志系统之前，我们的日志可能分布在多台服务器上。每次需要查看日志，我们都需要登录每台机器。然后，使用 grep、wc 等 Linux 命令来对日志进行搜索。这个过程是非常麻烦并且耗时的！并且，日志量不大的时候，这个速度还能忍受。当日志量比较多的时候，整个过程就是非常慢。

### ELK 了解么？

ELK 是目前使用的比较多的一个开源的日志系统解决方案，背靠是 [Elastic](https://www.elastic.co/cn/) 这家专注搜索的公司。

### ELK 老三件套 

最原始的时候，ELK 是由 3 个开源项目的首字母构成，分别是 Elasticsearch 、Logstash、Kibana。

下图是一个最简单的 ELK 日志系统架构 ：

![image-20230907214851056](http://images.zzq8.cn/img/image-20230907214851056.png)

我们分别来介绍一下这些开源项目以及它们在这个日志系统中起到的作用：

* Logstash ：Logstash 主要用于日志的搜集、分析和过滤，支持对多种日志类型进行处理。在 ELK 日志系统中，Logstash 负责日志的收集和清洗。
* Elasticsearch ：ElasticSearch 一款使用 Java 语言开发的搜索引擎，基于 Lucence 。可以解决使用数据库进行模糊搜索时存在的性能问题，提供海量数据近实时的检索体验。在 ELK 日志系统中，Elasticsearch 负责日志的搜素。
* Kibana ：Kibana 是专门设计用来与 Elasticsearch 协作的，可以自定义多种表格、柱状图、饼状图、折线图对存储在 Elasticsearch 中的数据进行深入挖掘分析与可视化。 ELK 日志系统中，Logstash 主要负责对从 Elasticsearch 中搜索出来的日志进行可视化展示。



# Tomcat 常见面试题总结

## * 什么是 Tomcat?

简单来说，Tomcat 就是一个“HTTP 服务器 + Servlet 容器”，我们通常也称呼 Tomcat 为 Web 容器。

* HTTP 服务器 ：处理 HTTP 请求并响应结果。
* Servlet 容器 ：HTTP 服务器将请求交给 Servlet 容器处理，Servlet 容器会将请求转发到具体的 Servlet（Servlet 容器用来加载和管理业务类）。

## * 什么是 Servlet?有什么作用？

Servlet 指的是任何实现了 Servlet 接口的类。Servlet 主要用于处理客户端传来的 HTTP 请求，并返回一个响应。

Servlet 容器会根据 web.xml 文件中的映射关系，调用相应的 Servlet，Servlet 将处理的结果返回给 Servlet 容器，并通过 HTTP 服务器将响应传输给客户端。

几乎所有的 Java Web 框架（比如 Spring）都是基于 Servlet 的封装。



# HashMap

> 待吸收美团的过来，系统化的搞定这块

## HashMap 的长度为什么是 2 的幂次方 ⭐⭐⭐

💡 提示：提高运算效率。

> 在Java中，常见的哈希函数（如`hashCode()`方法）通常返回一个32位的整数作为哈希值。这是因为Java中的`int`类型是32位有符号整数，因此哈希值的范围是-2^31（-2147483648）到2^31-1（2147483647）之间的所有整数。

当HashMap的长度为2的幂次方时，通过与运算（&）就可以将哈希码映射到数组的索引上。假设HashMap的长度为N，那么对哈希码进行与运算的结果将是0到N-1之间的整数，恰好对应数组的有效索引范围。

XD: 我可以理解为从位运算角度 32个bit位（2^n）



为了能让 HashMap 存取高效，尽量较少碰撞，也就是要尽量把数据分配均匀。我们上面也讲到了过了，Hash 值的范围值-2147483648 到 2147483647，前后加起来大概 40 亿的映射空间，只要哈希函数映射得比较均匀松散，一般应用是很难出现碰撞的。但问题是一个 40 亿长度的数组，内存是放不下的。所以这个散列值是不能直接拿来用的。用之前还要先做对数组的长度取模运算，得到的余数才能用来要存放的位置也就是对应的数组下标。这个数组下标的计算方法是“ `(n - 1) & hash`”。（n 代表数组长度）。这也就解释了 HashMap 的长度为什么是 2 的幂次方。

**这个算法应该如何设计呢？**              XD: 这就是我之前LeetCode 学的一个点。。。好使

我们首先可能会想到采用%取余的操作来实现。但是，重点来了：**“取余(%)操作中如果除数是 2 的幂次则等价于与其除数减一的与(&)操作（也就是说 hash%length==hash&(length-1)的前提是 length 是 2 的 n 次方；）。”** 并且 **采用二进制位操作 &，相对于%能够提高运算效率，这就解释了 HashMap 的长度为什么是 2 的幂次方。**

------

著作权归JavaGuide(javaguide.cn)所有 基于MIT协议 原文链接：https://javaguide.cn/java/collection/java-collection-questions-02.html



### JDK 1.7 和 JDK 1.8 的 ConcurrentHashMap 实现有什么不同？

* **线程安全实现方式**：JDK 1.7 采用 `Segment` 分段锁来保证安全， `Segment` 是继承自 `ReentrantLock`。JDK1.8 放弃了 `Segment` 分段锁的设计，采用 `Node + CAS + synchronized` 保证线程安全，锁粒度更细，`synchronized` 只锁定当前链表或红黑二叉树的首节点。

- **Hash 碰撞解决方法** : JDK 1.7 采用拉链法，JDK1.8 采用拉链法结合红黑树（链表长度超过一定阈值时，将链表转换为红黑树）。
  - JDK1.8 之前 ： 数组和链表
    JDK1.8 之后 ： 多了红黑树





# SPI

> API vs SPI（Service Provider Interface）机制
>
> > XD: 可以理解为 API 接口在被调用方，SPI 接口在调用方
>
> 在面向对象的设计原则中，一般推荐模块之间基于接口编程，通常情况下调用方模块是不会感知到被调用方模块的内部具体实现。一旦代码里面涉及具体实现类，就违反了开闭原则。如果需要替换一种实现，就需要修改代码。
>
> 为了实现在模块装配的时候不用在程序里面动态指明，这就需要一种服务发现机制。Java SPI 就是提供了这样一个机制：**为某个接口寻找服务实现的机制。这有点类似 IoC 的思想，将装配的控制权移交到了程序之外。

**当接口存在于调用方这边时，就是 SPI**（看JavaGuide的图） ，由接口调用方确定接口规则，然后由不同的厂商去根据这个规则对这个接口进行实现，从而提供服务。

举个通俗易懂的例子：公司 H 是一家科技公司，新设计了一款芯片，然后现在需要量产了，而市面上有好几家芯片制造业公司，这个时候，只要 H 公司指定好了这芯片生产的标准（定义好了接口标准），那么这些合作的芯片公司（服务提供者）就按照标准交付自家特色的芯片（提供不同方案的实现，但是给出来的结果是一样的）。

**SLF4J （Simple Logging Facade for Java）是 Java 的一个日志门面（接口），其具体实现有几种，比如：Logback、Log4j、Log4j2 等等**，而且还可以切换，在切换日志具体实现的时候我们是不需要更改项目代码的，只需要在 Maven 依赖里面修改一些 pom 依赖就好了。

![img](https://oss.javaguide.cn/github/javaguide/java/basis/spi/image-20220723213306039-165858318917813.png)

这就是依赖 SPI 机制实现的

XD：想象一下除了这个日志接口把标准提供给调用方去实现，还有JDBC感觉也是SPI机制

> JDBC的各类实现（如驱动程序、连接池等）可以通过SPI（Service Provider Interface）机制来实现。
>
> JDBC作为Java平台中用于与数据库进行交互的API，定义了一组标准的接口和类。具体的数据库厂商或第三方开发者可以通过实现这些接口来提供特定数据库的支持。
>
> SPI机制允许开发者在类路径下的特定位置提供自定义的实现类，并通过SPI机制自动加载和注册这些实现类。在JDBC中，这些实现类可以是数据库驱动程序（JDBC Driver）、连接池实现、事务管理器等。

------

著作权归JavaGuide(javaguide.cn)所有 基于MIT协议 原文链接：https://javaguide.cn/java/basis/spi.html
