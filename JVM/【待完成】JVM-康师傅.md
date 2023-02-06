> 2022/3/3 开始学习 JVM
>
> 虽然网上有跟着康师傅做的笔记【可以对照着当课件学习】
>
> 但是还是要自己做一遍笔记才是属于自己的知识

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







# JVM的GC 参数为什么要这么命名：xms、xss、xmn和xmn?

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

具体选项:   [java](https://link.zhihu.com/?target=https%3A//docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html%23BABDJJFI)



作者：Home3k
链接：https://www.zhihu.com/question/59957834/answer/170775050
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。