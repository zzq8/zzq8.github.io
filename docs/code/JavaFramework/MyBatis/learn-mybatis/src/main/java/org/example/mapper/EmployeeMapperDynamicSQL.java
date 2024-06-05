package org.example.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.example.bean.Employee;


public interface EmployeeMapperDynamicSQL {
	
	public List<Employee> getEmpsTestInnerParameter(Employee employee);

	public List<Employee> getEmpsByConditionForeach(@Param("ids") List<Integer> ids);
}
