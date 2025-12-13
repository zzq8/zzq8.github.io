---
article: false
updated: 2025-09-20 17:48:42
---
# JVM

> JVM 相关的知识点，一般是大厂才会问到，面试中小厂就没必要准备了。JVM 面试中比较常问的是 [Java 内存区域](https://javaguide.cn/java/jvm/memory-area.html)、[JVM 垃圾回收](https://javaguide.cn/java/jvm/jvm-garbage-collection.html)、[类加载器和双亲委派模型](https://javaguide.cn/java/jvm/classloader.html) 以及 JVM 调优和问题排查（我之前分享过一些[常见的线上问题案例](https://t.zsxq.com/0bsAac47U)，里面就有 JVM 相关的）。

![img](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/331425-20160623115845438-670228585.png)



#### # 双亲委派模型

Java有哪些类加载器，双亲委派模型是什么，为什么要这样设计？怎么打破双亲委派模型？     看了jvm笔记的link地址  javaguide

​	Bootstrap\extension\application        
​	针对JVM提供的三个内置的类加载器   `【自底向上查找判断类是否被加载，自顶向下尝试加载类】`        
​	`可以避免类的重复加载（JVM 区分不同类的方式不仅仅根据类名，相同的类文件被不同的类加载器加载产生的是两个不同的类），也保证了 Java 的核心 API 不被篡改。`

​    类加载器在进行类加载的时候，它首先不会自己去尝试加载这个类，而是把这个请求委派给父类加载器去完成（调用父加载器 `loadClass()`方法来加载类）。 如果想打破双亲委派模型则需要重写 `loadClass()` 方法。



#### ==# JVM 参数==

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



***



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







#### # Java 内存区域

##### 堆结构

1. 新生代内存/ 年轻代 (Young Generation)  ：1 个 Eden 2 个 Survivor (`Eden区和Survivor0、Survivor1的比例是8:1:1`)
2. 老生代(Old Generation)     2/3 的堆空间

**---------Young + Old = Heap---------**

1. 永久代(Permanent Generation)

大部分情况，对象都会首先在 Eden 区域分配。如果对象在 Eden 出生并经过第一次 Minor GC后仍然能够存活，并且能被 Survivor 容纳的话，将被移动到 Survivor 空间（SO 或者s1）中，并将对象年龄设为 1（Eden 区->Survivor 区后对象的初始年龄变为1）。

对象在 Survivor 中每熬过一次 MinorGC，年龄就增加1岁，当它的年龄增加到一定程度（默认为15岁），就会被晋升到老年代中。对象晋升到老年代的年龄阈值，可以通过参数一XX: MaxTenuringThreshold来设置。

![堆内存结构](http://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/hotspot-heap-structure.png)



复制算法用于年轻代（大部分对象的生命周期较短），标记-整理算法用于老年代。

1. 标记-清除算法（Mark and Sweep）：该算法分为两个阶段。首先，通过根对象开始，标记所有从根对象可达的存活对象。然后，在清除阶段，清除未被标记的对象，释放其占用的内存空间。标记-清除算法可能导致内存碎片化问题。
2. 复制算法（Copying）：该算法将内存分为两个区域，通常是年轻代的Eden区和存活区域。在垃圾回收时，将存活的对象从一个区域复制到另一个区域，同时清除已经复制的对象。复制算法解决了内存碎片化问题，但需要额外的复制操作。
3. 标记-整理算法（Mark and Compact）：是根据老年代的特点提出的一种标记算法, 让所有存活的对象向一端移动，然后直接清理掉端边界以外的内存。
4. 分代收集算法（Generational）：该算法基于一种观察，即大部分对象很快变成垃圾。根据对象的生命周期，将内存划分为不同的代（例如年轻代和老年代），并针对不同代采用不同的收集算法，如复制算法用于年轻代，标记-压缩算法用于老年代。

内存连续空间：eden区通过复制/清除算法保证了读写连续性(因为新生代的对象产生和销毁非常频繁,所以才采用了清空的方式)



##### 方法区

> JIT 代码缓存  TODO description
>
> 虽然 Java 虚拟机规范把`方法区`描述为堆的一个逻辑部分，但是它却有一个别名叫做 `Non-Heap（非堆）`，目的应该是与 Java 堆区分开来。

当程序运行时被加载到内存后，这些符号才有对应的内存地址信息。这些常量一旦被转入内存就会变成**运行时**常量池。运行时常量池在方法区中。

![method-area-jdk1.7](http://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/method-area-jdk1.7.png)









#### # 类加载器

![8468A0AF-362C-40A8-A0D9-D3837C925B83_1_101_o](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/8468A0AF-362C-40A8-A0D9-D3837C925B83_1_101_o.jpeg)

























#### # Other



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







#### # 面试题

> 默认的栈大小

Hotspot x64 印象中是  1MB   1024kb   

也就是如果方法栈累加超过这个大小就会报错栈溢出





> Eden survival0 survival1

Eden 新生代垃圾回收 --> survivor 区 (S0, S1都有可能)

==> Eden 区-> Survivor 区后对象的初始年龄变为 1

年龄范畴  0 ~ 15, 因为 记录年龄的区域在对象头中，这个区域的大小通常是 4 位 (1111)







.new创建的对象一定在java堆吗，局部变量是基本类型创建在哪，如果基本类型是成员变量呢

不一定内存逃逸？？？    栈    堆？

> 是的一定在堆

3.jvm堆内存详细说说，为什么要这么划分，用的垃圾回收算法

> JVM笔记，新生代用coping 算法，老年代用 mark-compact      分代收集算法-根据每个内存块的特性分配不同的收集算法（新生代死亡多，老年代存活多）

4.什么时候会发生full gc

> **1.** **调用** **System.gc()** 只是建议虚拟机执行 Full GC，但是虚拟机不一定真正去执行。不建议使用这种方式，而是让虚拟机管理内存。
>
> **2. 未指定老年代和新生代大小，堆伸缩时会产生fullgc,所以一定要配置-Xmx、-Xms**
>
> **3.** **老年代空间不足**

5.full gc对程序的影响

> 1. 会导致应用程序的暂停
> 2. 消耗较大的系统资源，包括CPU和内存   降低应用程序的执行效率

6.怎么解决full gc

> 1. 堆内存调整
> 2. 尽量减少无用的对象创建和引用    检查内存泄漏（Threadlocal）
> 3. 对象生命周期管理：合理管理对象的生命周期，尽量让对象能够在新生代中被回收，减少进入老年代的对象数量。通过调整新生代的大小、Survivor区的比例等参数，可以控制对象在各个内存区域的流动，避免频繁触发Full GC。
> 4. 分析和调优工具



#### # 场景题

##### OOM常见原因：

1. 内存资源耗尽未释放（死循环、ThreadLocal？）
2. 本身资源不够
   1. Linux 用 `jmap -heap` 分析
   2. Windows 用 `jvisualvm` 图形化分析



##### 排查

1. linux 的话通过设置参数设置 dump 文件输出到磁盘
2. dump 文件放到 win 的 jvisualvm 
3. 分析 GCroot 的堆栈信息定位业务代码
   1. at UserService.getUsers（UserService.java：17）
      Local Variable:java.util.ArrayList#18

![image-20240326115638077](http://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/image-20240326115638077.png)

