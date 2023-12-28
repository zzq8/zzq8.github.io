# [Regular Expression](https://regexr-cn.com/)

> 正则很多地方都可以用，各类文本编辑器！处理文本等工作效率 up     XD：受益匪浅，就在title网站去学！！！

# 一、日常问题

## 1.匹配空行

> `^\s*$`                     （* 指空格出现 0 次或多次）->  \* 匹配0个或更多前面的标记。

1）除了常使用 ^ 另外 $ 也可以熟练用起来

2）正则匹配0次必须加星



## 2.* / + 使用错误

> 做 LeetCode 发现

"the sky is blue".split("\\s*");  //以 Char 为单位

"the sky is blue".split("\\s+");  //以 Word 为单位  



## > 非集

> 匹配不在集合中的任何字符。   
>
> 场景：我匹每行开头不是 a 的  `^[^a]`



## > capturing group

> 场景：sublime中 我个人频繁用到，替换东西时候又得带上原先的。。。$1..$n 可以复用 find 里被()包裹的组
>
> 把多个标记分在同一组并创建一个捕获分组，用来创建子串或引用。

Target - *hahaha* *ha*a *ha*h!

Find：(ha)+

Replace：$1



突然发现 Java 正则也可以用复用这个组的概念：

```java
public static void main(String[] args) {
        String input = "#0:%洪都%;#1:%洪都%;#2:%洪都%;#3:0;#4:150;";

        // 定义正则表达式匹配模式
        String regex = "#\\d+:(.*?);";

        // 创建 Pattern 对象
        Pattern pattern = Pattern.compile(regex);

        // 创建 Matcher 对象
        Matcher matcher = pattern.matcher(input);

        // 创建集合存储提取的结果
        List<String> partsList = new ArrayList<>();

        // 迭代匹配结果并提取部分内容
        while (matcher.find()) {
            String part = matcher.group(1);
            partsList.add(part);
        }

        // 打印提取的结果
        for (String part : partsList) {
            System.out.println("提取的部分内容: " + part);
        }
    }
```



## > lzay(?)

> 场景：[\s\S]*? World xxxxxWorld，这样只会匹配到前面
>
> 令前面的标记变慵懒，让其尽可能少地匹配字符。默认情况下，量词是贪婪的会尽可能多地匹配字符。

```
b\w+?
```

------

```
b *be* *be*e *be*er *be*ers
```



## > positive lookahead / negative lookahead

> 匹配主表达式后面的组而不将其包含在结果中。 (?=ABC)
>
> 指定主表达式后无法匹配的组（如果匹配，则结果将被丢弃）。(?!ABC)

(?=ABC)

```
\d(?=px)
```

------

1pt `2`px 3em `4`px



(?!ABC)

```
\d(?!px)
```

------

`1`pt 2px `3`em 4px









## Other

* /：代表正则表达式的头和尾，所以很多时候需要转义再用
  * `\([A-Z])\w+\/\`