package com.example.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.MatrixVariable;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author zzq
 * @date 2021/12/28 15:19
 */
@Controller
public class RequestController {

    @GetMapping("/goto")
    public String goToPage(HttpServletRequest request) {

        request.setAttribute("msg", "成功了...");
        request.setAttribute("code", 200);

        return "forward:/success"; //测试了一下直接写 success 也可以，不理解这两者的区别
    }

    /**
     * Map<String,Object> map,  Model model, HttpServletRequest request 都是可以给request域中放数据，
     * request.getAttribute();
     */
    @GetMapping("/params")
    public String testParams(Map<String,Object> map,
                             Model model,
                             HttpServletRequest request,
                             HttpServletResponse response){

        map.put("mapMethod","map...");
        model.addAttribute("modelMethod","model...");
        request.setAttribute("requestMethod","request...");

        //这个也是生效的F12看得到 
        Cookie cookie = new Cookie("c1", "v1");
        response.addCookie(cookie);
        return "forward:/success";
    }

    /**
     * 两种方法取 request 的值，一种注解，一种直接拿Request
     *
     * @return Map 是为了方便看结果
     */
    @ResponseBody
    @GetMapping("/success")
    public Map success(@RequestAttribute(value = "msg",required = false) String msg,
                       @RequestAttribute(value = "code",required = false) Integer code,
                       HttpServletRequest request) {
        Map<String, Object> map = new HashMap<>();
        map.put("msg", msg);
        map.put("code", code);
        map.put("request-msg", request.getAttribute("msg"));

        map.put("1",request.getAttribute("mapMethod"));
        map.put("2",request.getAttribute("modelMethod"));
        map.put("3",request.getAttribute("requestMethod"));
        return map;
    }


    /**
     * 矩阵变量
     * http://localhost:8080/car/sell;low=34;brand=byd,audi,yd
     * 注意：现在执行会报错400，因为SpringBoot默认是禁用了矩阵变量的功能
     * 需要手动开启，需要配置。到configuration类里写东西，具体这里自己就没实现了，以后需要用到再弄。
     */
    @GetMapping("/car/sell")
    public Map carsSell(@MatrixVariable("low") Integer low,
                        @MatrixVariable("brand") List<String> brand) {
        Map<String, Object> map = new HashMap<>();

        map.put("low", low);
        map.put("bran", brand);
        return map;
    }
}
