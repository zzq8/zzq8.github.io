# Stream

# 常用的 API

## * flatMap()

> 在 Java 中，`flatMap()` 是 Stream API 中的一个方法，它用于将流中的每个元素映射为一个流，然后将这些流合并为单个流。它的作用是将多个流扁平化为一个流，常用于处理嵌套集合或映射的情况。

```java
List<List<Integer>> nestedList = Arrays.asList(
    Arrays.asList(1, 2, 3),
    Arrays.asList(4, 5, 6),
    Arrays.asList(7, 8, 9)
);

List<Integer> flattenedList = nestedList.stream()
    .flatMap(List::stream)
    .collect(Collectors.toList());

System.out.println(flattenedList);
```



## * forEach()

```
list.stream().forEach(System.out::println);
```









# FAQ

> [取两个集合的某个字段的并集](https://www.yuque.com/bravo1988/java/bacf3g#pArKK)

```java
husbands.stream().flatMap(
                husbands1 -> wives.stream()
                        .filter(wives1 -> husbands1.getFamilyId().equals(wives1.getFamilyId()))
                        //不理解这里husbands1怎么就绑上了wives1，而不是按照husbands1 list 取
                        .map(wives1 -> husbands1.getUserName()+"-"+wives1.getUserName()))
        .collect(Collectors.toList()).forEach(System.out::println);
```