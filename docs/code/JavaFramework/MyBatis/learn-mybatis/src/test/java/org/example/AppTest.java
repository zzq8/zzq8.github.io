package org.example;

import static org.junit.Assert.assertTrue;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.example.bean.Department;
import org.example.bean.Employee;
import org.example.bean.Student;
import org.example.mapper.DepartmentMapper;
import org.example.mapper.EmployeeMapperPlus;
import org.example.mapper.StudentMapper;
import org.example.util.MybatisUtils;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

/**
 * Unit test for simple App.
 */
public class AppTest 
{
    /**
     * Rigorous Test :-)
     */
    @Test
    public void shouldAnswerWithTrue() throws IOException {
        //1.mybatis 主配置文件
        String config = "mybatis-config.xml";
        //2.读取配置文件
        InputStream in = Resources.getResourceAsStream(config);
        //3.创建 SqlSessionFactory 对象,目的是获取 SqlSession
        SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(in);
        //4.获取 SqlSession,SqlSession 能执行 sql 语句
        SqlSession session = factory.openSession();
        //5.执行 SqlSession 的 selectList()
        List<Student> studentList =
                session.selectList("org.example.mapper.StudentMapper.selectStudent");
        //6.循环输出查询结果
        studentList.forEach( student -> System.out.println(student));
        //7.关闭 SqlSession，释
    }

    @Test
    public void test01(){
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        Student student = new Student(null,"张三","547061946",18);
        /**
         * 方法一：
         */
//        int insert = sqlSession.insert("org.example.mapper.StudentMapper.addStudent", student);
        /**
         * 方法二：
         */
        StudentMapper mapper = sqlSession.getMapper(StudentMapper.class);
        mapper.addStudent(student);

        System.out.println(student.getId());

        sqlSession.commit();
        sqlSession.close();
//        System.out.println("插入"+(insert!=1?"失败":"成功"));
    }

    @Test
    public void test02(){
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        StudentMapper mapper = sqlSession.getMapper(StudentMapper.class);
        Map<String, Object> returnMap = mapper.getStudentByIdReturnMap(7);

//        returnMap.forEach((k,v) -> System.out.println("k "+k+" v "+v));
//        原来可以直接sout这个map，大意了，我还以为会输出地址!!!!
        /**
         * 因为AbstractMap重写了toString()
         */
        System.out.println(returnMap.toString());
        sqlSession.close();
    }

    @Test
    public void test03(){
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        StudentMapper mapper = sqlSession.getMapper(StudentMapper.class);
        Map<Integer, Student> map = mapper.getMapPrimaryToEntity();

//        System.out.println(map);
        map.entrySet().forEach(System.out::println);
        System.out.println(map.get(1));

        sqlSession.close();
    }

    /**
     * resultMap
     * 缓存测试
     */
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

    /**
     * 级联属性
     */
    @Test
    public void test05(){
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        EmployeeMapperPlus mapper = sqlSession.getMapper(EmployeeMapperPlus.class);
        Employee empAndDept = mapper.getEmpAndDept(1);
        System.out.println(empAndDept);

        sqlSession.close();
    }

    @Test
    public void test06(){
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        DepartmentMapper mapper = sqlSession.getMapper(DepartmentMapper.class);
        Department deptById = mapper.getDeptById(1);
        System.out.println(deptById);

        sqlSession.close();
    }

    /**
     * 使用association进行分步查询
     * + 鉴别器
     */
    @Test
    public void test07(){
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        EmployeeMapperPlus mapper = sqlSession.getMapper(EmployeeMapperPlus.class);
        Employee empByIdStep = mapper.getEmpByIdStep(2);
//        System.out.println(empByIdStep.getLastName());
//        System.out.println(empByIdStep.getDept().getDepartmentName());
        System.out.println(empByIdStep);
        sqlSession.close();
    }

    /**
     * collection
     */
    @Test
    public void test08(){
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        DepartmentMapper mapper = sqlSession.getMapper(DepartmentMapper.class);
        System.out.println(mapper.getDeptByIdPlus(1));

        sqlSession.close();
    }

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
}
