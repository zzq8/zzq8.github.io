package com.example.web.controller;

import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author zzq
 * @date 2021/12/28 14:17
 */
@RestController
public class ParameterTestController {

    @GetMapping("/car/{id}/owner/{username}")
    public Map<String, Object> getCar(@PathVariable("id") Integer id,
                                      @PathVariable("username") String name,
//                                      所有路径变量都会填充进这个pv
                                      @PathVariable Map<String,String> pv,
                                      @RequestHeader("User-Agent") String userAgent,
//                                      映射将填充所有标头名称和值到这个header
                                      @RequestHeader Map<String,String> header,
                                      @RequestParam("age") Integer age,
                                      @RequestParam("interest") List<String> interest,
//                                      注意这里是Map 基础知识key不能重复，所以上面就算interest有多个值，这个map里面的只有一个
//                                      @RequestParam Map<String,String> params,
                                      @RequestParam MultiValueMap<String,String> params){
        HashMap<String, Object> map = new HashMap<>();
//        map.put("id", id);
//        map.put("name", name);
//        map.put("pv", pv);

//        map.put("userAgent",userAgent);
//        map.put("header",header);

        map.put("age", age);
        map.put("interest", interest);
        map.put("params", params);
        return map;
    }
}
