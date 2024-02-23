> 2022/3/3 开始学习 JVM
>
> 虽然网上有跟着康师傅做的笔记【可以对照着当课件学习】
>
> 但是还是要自己做一遍笔记才是属于自己的知识
>





JVM 相关的知识点，一般是大厂才会问到，面试中小厂就没必要准备了。JVM 面试中比较常问的是 [Java 内存区域](https://javaguide.cn/java/jvm/memory-area.html)、[JVM 垃圾回收](https://javaguide.cn/java/jvm/jvm-garbage-collection.html)、[类加载器和双亲委派模型](https://javaguide.cn/java/jvm/classloader.html) 以及 JVM 调优和问题排查（我之前分享过一些[常见的线上问题案例](https://t.zsxq.com/0bsAac47U)，里面就有 JVM 相关的）。





# 自己汇总

![img](https://images.zzq8.cn/img/331425-20160623115845438-670228585.png)

#### ==* JVM 参数==

##### 题目答案：好学

先分析一下里面各个参数的含义： 

* -Xms：1G ， 就是说初始堆大小为1G 

* -Xmx：2G ， 就是说最大堆大小为2G 

* -Xmn：500M ，就是说年轻代大小是500M（包括一个Eden和两个Survivor S0、S1） 

* -XX:MaxPermSize：64M ， 就是说设置持久代（永久代）最大值为64M 

  * > 在 JDK 8 及更高版本中，`-XX:MaxPermSize` 参数不再起作用。在 JDK 8 之前的版本中，Java 虚拟机使用永久代（Permanent Generation）来存储类的元数据、静态变量等信息。`-XX:MaxPermSize` 参数用于配置永久代的最大大小。
    >
    > 然而，从 JDK 8 开始，永久代被称为元空间（Metaspace），并且不再受到固定大小的限制。元空间的大小由系统的可用内存决定，并且可以根据需要自动扩展。因此，`-XX:MaxPermSize` 参数不再适用于 JDK 8 及更高版本。
    >
    > 取而代之的是使用 `-XX:MaxMetaspaceSize` 参数来配置元空间的最大大小。你可以使用该参数来限制元空间的增长，防止应用程序使用过多的内存。
    >
    > 例如，可以使用以下命令行参数来设置元空间的最大大小为 256MB：
    >
    > ```
    > -XX:MaxMetaspaceSize=256m
    > ```
    >
    > 需要注意的是，元空间的大小不再计入 Java 堆内存的限制，因此你不再需要为永久代或元空间单独分配内存。Java 虚拟机会根据应用程序的需求自动管理元空间的内存使用。==(XD 脑袋里想着那个三层的图就好。上两层可以看作是堆的，最下面一层就是这个参数点了)==

* -XX:+UseConcMarkSweepGC ， 就是说使用使用CMS内存收集算法 

* -XX:SurvivorRatio=3 ， 就是说Eden区与Survivor区的大小比值为3：1：1

  * 在默认情况下，`Eden区和Survivor0、Survivor1的比例是8:1:1`

题目中所问的Eden区的大小是指年轻代的大小，直接根据-Xmn：500M和-XX:SurvivorRatio=3可以直接计算得出
500M*(3/(3+1+1)) 
=500M*（3/5） 
=500M*0.6 
=300M 
所以Eden区域的大小为300M。

##### 下图三层

1. 新生代内存/ 年轻代 (Young Generation)  ：1 个 Eden 2 个 Survivor (`Eden区和Survivor0、Survivor1的比例是8:1:1`)
2. 老生代(Old Generation)     2/3 的堆空间

**---------Young + Old = Heap---------**

1. 永久代(Permanent Generation)

大部分情况，对象都会首先在 Eden 区域分配。如果对象在 Eden 出生并经过第一次 Minor GC后仍然能够存活，并且能被 Survivor 容纳的话，将被移动到 Survivor 空间（SO 或者s1）中，并将对象年龄设为 1（Eden 区->Survivor 区后对象的初始年龄变为1）。

对象在 Survivor 中每熬过一次 MinorGC，年龄就增加1岁，当它的年龄增加到一定程度（默认为15岁），就会被晋升到老年代中。对象晋升到老年代的年龄阈值，可以通过参数一XX: MaxTenuringThreshold来设置。

![堆内存结构](https://oss.javaguide.cn/github/javaguide/java/jvm/hotspot-heap-structure.png)



复制算法用于年轻代，标记-压缩算法用于老年代。

1. 标记-清除算法（Mark and Sweep）：该算法分为两个阶段。首先，通过根对象开始，标记所有从根对象可达的存活对象。然后，在清除阶段，清除未被标记的对象，释放其占用的内存空间。标记-清除算法可能导致内存碎片化问题。
2. 复制算法（Copying）：该算法将内存分为两个区域，通常是年轻代的Eden区和存活区域。在垃圾回收时，将存活的对象从一个区域复制到另一个区域，同时清除已经复制的对象。复制算法解决了内存碎片化问题，但需要额外的复制操作。
3. 标记-压缩算法（Mark and Compact）：该算法结合了标记和清除的思想，并在清除阶段后进行压缩操作。在标记阶段，标记存活对象；在清除阶段，清除未标记的对象；最后，在压缩阶段，将存活对象压缩到内存的一端，消除内存碎片。
4. 分代收集算法（Generational）：该算法基于一种观察，即大部分对象很快变成垃圾。根据对象的生命周期，将内存划分为不同的代（例如年轻代和老年代），并针对不同代采用不同的收集算法，如复制算法用于年轻代，标记-压缩算法用于老年代。

内存连续空间：eden区通过复制/清除算法保证了读写连续性(因为新生代的对象产生和销毁非常频繁,所以才采用了清空的方式)





先说VM选项， 三种：

- \- : 标准VM选项，VM规范的选项
- -X: 非标准VM选项，不保证所有VM支持
- -XX: 高级选项，高级特性，但属于不稳定的选项

参见 [Java HotSpot VM Options](https://link.zhihu.com/?target=http%3A//www.oracle.com/technetwork/java/javase/tech/vmoptions-jsp-140102.html%23Options)

题主提到的参数前缀为X，显然属于第二类

再说这几个参数，其语义分别是：

- -Xmx: 堆的最大内存数，等同于-XX:MaxHeapSize
- -Xms: 堆的初始化初始化大小
- -Xmn: 堆中新生代初始及最大大小，如果需要进一步细化，初始化大小用-XX:NewSize，最大大小用-XX:MaxNewSize 
- -Xss: 线程栈大小，等同于-XX:ThreadStackSize

命名应该非简称，助记的话： memory maximum, memory startup, memory nursery/new, stack size.



作者：Home3k
链接：https://www.zhihu.com/question/59957834/answer/170775050
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。



#### * 方法区

> JIT 代码缓存  TODO description
>
> 虽然 Java 虚拟机规范把方法区描述为堆的一个逻辑部分，但是它却有一个别名叫做 `Non-Heap（非堆）`，目的应该是与 Java 堆区分开来。

![method-area-jdk1.7](https://oss.javaguide.cn/github/javaguide/java/jvm/method-area-jdk1.7.png)









## Java 虚拟机中有哪些类加载器？

![8468A0AF-362C-40A8-A0D9-D3837C925B83_1_101_o](https://images.zzq8.cn/img/8468A0AF-362C-40A8-A0D9-D3837C925B83_1_101_o.jpeg)





















# JVM-康师傅

# 第一篇：内存与垃圾回收篇

这一章的内容：

![image-20220303202507449](https://images.zzq8.cn/img/202209170026372.png)







# 第二篇：字节码与类的加载篇

# 第三篇：性能监控与调优篇

# 第四篇：大厂面试篇





> [牛客](https://www.nowcoder.com/test/question/done?tid=61464656&qid=373226#summary)

不是局部变量在该方法被执行/调用时创建，而是应该为在该变量被声明并赋值时创建，可以理解为“当代码执行到该变量被赋值的代码时才被创建”

栈会为每个方法在运行的时候分配一块独立的栈帧内存区域，栈帧又包含“局部变量表”、“操作数栈”、“动态链接”以及“方法出口”四个部分。

举例说明：

```java
public class Demo {
	
	public void test() {
		int a;
		int b = 5;
		int c = b + 4;
		a = 2;
	}
	
	public static void main(String[] args) {
		Demo demo = new Demo();
		demo.test();
	}
}
```

定义了一个Demo类，其中有一个测试主方法main以及一个test()方法

那么在执行main的时候，内存分配如下

![img](https://uploadfiles.nowcoder.com/images/20200205/485624_1580891157784_3DD0DA0218194FD23BAC5814DA8F14BA)

其中我们只看test()桢栈中具体的流程

首先我们使用javac Demo.java来生成Demo.class文件，然后通过执行javap -c Demo来查看执行原理，这里我只截取test()方法部分

![img](https://uploadfiles.nowcoder.com/images/20200205/485624_1580891263623_B8166EB1304331CD7854588099E99780)

其中

```
0：iconst_5,表示将一个int类型的常量5，压入操作数栈中
```

![img](https://uploadfiles.nowcoder.com/images/20200205/485624_1580891292940_9B3F52E23FB28410347F16F9B2D96E41)

```
1：istore_2,表示将这个int值从栈中取出，存储到局部变量_2中（代码为变量b）
```

![img](https://uploadfiles.nowcoder.com/images/20200205/485624_1580891318707_F14B6B01F2647CE0D153CE718DBE20AA)

```
2：iload_2,表示将变量2，int类型的值取出，压到操作数栈
```

![img](https://uploadfiles.nowcoder.com/images/20200205/485624_1580891414111_342F72ACDB0A2FC43FDD620952377BBD)

```
3：iconst_4,表示将一个int类型的常量4，压入操作数栈中
```



![img](https://uploadfiles.nowcoder.com/images/20200205/485624_1580891477241_2B0C2777E38CE8FB0D5809442C3F8E88)

`4：iadd,执行int类型的加***将操作数栈的4和5从栈中弹出并相加，将结果压入操作数栈中`![img](https://uploadfiles.nowcoder.com/images/20200205/485624_1580891609647_BD6DE153D00C4B6F7BB262515A2FD6B3)

`5：istore_3,表示将这个int值从栈中取出，存储到局部变量_3中（代码为变量c）`![img](https://uploadfiles.nowcoder.com/images/20200205/485624_1580891808414_991A0E856CFBBDCEB8ED7E72357D339D)
`6：iconst_2,表示将一个int类型的常量2，压入操作数栈中`![img](https://uploadfiles.nowcoder.com/images/20200205/485624_1580891848424_C465F8B7B5089C0CB19F73D2C57A6043)
`7：istore_1,表示将这个int值从栈中取出，存储到局部变量_1中（代码为变量a）`![img](https://uploadfiles.nowcoder.com/images/20200205/485624_1580891886190_CB3E70551ACE141002352B35BFE19E4D)
`8：return,方法结束，返回`
以上可以看出，虽然int a;在第一行就声明了a变量，但是直到给a赋值之后，才会在局部变量表中给a分配内存空间我们可以把赋值的代码删掉，再看看执行流程

```java
public class Demo {
	
	public void test() {
		int a;
		int b = 5;
		int c = b + 4;
	}
	
	public static void main(String[] args) {
		Demo demo = new Demo();
		demo.test();
	}
}
```

![img](https://uploadfiles.nowcoder.com/images/20200205/485624_1580892048902_FCF7E6AE4A2FC0DD82B2B93900E92E03)

这次我们可以看出，并没有对a就行任何操作，也就证明了“只有当给变量赋值的时候才会分配内存空间”的说法。以上

ps：我也是刚刚学到这里，如有说的不对之处望大家指出，一起探讨学习

> 参考：
>
> [小白都能看得懂的Java虚拟机内存模型]https://zhuanlan.zhihu.com/p/98337005
>
> [通过javap命令分析java汇编指令]https://www.jianshu.com/p/6a8997560b05





