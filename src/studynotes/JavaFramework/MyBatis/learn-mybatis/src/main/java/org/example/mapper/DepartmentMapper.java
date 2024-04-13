package org.example.mapper;


import org.example.bean.Department;

public interface DepartmentMapper {
	
	public Department getDeptById(Integer id);

	public Department getDeptByIdPlus(Integer id);

	public Department getDeptByIdStep(Integer id);
}
