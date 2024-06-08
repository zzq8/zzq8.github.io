---
article: false
---
# MyBatis

> 2022/1/13  自己很久以前学了这一套但学的不系统，现在花3-4天重新过一遍，并归纳总结为笔记。 from: XD
>
> 
>
> MyBatis 框架： MyBatis 本是 apache 的一个开源项目 iBatis, 2010 年这个项目由 apache software foundation 迁移到了 google code，并且改名为 MyBatis 。2013 年 11 月迁移到 Github。
>
> 
>
> XD `MyBatis本身并不提供连接池功能，它主要关注于SQL映射和数据库操作的框架。连接池是与数据库交互的一部分，但并不是MyBatis默认的方式。`
>
> 在使用MyBatis时，你可以选择使用第三方的连接池库来管理数据库连接。常见的连接池库包括：
>
> Apache Commons DBCP
> `HikariCP`
> C3P0
> `Druid`

## 一、Hello World

### 1. 搭建环境

有什么问题优先看官网  [MyBatis中文网](https://mybatis.net.cn/)

#### 1.1.  搭建数据库MySQL

略

#### 1.2. idea 环境

##### 1.2.1. Maven

```xml
<!-- https://mvnrepository.com/artifact/log4j/log4j -->
<dependency>
    <groupId>log4j</groupId>
    <artifactId>log4j</artifactId>
    <version>1.2.17</version>
</dependency>

<!-- https://mvnrepository.com/artifact/org.mybatis/mybatis -->
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.4.6</version>
</dependency>

<!-- https://mvnrepository.com/artifact/mysql/mysql-connector-java -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.47</version>
</dependency>

<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.11</version>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.22</version>
</dependency>

<!--因为我是把StudentMapper.xml放在java目录下的，需配置。如果是放resources则不用配这个-->
<build>
    <resources>
        <resource>
            <directory>src/main/java</directory>
            <includes>
                <include>**/*.xml</include>
            </includes>
        </resource>
    </resources>
</build>
```

##### 1.2.2. jdbc.properties

```properties
driver=com.mysql.jdbc.Driver
#注意这个useSSL=false，一开始我用的true报错  [解决](https://blog.csdn.net/a704397849/article/details/93797529)
url=jdbc:mysql://localhost:3306/mybatis?useSSL=false&amp;useUnicode=true&amp;characterEncoding=utf8
username=root
password=123456
```

##### 1.2.3. log4j.properties

```properties
#如果一个数据库操作出现了异常，我们需要排错。日志就是最好的助手！！！
#这里的配置暂时不深究
log4j.rootLogger=DEBUG, Console

#Console
log4j.appender.Console=org.apache.log4j.ConsoleAppender
log4j.appender.Console.layout=org.apache.log4j.PatternLayout
log4j.appender.Console.layout.ConversionPattern=%d [%t] %-5p [%c] - %m%n  

log4j.logger.java.sql.ResultSet=INFO
log4j.logger.org.apache=INFO
log4j.logger.java.sql.Connection=DEBUG
log4j.logger.java.sql.Statement=DEBUG
log4j.logger.java.sql.PreparedStatement=DEBUG
```

##### 1.2.4. mybatis-config.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!--
    <!ELEMENT configuration 标签需按照下面这个顺序来
    (properties?, settings?, typeAliases?, typeHandlers?, objectFactory?,
    objectWrapperFactory?, reflectorFactory?, plugins?, environments?, databaseIdProvider?, mappers?)>
    -->

    <!--
		properties: 引入外部properties文件 必须放在最前面,否则会报错
			resource: 类路径下
			url: 磁盘路径或网络路径
 	-->
    <properties resource="jdbc.properties"/>

    <!-- 设置日志输出, 方便观察sql语句和参数 -->
    <settings>
        <setting name="logImpl" value="LOG4J"/>
        <setting name="mapUnderscoreToCamelCase" value="true"/>
        
        <!--显示的指定每个我们需要更改的配置的值，即使他是默认的。防止版本更新带来的问题  -->
		<setting name="lazyLoadingEnabled" value="true"/>
		<setting name="aggressiveLazyLoading" value="false"/>
    </settings>

<!--
    注意这些标签有先后顺序的，下面这个必须放settings后面！！
-->
    <typeAliases>
        <package name="org.example.bean"/>
    </typeAliases>

    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${driver}"/>
                <property name="url" value="${url}"/>
                <property name="username" value="${username}"/>
                <property name="password" value="${password}"/>
            </dataSource>
        </environment>
    </environments>

    <mappers>
        <mapper resource="org/example/mapper/xml/StudentMapper.xml"/>
    </mappers>
</configuration>
```

ps:

```xml
<!--我的这里如果这么配不会生效，因为需要映射文件名字要和接口文件相同,还需要放在同一个包下-->
<mappers>
       <package name="org.example.mapper"/>
</mappers>
```





### 2. 编写代码

#### 2.1. MyBatisUtil 工具类

```java
package org.example.util;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;

/**
 * 因为每次测试类都需要写很多重复代理，这里给个工具类稍微封装一下
 */
public class MybatisUtils {

    private static SqlSessionFactory sqlSessionFactory;

    static{
        try {
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static SqlSession getSqlSession(){
        return sqlSessionFactory.openSession();
    }
}
```

#### 2.2. 增删改查

具体的一些写法看官网，这里只贴出一个简单的测试。

```java
@Test
public void test01(){
    SqlSession sqlSession = MybatisUtils.getSqlSession();
    Student student = new Student(null,"张三","547061946",18);
    /**
    * 方法一：
    */
    //int insert = sqlSession.insert("org.example.mapper.StudentMapper.addStudent", student);
    /**
    * 方法二：
    */
    StudentMapper mapper = sqlSession.getMapper(StudentMapper.class);
    mapper.addStudent(student);

    System.out.println(student.getId());

    sqlSession.commit();
    sqlSession.close();
    //System.out.println("插入"+(insert!=1?"失败":"成功"));
}
```

![image-20220112112209272](https://image.zzq8.cn/img/202201121135959.png)





## 二、映射文件

### 1. 获取自增主键的值

```xml
    <!--
        useGeneratedKeys="true": 开启获取自增主键的策略
        keyColumn: 指定数据库主键的列名
        keyProperty: 指定对应的主键属性, ps(获取到主键值后, 将这个值封装给javaBean的哪个属性)
    -->
    <insert id="addStudent" parameterType="org.example.bean.Student" useGeneratedKeys="true" keyProperty="id">
        insert student(name,email,age) values(#{name},#{email},#{age})
    </insert>
```



### 2. 参数处理

#### 2.1. 单个参数

\#{arg}: 直接取出参数值；只有一个参数时可以随便写

#### 2.2. 多个参数

MyBatis会做特殊处理，多个参数会被封装成一个 **Map**，参数可以使用 `#{arg0}` 或 `#{param1}`这种形式取出

#### 2.3. 命名参数

使用注解 `@Param` 指定参数的 `key`

注解：

```java
// 命名参数
User getAnnoParam(@Param("name") String name,String pwd);
```

获取：

```xml
<select id="getAnnoParam" resultType="org.hong.pojo.User">
    select * from user where name = #{name} and pwd = #{param2}
</select>
```

#### 2.4. POJO

多个参数正好是业务逻辑的数据模型(实体类),直接传入**pojo(对象)**

#### 2.4. TO

多个参数不是业务模型中的数据, 但经常要使用, 推荐编写TO(Transfer Object)数据传输对象, 就是再专门写个类



### 3. #{} 和 ${} 的区别

\#{}是占位符，${}是拼接符。

$是先拼接后编译 #是先编译后拼接 这才是主要区别

原生jdbc不支持占位符的地方我们就可以使用${}进行取值，例如分表、排序：

```mysql
select * from ${year}_salary where xxx;
select * from tbl_employee order by ${f_name} ${order}
```

特点：

```plain Text
#{}是预编译处理，${}是字符串替换。
Mybatis 在处理#{}时，会将 sql 中的#{}替换为?号，调用 PreparedStatement 的set 方法来赋值。
Mybatis 在处理$ {}时，就是把${}替换成变量的值。
使用#{}可以有效的防止 SQL 注入，提高系统安全性。
```



### 4. 返回List和Map

#### 4.1. List

正常写~ 只不过返回值是List，resultType还是javaBean

#### 4.2. Map

#### 4.2.1. key -> 列名		value -> 列值

StudentMapper接口：

```java
//map 封装一条记录
    Map<String, Object> getStudentByIdReturnMap(Integer id);
```

StudentMapper.Xml:

```xml
<!--    Map<String, Object> getStudentByIdReturnMap(Integer id);-->
    <select id="getStudentByIdReturnMap" resultType="map">
        select * from student where id = #{id}
    </select>
```

测试:

```java
    @Test
    public void test02(){
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        StudentMapper mapper = sqlSession.getMapper(StudentMapper.class);
        Map<String, Object> returnMap = mapper.getStudentByIdReturnMap(7);

		//returnMap.forEach((k,v) -> System.out.println("k "+k+" v "+v));
		//原来可以直接sout这个map，大意了，我还以为会输出地址!!!!
        /**
         * 因为AbstractMap重写了toString()
         */
        System.out.println(returnMap.toString());
        sqlSession.close();
    }
```

#### 4.2.1. key -> 主键		value -> 实体对象

StudentMapper接口：

```java
// 返回Map集合, key -> 主键值、value -> 对应的实体对象
    @MapKey("id")
    Map<Integer, Student> getMapPrimaryToEntity();
```

StudentMapper.Xml:

```xml
<!--    
	Map<Integer, Student> getMapPrimaryToEntity();
	注意这个resultType可不是map，而是实体类
-->
    <select id="getMapPrimaryToEntity" resultType="student">
        select * from student
    </select>
```



### 5. resultType属性

具体看官网~

对于引用数据类型，都是将大写字母转小写，比如 HashMap 对应的别名是 'hashmap' 

基本数据类型考虑到重复的问题，会在其前面加上"_"



### 6. resultMap（自定义结果集映射）

#### 6.1. 简单使用

resultMap的更大作用应该是在于其内部的association标签和collection标签,这两个标签主要用于多表联合查询,以及discriminator鉴别器

如果javaBen属性名和列名不一致, 不应该再使用resultType配置返回值类型，而是使用resultMap引用自定义的结果集映射规则。

mapper.xml：

```xml
	<resultMap type="com.atguigu.mybatis.bean.Employee" id="MySimpleEmp">
		<!--指定主键列的封装规则
		当然主键也可以用column，但id定义主键会底层有优化；
		column：指定哪一列
		property：指定对应的javaBean属性
		  -->
		<id column="id" property="id"/>
		<!-- 定义普通列封装规则 -->
		<result column="last_name" property="lastName"/>
        <!-- 其他列可以不指定，不指定的列会自动封装，但是推荐只要指定resultMap就把全部的映射规则都写上 -->
		<result column="email" property="email"/>
		<result column="gender" property="gender"/>
	</resultMap>
	
	<!-- resultMap:自定义结果集映射规则；  -->
	<!-- public Employee getEmpById(Integer id); -->
	<select id="getEmpById"  resultMap="MySimpleEmp">
		select * from tbl_employee where id=#{id}
	</select>
```

Test：

```java
    @Test
    public void test04(){
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        EmployeeMapperPlus mapper = sqlSession.getMapper(EmployeeMapperPlus.class);
        Employee empById = mapper.getEmpById(1);
        System.out.println(empById);
        sqlSession.close();
    }
```

#### 6.2. association（一对一）

##### 6.2.1.  级联属性封装结果集：

```xml
<!--
	场景一：
		查询Employee的同时查询员工对应的部门
		Employee===Department
		一个员工有与之对应的部门信息；
		id  last_name  gender    d_id     did  dept_name (private Department dept;)
	 -->

	<!--
		联合查询：级联属性封装结果集
	  -->
	<resultMap id="_getEmpAndDept" type="employee">
		<id column="id" property="id"/>
<!--		级联属性，我下面这两个属性爆红，但是不影响-->
		<result column="d_id" property="dept.id"/>
		<result column="dept_name" property="dept.departmentName"/>
	</resultMap>

	<select id="getEmpAndDept" resultMap="_getEmpAndDept">
		select * from tbl_employee e join tbl_dept d
		on e.id = d.id
		where d.id = 1
	</select>
```

##### 6.2.2. 使用association定义关联的单个对象的封装规则：

<font color='red'>探究：为什么这里不会自动封装了 ? </font>

```xml
	<!--
		使用association定义关联的单个对象的封装规则；
		我使用了association后所有的属性都要映射，就算属性和查询后起的别名一样也不行。
	 -->
	<resultMap id="_getEmpAndDept2" type="employee">
		<id column="id" property="id"/>
		<!--发现下面这些不写的话，不会自动封装了-->
		<result column="last_name" property="lastName"/>
		<result column="gender" property="gender"/>
		<result column="email" property="email"/>
		<!--
		association可以指定联合的javaBean对象
		property="dept"：指定哪个属性是联合的对象
		javaType:指定这个属性对象的类型[不能省略]
		-->
		<association property="dept" javaType="department">
			<id column="id" property="id"/>
			<result column="dept_name" property="departmentName"/>
		</association>
	</resultMap>
```

 补充

```xml
	<!--注意：因为字段名是dept_name，而bean类中属性名是departmentName，所以用select * 这样这个字段就封装不上，得像下面这样写-->
	<select id="getDeptById" resultType="department">
		select id,dept_name departmentName from tbl_dept where id=#{id}
	</select>
```

##### 6.2.3. 分步查询

此时产生两条查询语句

```xml
	<!-- 使用association进行分步查询：
		1、先按照员工id查询员工信息
		2、根据查询员工信息中的d_id值去部门表查出部门信息
		3、部门设置到员工中；
	 -->
	<resultMap id="_getEmpByIdStep" type="employee">
		<id column="id" property="id"/>
		<!--其他属性不写也自动封装上了，但建议只要指定resultMap就把全部的映射规则都写上-->

		<!-- association定义关联对象的封装规则
	 		select:表明当前属性是调用select指定的方法查出的结果
	 		column:指定将哪一列的值传给这个方法

	 		流程：使用select指定的方法（传入column指定的这列参数的值）查出对象，并封装给property指定的属性
	 	 -->
		<association property="dept" select="org.example.mapper.DepartmentMapper.getDeptById"
					 column="id"/>
	</resultMap>
	
	<select id="getEmpByIdStep" resultMap="_getEmpByIdStep">
		select * from tbl_employee where id=#{id}
	</select>
```

##### 6.2.4. 延迟加载

在**分布查询**的基础上，我们通过配置文件开启懒加载，只查其中一个表的某个字段就会发现只会产生一次查询！

```xml
 <!-- 可以使用延迟加载（懒加载）；(按需加载)
	 	Employee==>Dept：
	 		我们每次查询Employee对象的时候，都将一起查询出来。
	 		部门信息在我们使用的时候再去查询；
	 		分段查询的基础之上加上两个配置：
	  -->

<!--显示的指定每个我们需要更改的配置的值，即使他是默认的。防止版本更新带来的问题  -->
		<setting name="lazyLoadingEnabled" value="true"/>
		<setting name="aggressiveLazyLoading" value="false"/>
```

按需加载：

![xxx](https://images.zzq8.cn/img/202201121637104.png)

#### 6.3. collection（一对多）

##### 6.3.1. 封装List\<Employee> emps;

注意 collection 里是用的 **ofType** 不要用 javaType

<font color='red'>探究：为什么这里也不会自动封装了 ?</font>  以后还是写resultMap还是写全，尤其是遇到association和collection

```xml
<!--嵌套结果集的方式，使用collection标签定义关联的集合类型的属性封装规则  -->
	<resultMap id="_getDeptByIdPlus" type="department">
		<id column="did" property="id"/>
		<result column="dept_name" property="departmentName"/>
		<!--
			collection定义关联集合类型的属性的封装规则
			ofType:指定集合里面元素的类型
  		-->
		<collection property="emps" ofType="employee">
			<id column="eid" property="id"/>
			<id column="eid" property="id"/>
			<result column="last_name" property="lastName"/>
			<result column="email" property="email"/>
			<result column="gender" property="gender"/>
		</collection>
	</resultMap>
	<select id="getDeptByIdPlus" resultMap="_getDeptByIdPlus">
		SELECT d.id did,d.dept_name dept_name,
			   e.id eid,e.last_name last_name,e.email email,e.gender gender
		FROM tbl_dept d LEFT JOIN tbl_employee e ON d.id=e.d_id
		WHERE d.id=#{id}
	</select>
```

##### 6.3.2. 分步查询

和association是一样的效果，也是按需加载、懒加载

具体步骤：

DepartmentMapper.xml：

```xml
	<!-- collection：分段查询 -->
	<resultMap id="MyDeptStep" type="department">
		<id column="id" property="id"/>
		<id column="dept_name" property="departmentName"/>
		<collection property="emps"
					select="org.example.mapper.EmployeeMapperPlus.getEmpsByDeptId"
					column="{deptId=id}" fetchType="lazy"></collection>
	</resultMap>
	<!-- public Department getDeptByIdStep(Integer id); -->
	<select id="getDeptByIdStep" resultMap="MyDeptStep">
		select id,dept_name from tbl_dept where id=#{id}
	</select>
```

EmployeeMapperPlus.xml：

```xml
<!-- public List<Employee> getEmpsByDeptId(Integer deptId); -->
	<select id="getEmpsByDeptId" resultType="org.example.bean.Employee">
		select * from tbl_employee where d_id=#{deptId}
	</select>
```

Test

```java
    /**
     * collection分步查询
     */
    @Test
    public void test09(){
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        DepartmentMapper mapper = sqlSession.getMapper(DepartmentMapper.class);
        Department deptByIdStep = mapper.getDeptByIdStep(1);
        System.out.println(deptByIdStep.getDepartmentName());
        System.out.println(deptByIdStep.getEmps());
        sqlSession.close();
    }
```



#### 6.4. 扩展

```xml
例：
<collection property="emps"
            select="org.example.mapper.EmployeeMapperPlus.getEmpsByDeptId"
            column="{deptId=id}" fetchType="lazy"></collection>

<!-- 扩展：多列的值传递过去：
			将多列的值封装map传递；
			column="{key1=column1,key2=column2}"
		fetchType="lazy"：表示使用延迟加载；
				- lazy：延迟
				- eager：立即
	 -->
```



#### 6.5. 鉴别器

EmployeeMapperPlus.xml：

```xml
<!-- =======================鉴别器============================ -->
	<!-- <discriminator javaType=""></discriminator>
		鉴别器：mybatis可以使用discriminator判断某列的值，然后根据某列的值改变封装行为
		封装Employee：
			如果查出的是女生：就把部门信息查询出来，否则不查询；
			如果是男生，把last_name这一列的值赋值给email;
	 -->
	<resultMap id="MyEmpDis" type="employee">
		<id column="id" property="id"/>
		<result column="last_name" property="lastName"/>
		<result column="email" property="email"/>
		<result column="gender" property="gender"/>
		<!--
            column：指定判定的列名
            javaType：列值对应的java类型 MyBatis已经对所有java类型起好名了具体看官方文档 -->
		<discriminator javaType="string" column="gender">
			<!--女生  resultType:指定封装的结果类型；不能缺少。/resultMap-->
			<case value="0" resultType="org.example.bean.Employee">
				<association property="dept"
							 select="org.example.mapper.DepartmentMapper.getDeptById"
							 column="{id=d_id}">
				</association>
			</case>
			<!--男生 ;如果是男生，把last_name这一列的值赋值给email; -->
			<case value="1" resultType="org.example.bean.Employee">
				<id column="id" property="id"/>
				<result column="last_name" property="lastName"/>
				<result column="last_name" property="email"/>
				<result column="gender" property="gender"/>
			</case>
		</discriminator>
	</resultMap>






	<select id="getEmpByIdStep" resultMap="MyEmpDis">
		select * from tbl_employee where id=#{id}
	</select>
```

EmployeeMapperPlus.xml：

```xml
	<select id="getDeptById" resultType="department">
		select id,dept_name departmentName from tbl_dept where id=#{id}
	</select>
```

Test：

```java
    /**
     * 使用association进行分步查询
     * + 鉴别器
     */
    @Test
    public void test07(){
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        EmployeeMapperPlus mapper = sqlSession.getMapper(EmployeeMapperPlus.class);
        Employee empByIdStep = mapper.getEmpByIdStep(2);

        System.out.println(empByIdStep);
        sqlSession.close();
    }
```



## 三、动态SQL

场景：只想根据传过来的javaBean对象有值的参数作为条件

### 1. if

> 在 MyBatis 中，`<if>` 标签用于在 SQL 映射文件中进行条件判断。`test` 属性指定了一个表达式
>
> ```xml
> <if test="expression">
>     <!-- SQL 语句片段 -->
> </if>
> ```

xml:

```xml
	<!--
    • if:判断
    • choose (when, otherwise):分支选择；带了break的swtich-case
        如果带了id就用id查，如果带了lastName就用lastName查;只会进入其中一个
    • trim 字符串截取(where(封装查询条件), set(封装修改条件))
    • foreach 遍历集合
         -->
    <!-- 查询员工，要求，携带了哪个字段查询条件就带上这个字段的值 -->
    <select id="getEmpsTestInnerParameter" resultType="org.example.bean.Employee">
        select * from tbl_employee where
        <!-- test：判断表达式（OGNL）
		 	OGNL参照PPT或者官方文档。
		 	  	 c:if  test
		 	从参数中取值进行判断

		 	遇见特殊符号应该去写转义字符：
		 	&&：
		 	-->
        <if test="id != null">
            id = #{id}
        </if>

        <if test="lastName != null and lastName != ''">
            and last_name like #{lastName}
        </if>

        <if test="email!=null and email.trim()!=&quot;&quot;">
            and email=#{email}
        </if>
        <!-- ognl会进行字符串与数字的转换判断  "0"==0 -->
        <if test="gender==0 or gender==1">
            and gender=#{gender}
        </if>
    </select>
```

Test:

```java
    @Test
    public void test01(){
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        EmployeeMapperDynamicSQL mapper = sqlSession.getMapper(EmployeeMapperDynamicSQL.class);
        Employee employee = new Employee(2, "%o%", "11", null);
        List<Employee> list = mapper.getEmpsTestInnerParameter(employee);

        System.out.println(list);
        sqlSession.close();
    }
```

控制台：

```text
Preparing: select * from tbl_employee where id = ? and last_name like ? and email=?
```



### 2. where

基于上面发现**问题**：假如id赋值为null就会出问题 `Preparing: select * from tbl_employee where and last_name like ? and email=? `

```java
/**
    查询的时候如果某些条件没带可能sql拼装会有问题
    1. 给where后面加上1=1，以后的条件都and xxx.（不推荐, 会导致数据库性能损失）
    2. mybaits使用where标签来将所有的查询条件包括在内。
        where只会去掉第一个多出来的and或者or
*/
```



### 3. trim

基于where不能去掉后面多出来的and或者or的**问题**

```xml
<select id="getEmpsByConditionTrim" resultType="com.atguigu.mybatis.bean.Employee">
	 	select * from tbl_employee
	 	<!-- 后面多出的and或者or where标签不能解决 
	 	prefix="":前缀：trim标签体中是整个字符串拼串 后的结果。
	 			prefix给拼串后的整个字符串加一个前缀 
	 	prefixOverrides="":
	 			前缀覆盖： 去掉整个字符串前面多余的字符
	 	suffix="":后缀
	 			suffix给拼串后的整个字符串加一个后缀 
	 	suffixOverrides=""
	 			后缀覆盖：去掉整个字符串后面多余的字符
	 			
	 	-->
	 	<!-- 自定义字符串的截取规则 -->
	 	<trim prefix="where" suffixOverrides="and">
	 		<if test="id!=null">
		 		id=#{id} and
		 	</if>
		 	<if test="lastName!=null &amp;&amp; lastName!=&quot;&quot;">
		 		last_name like #{lastName} and
		 	</if>
		 	<if test="email!=null and email.trim()!=&quot;&quot;">
		 		email=#{email} and
		 	</if> 
		 	<!-- ognl会进行字符串与数字的转换判断  "0"==0 -->
		 	<if test="gender==0 or gender==1">
		 	 	gender=#{gender}
		 	</if>
		 </trim>
	 </select>
```



### 4. choose

choose (when, otherwise):分支选择；**带了break的swtich-case**
如果带了id就用id查，如果带了lastName就用lastName查;只会进入其中一个

```xml
<select id="getEmpsByConditionChoose" resultType="com.atguigu.mybatis.bean.Employee">
    select * from tbl_employee 
    <where>
        <!-- 如果带了id就用id查，如果带了lastName就用lastName查;只会进入其中一个 -->
        <choose>
            <when test="id!=null">
                id=#{id}
            </when>
            <when test="lastName!=null">
                last_name like #{lastName}
            </when>
            <when test="email!=null">
                email = #{email}
            </when>
            <otherwise>
                gender = 0
            </otherwise>
        </choose>
    </where>
</select>
```



### 5. set

场景：只想根据传过来的javaBean对象有值的参数进行修改。null的不改。

问题：存在拼接问题。所以需要\<set>标签解决，也可以使用\<trim>标签解决去掉后面多余的逗号

```xml
<update id="updateEmp">
	 	<!-- Set标签的使用 -->
	 	update tbl_employee 
		<set>
			<if test="lastName!=null">
				last_name=#{lastName},
			</if>
			<if test="email!=null">
				email=#{email},
			</if>
			<if test="gender!=null">
				gender=#{gender}
			</if>
		</set>
		where id=#{id} 
    <!-- 		
		Trim：更新拼串
		update tbl_employee 
		<trim prefix="set" suffixOverrides=",">
			<if test="lastName!=null">
				last_name=#{lastName},
			</if>
			<if test="email!=null">
				email=#{email},
			</if>
			<if test="gender!=null">
				gender=#{gender}
			</if>
		</trim>
		where id=#{id}  -->
	 </update>
```



### 6. foreach

#### 6.1 用法一：

注意：这里的collection只能填list或者是map，如果想填ids，需要在参数上加@Param注解

```xml
	<select id="getEmpsByConditionForeach" resultType="org.example.bean.Employee">
        select * from tbl_employee
        <!--
            collection：指定要遍历的集合：
                list类型的参数会特殊处理封装在map中，map的key就叫list
            item：将当前遍历出的元素赋值给指定的变量
            separator:每个元素之间的分隔符
            open：遍历出所有结果拼接一个开始的字符
            close:遍历出所有结果拼接一个结束的字符
            index:索引。遍历list的时候是index就是索引，item就是当前值
                          遍历map的时候index表示的就是map的key，item就是map的值

            #{变量名}就能取出变量的值也就是当前遍历出的元素
          -->
        <foreach collection="ids" item="item_id" separator=","
                 open="where id in(" close=")">
            #{item_id}
        </foreach>
    </select>
```

Test

```java
@Test
public void test02(){
    SqlSession sqlSession = MybatisUtils.getSqlSession();
    EmployeeMapperDynamicSQL mapper = sqlSession.getMapper(EmployeeMapperDynamicSQL.class);
    List<Employee> list = mapper.getEmpsByConditionForeach(Arrays.asList(1, 2, 3));

    System.out.println(list);
    sqlSession.close();
}
```

#### 6.2 用法二：

注意：需要到数据库连接属性后面加上allowMultiQueries=true；

```xml
<!-- 批量保存 -->
	 <!--public void addEmps(@Param("emps")List<Employee> emps);  -->
	 <!--MySQL下批量保存：可以foreach遍历   mysql支持values(),(),()语法-->
	<insert id="addEmps">
	 	insert into tbl_employee(
	 		<include refid="insertColumn"></include>
	 	) 
		values
		<foreach collection="emps" item="emp" separator=",">
			(#{emp.lastName},#{emp.email},#{emp.gender},#{emp.dept.id})
		</foreach>
	 </insert><!--   -->
	 
	 <!-- 这种方式需要数据库连接属性allowMultiQueries=true；
	 	这种分号分隔多个sql可以用于其他的批量操作（删除，修改） -->
	 <!-- <insert id="addEmps">
	 	<foreach collection="emps" item="emp" separator=";">
	 		insert into tbl_employee(last_name,email,gender,d_id)
	 		values(#{emp.lastName},#{emp.email},#{emp.gender},#{emp.dept.id})
	 	</foreach>
	 </insert> -->
```



### 7. 两个内置参数

场景：

* _databaseId就是代表当前数据库的别名。假如我有两套数据库mysql、oracle，我写一个select方法还得写两套。现在有这个内置参数后可以只写一套在里面做个判断当前数据库是哪一个就好。
* _parameter:代表整个参数。假如我的参数Emloyee为空我where条件又要用这个参数，那这个SQL就没意义。

```xml
<!-- 两个内置参数：
	 	不只是方法传递过来的参数可以被用来判断，取值。。。
	 	mybatis默认还有两个内置参数：
	 	_parameter:代表整个参数
	 		单个参数：_parameter就是这个参数
	 		多个参数：参数会被封装为一个map；_parameter就是代表这个map
	 	
	 	_databaseId:如果配置了databaseIdProvider标签。
	 		_databaseId就是代表当前数据库的别名oracle
	  -->
	  
	  <!--public List<Employee> getEmpsTestInnerParameter(Employee employee);  -->
	  <select id="getEmpsTestInnerParameter" resultType="com.atguigu.mybatis.bean.Employee">
	  		<!-- bind：可以将OGNL表达式的值绑定到一个变量中，方便后来引用这个变量的值 -->
	  		<bind name="_lastName" value="'%'+lastName+'%'"/>
	  		<if test="_databaseId=='mysql'">
	  			select * from tbl_employee
	  			<if test="_parameter!=null">
	  				where last_name like #{lastName}
	  			</if>
	  		</if>
	  		<if test="_databaseId=='oracle'">
	  			select * from employees
	  			<if test="_parameter!=null">
	  				where last_name like #{_parameter.lastName}
	  			</if>
	  		</if>
	  </select>
```



### 8. bind

场景：模糊查询 like ’%e%‘ 。假如我在传值的时候只想传e就可以用bind。像是创造一个变量，给下面用。具体见上面代码



### 9. sql

```xml
	insert into employees(
	 		<!-- 引用外部定义的sql -->
	 		<include refid="insertColumn">
	 			<property name="testColomn" value="abc"/>
	 		</include>
	 	)


	<!-- 
	  	抽取可重用的sql片段。方便后面引用 
	  	1、sql抽取：经常将要查询的列名，或者插入用的列名抽取出来方便引用
	  	2、include来引用已经抽取的sql：
	  	3、include还可以自定义一些property，sql标签内部就能使用自定义的属性
	  			include-property：取值的正确方式${prop},
	  			#{不能使用这种方式}
	  -->
	  <sql id="insertColumn">
	  		<if test="_databaseId=='oracle'">
	  			employee_id,last_name,email
	  		</if>
	  		<if test="_databaseId=='mysql'">
	  			last_name,email,gender,d_id
	  		</if>
	  </sql>
```



## 四、缓存

### 1. 简介

> 其实现在更多的用Redis或者其它的做缓存，mybatis留了Cache接口

1. 什么是缓存 [ Cache ] ? 

- - 存在内存中的临时数据
  - 将用户经常查询的数据放在缓存（内存）中，用户查询数据就不用从数据库中查询，从缓存中查询，从而提高查询效率，解决了高并发系统的性能问题。

2. 为什么使用缓存 

- - 减少和数据库的交互次数，减少系统开销，提高系统效率

3. 什么样的数据能使用缓存？ 

- - 经常查询并且不经常改变的数据

  

### 2. 一级缓存（本地缓存）

#### 2.1. 特点

* sqlSession级别的缓存。一级缓存是一直开启的；SqlSession级别的一个Map

* 与数据库同一次会话期间查询到的数据会放在本地缓存中。  
* 以后如果需要获取相同的数据，直接从缓存中拿，没必要再去查询数据库；		

```java
@Test
public void test04(){
    SqlSession sqlSession = MybatisUtils.getSqlSession();
    EmployeeMapperPlus mapper = sqlSession.getMapper(EmployeeMapperPlus.class);
    Employee empById = mapper.getEmpById(1);
    System.out.println(empById);
    //一些业务代码

    Employee empById1 = mapper.getEmpById(1);
    System.out.println(empById1);
    System.out.println(empById == empById1);
    sqlSession.close();
}
```

![image-20220113092935272](https://images.zzq8.cn/img/202201130929856.png)

#### 2.2. 一级缓存失效情况

> 没有使用到当前一级缓存的情况，效果就是，还需要再向数据库发出查询：

* sqlSession不同。
* sqlSession相同，查询条件不同.(当前一级缓存中还没有这个数据)
* sqlSession相同，两次查询之间执行了增删改操作(这次增删改可能对当前数据有影响)
* sqlSession相同，手动清除了一级缓存 `openSession.clearCache()`（缓存清空）



### 3. 二级缓存

> 基于namespace级别的缓存：一个namespace对应一个二级缓存：

#### 3.1. 工作机制：

1. 一个会话，查询一条数据，这个数据就会被放在当前会话的一级缓存中；

2. 如果会话关闭；一级缓存中的数据会被保存到二级缓存中；新的会话查询信息，就可以参照二级缓存中的内容；	

3. sqlSession===EmployeeMapper==>Employee

   sqlSession===DepartmentMapper===>Department

4. 不同namespace查出的数据会放在自己对应的缓存中（map）

#### 3.2. 效果：

* 数据会从二级缓存中获取
* 查出的数据都会被默认先放在一级缓存中。

* 只有会话提交或者关闭以后，一级缓存中的数据才会转移到二级缓存中

```java
 @Test
    public void test04(){
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        SqlSession sqlSession1 = MybatisUtils.getSqlSession();
        EmployeeMapperPlus mapper = sqlSession.getMapper(EmployeeMapperPlus.class);
        EmployeeMapperPlus mapper1 = sqlSession1.getMapper(EmployeeMapperPlus.class);

        Employee empById = mapper.getEmpById(1);
        sqlSession.close(); //放这个位置，下面这条语句才能命中缓存
        Employee empById1 = mapper1.getEmpById(1);
//        sqlSession.close(); //放这个位置，就只会在这个位置才放入二级缓存，意思就是上面这条语句还是得跑SQL
        sqlSession1.close();
    }
```

#### 3.3. 使用：

1. 开启全局二级缓存配置：`<setting name="cacheEnabled" value="true"/>`
2. 去mapper.xml中配置使用二级缓存：`<cache></cache>`

```xml
	<cache type="org.mybatis.caches.ehcache.EhcacheCache"></cache>
	<!-- <cache eviction="FIFO" flushInterval="60000" readOnly="false" size="1024"></cache> -->
	<!--  
	eviction:缓存的回收策略：
		• LRU – 最近最少使用的：移除最长时间不被使用的对象。
		• FIFO – 先进先出：按对象进入缓存的顺序来移除它们。
		• SOFT – 软引用：移除基于垃圾回收器状态和软引用规则的对象。
		• WEAK – 弱引用：更积极地移除基于垃圾收集器状态和弱引用规则的对象。
		• 默认的是 LRU。
	flushInterval：缓存刷新间隔
		缓存多长时间清空一次，默认不清空，设置一个毫秒值
	readOnly:是否只读：
		true：只读；mybatis认为所有从缓存中获取数据的操作都是只读操作，不会修改数据。
				  mybatis为了加快获取速度，直接就会将数据在缓存中的引用交给用户。不安全，速度快
		false：非只读：mybatis觉得获取的数据可能会被修改。
				  mybatis会利用序列化&反序列的技术克隆一份新的数据给你。安全，速度慢
	size：缓存存放多少元素；
	type=""：指定自定义缓存的全类名；
			实现Cache接口即可；
	-->
```

3. 我们的POJO需要实现序列化接口



### 4. 和缓存有关的设置/属性：

* cacheEnabled=true：false：关闭缓存（二级缓存关闭）(一级缓存一直可用的)
* 每个select标签都有useCache="true"：
  * false：不使用缓存（一级缓存依然使用，二级缓存不使用）

* **每个增删改标签的：flushCache="true"：（一级二级都会清除，默认是true）**

  * 增删改执行完成后就会清除缓存；

  * 测试：flushCache="true"：一级缓存就清空了；二级也会被清除；

  * 查询标签：flushCache="false"：

  * 如果flushCache=true;每次查询之后都会清空缓存；缓存是没有被使用的；

* sqlSession.clearCache();只是清除当前session的一级缓存；

* localCacheScope：本地缓存作用域：（一级缓存SESSION）；当前会话的所有数据保存在会话缓存中；

  * STATEMENT：可以禁用一级缓存；



### 5. 缓存原理图

![image-20220113172652692](https://images.zzq8.cn//img/202201131728029.png)



### 6. 第三方缓存整合

思路：导入相关jar包技术后只要自己写一个cache的实现，保存数据的时候拿第三方来实现。

但还得写实现挺麻烦的，可以去mybaits的项目地址，它都帮你考虑好了，与其他技术的整合都在这个顶级项目地址中，里面也有相关文档地址：其实就是导入相关适配包(整合包)，配置一些xml环境。

![image-20220113112304859](https://images.zzq8.cn//img/202201131123930.png)

具体流程：

1. 导入第三方缓存包即可；
2. 导入与第三方缓存整合的适配包；官方有；
3. mapper.xml中使用自定义缓存 `<cache type="org.mybatis.caches.ehcache.EhcacheCache"></cache>`



## 五、SSM 整合

> 配置地狱，经历过这个阶段后，就会发现SpringBoot真的舒服

### 1. 前言

#### 1.1. 好处

以前光用mybatis时，包扫描xml文件和mapper类得在一个目录下，现在整合spring后可以不用一个目录了。

@Autowired:自动注入mapper；  这样就避免了每要用一个mapper得先SqlSessionFactory还要openSession()这样的一堆操作

#### 1.2. 我的问题

classpath 和 classpath* 区别：

```xml
问题提出：
<!-- 指定MyBatis Mapper文件的位置 -->    <!-- 我就是这里配错了找了半天！！！注意加上 /*.xml -->
<!-- 提出问题：在引入资源文件时，classpath 什么时候用，什么时候不用？  以前这个错误我踩过两次坑，找了很久！！！ -->
<!--猜测：引用包时不加，引用具体文件时候加？-->

目前的答案：
classpath：只会到你的class路径中查找找文件;
classpath*：不仅包含class路径，还包括jar文件中(class路径)进行查找 ---- 够深入的吧
classpath路径是来引用文件的，在编译生成的项目下的bulid/classes/ 下具有的文件都是classpath 路径下的文件，都可以通过classpath：方法获取。
    如何获取项目类编译后的路径
    **String path = 类名.class.getClassLoader().getResource("").getPath();**
"**/" 表示的是任意目录； 
"**/applicationContext-*.xml" 表示任意目录下的以"applicationContext-"开头的XML文件。 
```

### 2. 整合流程

#### 2.1 踩坑

注意加上web模块，配上tomcat：

![image-20220113160558639](https://images.zzq8.cn/img/202201131605840.png)

因为maven项目中的jar是保存在本地仓库中的，而不在你自己的项目中所以把jar包导进去，这样tomcat才跑得起：

![image-20220113160927268](https://images.zzq8.cn/img/202201131609347.png)

#### 2.2. 代码

##### 2.2.1. maven

```xml
<dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.13</version>
      <scope>test</scope>
    </dependency>
    <!-- servlet -->
    <dependency>
      <groupId>javax.servlet</groupId>
      <artifactId>servlet-api</artifactId>
      <version>2.5</version>
    </dependency>
    <!-- jsp -->
    <dependency>
      <groupId>javax.servlet.jsp</groupId>
      <artifactId>jsp-api</artifactId>
      <version>2.2</version>
    </dependency>
    <!-- jstl -->
    <dependency>
      <groupId>javax.servlet</groupId>
      <artifactId>jstl</artifactId>
      <version>1.2</version>
    </dependency>
    <!-- spring-webmvc -->
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-webmvc</artifactId>
      <version>5.2.4.RELEASE</version>
    </dependency>
    <!-- spring-jdbc -->
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-jdbc</artifactId>
      <version>5.2.4.RELEASE</version>
    </dependency>
    <!-- spring-aop是基于aspect, 因此导入aspectjweaver -->
    <dependency>
      <groupId>org.apache.geronimo.bundles</groupId>
      <artifactId>aspectjweaver</artifactId>
      <version>1.6.8_2</version>
    </dependency>
    <!-- lombok -->
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <version>1.18.10</version>
    </dependency>
    <!-- mysql驱动 -->
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <version>5.1.46</version>
    </dependency>
    <!-- druid -->
    <dependency>
      <groupId>com.alibaba</groupId>
      <artifactId>druid</artifactId>
      <version>1.2.4</version>
    </dependency>
    <!-- mybatis -->
    <dependency>
      <groupId>org.mybatis</groupId>
      <artifactId>mybatis</artifactId>
      <version>3.5.3</version>
    </dependency>
    <!-- 日志 -->
    <dependency>
      <groupId>log4j</groupId>
      <artifactId>log4j</artifactId>
      <version>1.2.17</version>
    </dependency>
    <!-- mybatis-spring, mybatis整合spring的jar包 -->
    <dependency>
      <groupId>org.mybatis</groupId>
      <artifactId>mybatis-spring</artifactId>
      <version>2.0.3</version>
    </dependency>
    <!-- MBG -->
    <dependency>
      <groupId>org.mybatis.generator</groupId>
      <artifactId>mybatis-generator-core</artifactId>
      <version>1.4.0</version>
    </dependency>
  </dependencies>
```

##### 2.2.2. web.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <!-- 1.启动Spring容器 -->
    <context-param>
        <!-- 配置Spring配置文件的位置 -->
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:applicationContext.xml</param-value>
    </context-param>
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>

    <!-- 2.SpringMVC的前端控制器, 拦截所有请求 -->
    <servlet>
        <servlet-name>dispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <!-- 配置SpringMVC配置文件的位置 -->
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:spring-mvc.xml</param-value>
        </init-param>
        <!-- 设置启动级别 -->
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>dispatcherServlet</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>

    <!-- 3.字符编码过滤器, 一定放在所有过滤器的前面 -->
    <filter>
        <filter-name>characterEncodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <!-- 设置字符集 -->
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
        <init-param>
            <!-- 是否需要字符编码过滤器设置请求编码, 设置的字符集为encoding -->
            <param-name>forceRequestEncoding</param-name>
            <param-value>true</param-value>
        </init-param>
        <init-param>
            <!-- 是否需要字符编码过滤器设置响应编码, 设置的字符集为encoding -->
            <param-name>forceResponseEncoding</param-name>
            <param-value>true</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>characterEncodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <!-- 4.REST风格的URI -->
    <filter>
        <filter-name>hiddenHttpMethodFilter</filter-name>
        <filter-class>org.springframework.web.filter.HiddenHttpMethodFilter</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>hiddenHttpMethodFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

</web-app>
```

##### 2.2.3. spring-mvc.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/mvc
       http://www.springframework.org/schema/mvc/spring-mvc.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd">

    <!-- SpringMVC配置文件只是控制网站跳转逻辑 -->
    <context:component-scan base-package="org.example" use-default-filters="false">
        <!-- 只扫描控制器 -->
        <context:include-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>

    <!-- 配置视图解析器, 方便页面返回 -->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/views/"/>
        <property name="suffix" value=".jsp"/>
    </bean>

    <!-- 两个标准配置 -->
    <!-- 将SpringMVC不能处理的请求交给Tomcat -->
    <mvc:default-servlet-handler></mvc:default-servlet-handler>
    <!-- 能支持SpringMVC更高级的一些功能, JSR303校验, 快捷的ajax...映射动态请求 -->
    <mvc:annotation-driven></mvc:annotation-driven>

</beans>
```

##### 2.2.3. dbconfig.properties

```properties
jdbc.driverClassName=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/mybatis?useSSL=false&amp;useUnicode=true&amp;characterEncoding=utf8
jdbc.username=root
jdbc.password=123456
```

##### 2.2.4. applicationContext.xml【重头戏】

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/aop
       http://www.springframework.org/schema/aop/spring-aop.xsd
       http://www.springframework.org/schema/tx
       http://www.springframework.org/schema/tx/spring-tx.xsd">

    <!-- Spring配置文件, 这里主要配置和业务逻辑有关的 -->
    <context:component-scan base-package="org.example">
        <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>

    <!-- 引入数据库的配置文件 -->
    <context:property-placeholder location="classpath:dbconfig.properties"></context:property-placeholder>
    <!-- 数据源 -->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="driverClassName" value="${jdbc.driverClassName}"/>
        <property name="url" value="${jdbc.url}"/>
        <property name="username" value="${jdbc.username}"/>
        <property name="password" value="${jdbc.password}"/>
    </bean>

    <!--
	整合mybatis
		目的：1、spring管理所有组件。mapper的实现类。
				service==>Dao   @Autowired:自动注入mapper；  这样就避免了每要用一个mapper得先SqlSessionFactory还要openSession()这样的一堆操作
			2、spring用来管理事务，spring声明式事务
	-->
    <bean id="sessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <!-- 指定MyBatis全局配置文件的位置 -->
        <property name="configLocation" value="classpath:mybatis-config.xml"/>
        <!-- 指定数据源 -->
        <property name="dataSource" ref="dataSource"/>
        <!-- 指定MyBatis Mapper文件的位置 -->    <!-- 我就是这里配错了找了半天！！！注意加上 /*.xml -->
        <!-- 提出问题：在引入资源文件时，classpath 什么时候用，什么时候不用？  以前这个错误我踩过两次坑，找了很久！！！ -->
        <!-- 猜测：引用包时不加，引用具体文件时候加？-->
        <property name="mapperLocations" value="classpath:org/example/mapper/xml/*.xml"/>
    </bean>
    <!-- 配置扫描器, 将Mapper接口生成代理注入到Spring -->
    <bean id="mapperScannerConfigurer" class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <!-- 指定mapper接口所在包 -->
        <property name="basePackage" value="org.example.mapper"/>
        <!-- 指定sqlSessionFactoryBean配置在Spring中的id值 -->
        <property name="sqlSessionFactoryBeanName" value="sessionFactory"/>
    </bean>
    <!-- 配置一个专门用来进行Batch操作的sqlSession -->
    <bean id="sessionTemplate" class="org.mybatis.spring.SqlSessionTemplate">
        <!-- 指定sqlSessionFactory -->
        <constructor-arg name="sqlSessionFactory" ref="sessionFactory"/>
        <!-- 设置执行类型为Batch -->
        <constructor-arg name="executorType" value="BATCH"/>
    </bean>

    <!-- 事务控制 -->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <!-- 控制主数据源 -->
        <property name="dataSource" ref="dataSource"/>
    </bean>
    <!-- 使用xml配置形式的事务(重要的都是使用xml) -->
    <aop:config>
        <!-- 配置切入点表达式 -->
        <aop:pointcut id="txPoint" expression="execution(* org.example.service..*(..))"/>
        <!-- 配置事务增强 -->
        <aop:advisor advice-ref="txAdvice" pointcut-ref="txPoint"></aop:advisor>
    </aop:config>
    <!-- 配置事务增强, 事务如何切入; 并指定事务管理器, 事务管理器名称默认就是transactionManager -->
    <tx:advice id="txAdvice" transaction-manager="transactionManager">
        <tx:attributes>
            <!-- 所有方法都是事务方法 -->
            <tx:method name="*"/>
            <!-- 以get开始的方法设置只读事务, 底层有优化 -->
            <tx:method name="get*" read-only="true"/>
        </tx:attributes>
    </tx:advice>

</beans>
```

##### 2.2.5. log4j.properties

```properties
log4j.rootLogger=DEBUG, Console

#Console
log4j.appender.Console=org.apache.log4j.ConsoleAppender
log4j.appender.Console.layout=org.apache.log4j.PatternLayout
log4j.appender.Console.layout.ConversionPattern=%d [%t] %-5p [%c] - %m%n  

log4j.logger.java.sql.ResultSet=INFO
log4j.logger.org.apache=INFO
log4j.logger.java.sql.Connection=DEBUG
log4j.logger.java.sql.Statement=DEBUG
log4j.logger.java.sql.PreparedStatement=DEBUG
```

##### 2.2.6. mybatis-config.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">

<!-- configuration: 核心配置文件 -->
<configuration>
    <settings>
        <!-- 开启驼峰命名法 -->
        <setting name="mapUnderscoreToCamelCase" value="true"/>
        <!-- 日志 -->
        <setting name="logImpl" value="LOG4J"/>
    </settings>
    <!-- 批量起别名 -->
    <typeAliases>
        <package name="org.example.bean"/>
    </typeAliases>
</configuration>
```

#### 2.3. 项目结构

![image-20220113161851133](https://images.zzq8.cn/img/202201131618205.png)

ps：其他的java类和测试就不贴了，就简单的测了一下。



## 六、逆向工程 ( MBG )

`MyBatis Generator` 简称 `MBG` ，是一个专门为 `MyBatis` 框架使用者定制的**代码生成器**，可以快速的根据表生成对应的映射文件，接口，以及 `bean` 类。支持基本的增删改查，以及 `QBC` 风格的条件查询。但是表连接、存储过程等这些复杂 `sql` 的定义需要我们手工编写

自己用过MyBatis-Plus的，这里就不测了。有需要就去读文档就好。



## 七、MyBatis 运行原理（重点）

1. 获取sqlSessionFactory对象

   * 解析文件的每一个信息保存在Configuration中，返回包含Configuration的DefaultSqlSession；
   * 注意：【MappedStatement】：代表一个增删改查的详细信息

2. 获取sqlSession对象

    * 		返回一个DefaultSQlSession对象，包含Executor和Configuration;

    * 		这一步会创建Executor对象；

3. 获取接口的代理对象（MapperProxy）

    * 		getMapper，使用MapperProxyFactory创建一个MapperProxy的代理对象
    * 		代理对象里面包含了，DefaultSqlSession（Executor）

4. 执行增删改查方法



**总结：**

1. 根据配置文件（全局，sql映射）初始化出Configuration对象

2. 创建一个DefaultSqlSession对象，他里面包含Configuration以及Executor（根据全局配置文件中的defaultExecutorType创建出对应的Executor）

3. DefaultSqlSession.getMapper（）：拿到Mapper接口对应的MapperProxy；

4. MapperProxy里面有（DefaultSqlSession）；

5. 执行增删改查方法：

   1. 调用DefaultSqlSession的增删改查（Executor）；

   2. 会创建一个StatementHandler对象。（同时也会创建出ParameterHandler和ResultSetHandler）

   3. 调用StatementHandler预编译参数以及设置参数值;

      使用ParameterHandler来给sql设置参数

   4. 调用StatementHandler的增删改查方法；

   5. ResultSetHandler封装结果



注意：四大对象每个创建的时候都有一个interceptorChain.pluginAll(parameterHandler);





![image-20220113172923721](https://images.zzq8.cn/img/202201131729864.png)





![image-20220113173017201](https://images.zzq8.cn/img/202201131730320.png)





![image-20220113173036443](https://images.zzq8.cn/img/202201131730556.png)



![image-20220113173101595](https://images.zzq8.cn/img/202201131731716.png)





## 八、插件原理

在四大对象创建的时候

1. 每个创建出来的对象不是直接返回的，而是`interceptorChain.pluginAll(parameterHandler);`
2. 获取到所有的Interceptor（拦截器）（插件需要实现的接口）；

​			调用interceptor.plugin(target);返回target包装后的对象

3. 插件机制，我们可以使用插件为目标对象创建一个代理对象；AOP（面向切面）

​			我们的插件可以为四大对象创建出代理对象；

​			代理对象就可以拦截到四大对象的每一个执行；

```java
public Object pluginAll(Object target) {
    for (Interceptor interceptor : interceptors) {
      target = interceptor.plugin(target);
    }
    return target;
  }
```

插件编写：

1. 编写Interceptor的实现类
2. 使用@Intercepts注解完成插件签名
3. 将写好的插件注册到全局配置文件中



需要知道这四大对象的作用：

![image-20220113173124592](https://images.zzq8.cn/img/202201131731701.png)





![image-20220113173140474](https://images.zzq8.cn/img/202201131731577.png)





![image-20220113173157681](https://images.zzq8.cn/img/202201131731779.png)



## 九、pageHelper 分页查询

插件基于拦截器

应该就是配置拦截器，拦截SQL语句，然后根据分页对象配置的要分几页每页多少条，给予封装。

具体看github官网
