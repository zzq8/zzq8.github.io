package org.example.mapper;


import org.apache.ibatis.annotations.Mapper;
import org.example.bean.Employee;

import java.util.List;

//@Mapper
public interface EmployeeMapper {
	
	public Employee getEmpById(Integer id);
	
	public List<Employee> getEmps();

}
