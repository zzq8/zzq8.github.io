package org.example.mapper;

import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Mapper;
import org.example.bean.Student;

import java.util.List;
import java.util.Map;

//@Mapper
public interface StudentMapper {

    // 返回Map集合, key -> 主键值、value -> 对应的实体对象
    @MapKey("id")
    Map<Integer, Student> getMapPrimaryToEntity();

    //map 封装一条记录
    Map<String, Object> getStudentByIdReturnMap(Integer id);

    List<Student> selectStudent();

    void addStudent(Student student);

}
