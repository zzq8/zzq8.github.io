package org.example;

import org.apache.ibatis.session.SqlSession;
import org.example.bean.Department;
import org.example.bean.Employee;
import org.example.mapper.DepartmentMapper;
import org.example.mapper.EmployeeMapperDynamicSQL;
import org.example.util.MybatisUtils;
import org.junit.Test;

import java.util.Arrays;
import java.util.List;

public class DynamicSQLTest {

    @Test
    public void test01(){
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        EmployeeMapperDynamicSQL mapper = sqlSession.getMapper(EmployeeMapperDynamicSQL.class);
        Employee employee = new Employee(2, "%o%", "11", null);
        List<Employee> list = mapper.getEmpsTestInnerParameter(employee);

        System.out.println(list);
        sqlSession.close();
    }

    @Test
    public void test02(){
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        EmployeeMapperDynamicSQL mapper = sqlSession.getMapper(EmployeeMapperDynamicSQL.class);
        List<Employee> list = mapper.getEmpsByConditionForeach(Arrays.asList(1, 2, 3));

        System.out.println(list);
        sqlSession.close();
    }
}
