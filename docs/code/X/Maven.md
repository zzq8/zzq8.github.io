---
article: false
---
# Maven

> 鱼皮这篇讲的细：https://mp.weixin.qq.com/s/mOFjOVYrM_b9I2UlNgeGxg
>
> mvn clean package -Dmaven.test.skip

## TODO

https://blog.csdn.net/weixin_45433031/article/details/125284806 （还需理解到maven笔记，springboot打包插件如果我不加以下会有什么影响：）

# *）Pom文件/Maven：

 * #### [Pom.xml  -> \<relativePath>](https://blog.csdn.net/gzt19881123/article/details/105255138)

   ![image-20221017102235784](https://pub-83c20763effa4ac69b4d6a9e22c9936e.r2.dev/img/202210171022851.png)

   ```
   设定一个空值将始终从仓库中获取，不从本地路径获取，如<relativePath/> 看这句就很明了了！这里就是去本地../bokeerp路径去拿这个pom文件
   Maven parent.relativePath
   默认值为../pom.xml
   查找顺序：relativePath元素中的地址–本地仓库–远程仓库 
   ```

   ==**Maven 寻找父模块pom.xml 的顺序如下：**==

   ```
    (1)  first in the reactor of currently building projects
          这里一个maven概念 反应堆（reactor ），
          意思就是先从工程里面有依赖相关的模块中找你引入的
          parent 的pom.xml，
        
    (2) then in this location on the filesystem
         然后从 你定义的  <relativePath > 路径中找，
         当然你如果只是 /  即空值，则跳过该步骤，  
         默认值 ../pom.xml 则是从上级目录中找啦。
   
    (3)  then the local repository
       这个就不说了，如果 （1） （2） 步骤没有则从 本地仓库找啦。
   
    (4) and lastly in the remote repo
     这个还用说吗，上面都找不到了，最后只能从远程仓库找啦，再找不到就报错给你看 
     
     
   一般新建 Spring Boot 工程，默认是 <relativePath /> <!-- lookup parent from repository --> ，意思就是不会从上层目录寻找。会直接先从 local repository，如果没有则会从 remote repo 寻找，如果也没有，则报错。
   ```



* #### <optional>true</optional>

  * 场景：我发现引入了data-redis，也要引入commons-pool2   不然启动报错

    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
    <dependency>
        <groupId>org.apache.commons</groupId>
        <artifactId>commons-pool2</artifactId>
    </dependency>
    ```

    原因：因为 `spring-boot-starter-data-redis` 下面的 `lettuce-core`

    ```xml
    <dependency>
        <groupId>org.apache.commons</groupId>
        <artifactId>commons-pool2</artifactId>
        <version>2.8.1</version>
        <scope>compile</scope>
        <optional>true</optional>
    </dependency>
    ```

    chatgpt: 在 Maven 的 pom.xml 文件中，可以使用 `<optional>` 标签来指定一个依赖是否是可选的

    这样的设置意味着，当这个依赖被其他模块引用时，它不会自动传递给这些模块。也就是说，如果一个模块引用了这个依赖，但是没有显式声明它，那么这个依赖不会被自动包含在该模块的依赖列表中。

    使用 `<optional>` 标签可以有效地控制依赖的传递性，避免不必要的依赖冲突和版本冲突。例如，如果一个项目需要使用某个第三方库的某个功能，但是这个库又依赖于另外一个库，而这个库和项目中的其他依赖产生了冲突，就可以将这个库设置为可选依赖，只在需要时显式引入，避免不必要的冲突。

    另外，值得注意的是，当一个依赖被设置为可选依赖时，它的传递性也会被取消。这意味着，如果这个依赖还依赖了其他库，这些库也不会自动传递给项目中的其他模块。如果需要使用这些库，也需要显式引入它们。

    总之，使用 `<optional>` 标签可以控制依赖的传递性，避免不必要的依赖冲突和版本冲突，但是需要注意，它的传递性也会被取消，需要手动处理相关的依赖。

    > Q: 2.3.12.RELEASE版本的springboot引入spring-boot-starter-data-redis为什么还需要显式的引入commons-pool2才能正常启动项目
    >
    > 在 Spring Boot 2.3.12.RELEASE 版本中，`spring-boot-starter-data-redis` 依赖中的 `lettuce-core` 版本为 `5.3.2.RELEASE`，它自带了 `commons-pool2` 依赖。但是在这个版本的 Spring Boot 中，`commons-pool2` 的依赖是以 `<optional>true</optional>` 的方式声明的，这意味着在默认情况下不会被引入。
    >
    > 如果你不显式地引入 `commons-pool2` 的依赖，而是只依赖于 `spring-boot-starter-data-redis`，那么在启动应用程序时，就会出现类似于“java.lang.NoClassDefFoundError: org/apache/commons/pool2/impl/GenericObjectPoolConfig”的错误，因为缺少了 `commons-pool2` 的依赖。
    >
    > 为了解决这个问题，你需要在你的 `pom.xml` 文件中显式地引入 `commons-pool2` 的依赖，这样它才会被正确地加载。


​	

* #### 打包jar指定名字

  * ```xml
    <build>
       <finalName>webjava8</finalName>
    ```



* #### dependency scope

场景: 学Spring全家桶, 代码要用 h2 jar里的 API

```xml
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
<!--            import org.h2.tools.Server;   如果这里不注释掉，开发时候导包不进-->
<!--            <scope>runtime</scope>-->
        </dependency>
```

***

XD: 我理解很多module的项目，其中一个module引入了`mybatis-plus-boot-starter`。那么其他module就算用到了它也只要引入的时候`<scope>provided</scope>`一下。避免Maven打包臃肿？



Bingo：

嗯，你的理解是正确的！在一个多模块项目中，如果只有一个模块需要使用`mybatis-plus-boot-starter`，而其他模块也需要使用它提供的功能，你可以通过在其他模块中将依赖的作用域设置为`<scope>provided</scope>`来避免Maven打包结果臃肿。

通过将依赖的作用域设置为`provided`，Maven在编译和测试阶段会将依赖包含在类路径中，以便在编译代码和执行测试时使用。但在部署和运行阶段，Maven会将这些依赖排除在最终的构建结果中。

这样做的好处是，避免了将重复的依赖打包到每个模块中，减小了最终构建结果的大小。同时，由于`mybatis-plus-boot-starter`依赖通常是由一个模块来提供运行时环境，其他模块可以依赖于该模块来获取`mybatis-plus-boot-starter`的功能，而不需要自己打包这些依赖。

需要注意的是，这种使用方式需要确保在部署和运行时提供正确的运行时环境，以便其他模块能够正常使用`mybatis-plus-boot-starter`提供的功能。







当把Maven中的`<scope>provided</scope>`应用于一个依赖时，它代表着你期望该依赖在运行时环境中被提供，比如Web容器或应用服务器。简而言之，它告诉Maven在编译和打包项目时不需要将这个依赖包含进来，因为它将在运行时环境中被提供。

这种依赖通常是一些容器或框架提供的，比如Servlet API或Java EE容器的实现。它们已经存在于运行时环境中，不需要在你的应用程序中显式地包含它们。

举个例子，如果你正在开发一个基于Java EE的Web应用程序，并且使用了Servlet API，你可以将Servlet API作为一个`provided`依赖。这样，Maven在编译和打包你的应用程序时不会包含Servlet API的jar文件，因为它将在Java EE容器中提供。

> Q: 构建和打包项目时为什么要排除MyBatis-Plus框架，但是项目代码又要用


A: 哦，我明白你的疑惑了。在构建和打包项目时排除MyBatis-Plus框架，但又在项目代码中使用它，通常是出于以下几个原因：

减小部署包的大小： MyBatis-Plus框架是一个较大的依赖，它包含了许多功能和类库。如果将MyBatis-Plus框架打包到部署包中，会增加部署包的大小。通过将其排除在构建和打包过程之外，可以减小最终部署包的大小，提高部署效率。

运行时环境提供依赖： MyBatis-Plus框架通常是作为Java应用程序的依赖库使用的，而不是作为独立运行的应用程序。运行时环境（如Java EE容器）通常会提供MyBatis-Plus框架的依赖。因此，在构建和打包过程中排除MyBatis-Plus框架，可以依赖运行时环境提供的版本，避免冗余的依赖。

版本一致性控制： 通过排除MyBatis-Plus框架的构建和打包过程，你可以更好地控制所使用的框架版本。这样，你可以根据项目需求选择特定的版本，并确保项目代码与该版本兼容。

需要注意的是，在项目代码中使用MyBatis-Plus框架时，你需要确保项目的依赖管理正确配置，以便在编译和运行时引入MyBatis-Plus框架。你可以在项目的构建脚本（如Maven的pom.xml文件）中添加MyBatis-Plus框架的依赖，并确保它们在编译和运行时可用。

> Q: mybatis-plus-boot-starter为什么能使用<scope>provided</scope>，使打包不出问题


嗯，mybatis-plus-boot-starter是一个用于集成MyBatis-Plus框架的Spring Boot Starter。它已经针对Spring Boot应用程序进行了特殊处理，使得在使用<scope>provided</scope>时可以正常打包和部署，而不会出现问题。

这是因为mybatis-plus-boot-starter内部已经配置了Spring Boot的自动配置和依赖解析。它会自动检测和加载所需的依赖项，并在应用程序启动时进行适当的配置。这意味着，即使使用了<scope>provided</scope>排除了mybatis-plus-boot-starter的依赖，Spring Boot仍然能够正确地加载和使用MyBatis-Plus框架。

在使用mybatis-plus-boot-starter时，你可以将<scope>provided</scope>应用于其他与运行时环境相关的依赖，例如Servlet API、JSP API等。这样，这些依赖将由运行时环境提供，并不会被打包到最终的构建结果中。

需要注意的是，尽管mybatis-plus-boot-starter在使用<scope>provided</scope>时可以正常工作，但你仍然需要确保在部署和运行时，适当的运行时环境提供了MyBatis-Plus框架所



> 公司Jar包 maven download source失败..判断依据：druid pom有以下两个标签，公司的没有

* 检查依赖项的 POM 文件：在 Maven 项目中，每个依赖项都有一个对应的 POM（Project Object Model）文件。你可以查看该依赖项的 POM 文件，查找是否有指定源码的相关配置。具体来说，检查 `<build>` 部分或 `<plugins>` 部分是否有配置相关的插件或属性来下载源码。



# *）碰到的问题

#### [*）Could not transfer artifact ***maven-default-http-blocker Maven打包报错](https://blog.csdn.net/Herringgg/article/details/126510647)

场景：

```xml
POM File：
<!--		由于这里Maven Remote库用的是http方式，高版本的Maven好像只支持访问https
				1.降低maven版本 现在的版本过高
				2.将镜像仓库的地址改成https类型的;
				3.如果以上两个都不合适可以更改maven中mirrors的配置 使它支持http的地址;-->
		<repository>
			<id>yigo</id>
			<url>http://dev.bokesoft.com:28089/nexus/content/groups/yigo-releases/</url>
			<snapshots>
				<enabled>false</enabled>
			</snapshots>
		</repository>
```



解决：  setting.xml 中加

```xml
<mirror>
    <id>insecure-repo</id>
    <mirrorOf>external:http:*</mirrorOf>
    <url>http://ip:port/uri/</url>
    <blocked>false</blocked>
</mirror>

-----------即-----------

<mirror>
    <id>insecure-repo</id>
    <mirrorOf>external:http:*</mirrorOf>
    <url>http://dev.bokesoft.com:28089/nexus/content/groups/yigo-releases/</url>
    <blocked>false</blocked>
</mirror>
```







#### maven项目pom文件 和 setting文件都有那个标签repository。是不是这两个文件作用一样



不，POM文件和settings文件中的`<repository>`标签具有不同的作用。

在Maven项目中，POM（Project Object Model）文件是项目的核心描述文件，它定义了项目的基本信息、依赖项、构建配置等。POM文件中的`<repository>`标签用于定义项目的仓库配置。仓库是Maven用于下载和管理项目依赖项的地方。通过在POM文件中定义`<repository>`标签，您可以指定要使用的仓库的位置、URL和其他相关信息。

另一方面，settings文件是Maven的全局配置文件，它位于Maven安装目录下的`conf`文件夹中，或者位于用户的`.m2`文件夹中。settings文件中的`<repository>`标签用于配置全局的仓库设置，这些设置将应用于所有Maven项目。通过设置文件中的`<repository>`标签，您可以配置Maven使用的默认仓库、镜像仓库、身份验证等。

因此，虽然POM文件和settings文件中的`<repository>`标签都涉及仓库配置，但它们的作用范围和使用方式不同。POM文件中的`<repository>`标签用于项目级别的仓库配置，而settings文件中的`<repository>`标签用于全局级别的仓库配置。



## 依赖冲突

TODO

* Maven 笔记  https://www.kuangstudy.com/bbs/1556855233068851202
* 最短路径原则: 两级以上的不同级依赖, 选择路径最短
  声明优先原则 : 两级以上的同级依赖,先声明的覆盖后声明的
  同级依赖后加载覆盖先加载原则
