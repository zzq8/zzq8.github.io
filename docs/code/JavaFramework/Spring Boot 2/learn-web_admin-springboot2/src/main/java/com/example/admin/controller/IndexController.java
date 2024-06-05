package com.example.admin.controller;

import com.example.admin.bean.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.server.Session;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * @author zzq
 * @date 2021/12/28 17:24
 */
@Controller
public class IndexController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @ResponseBody
    @GetMapping("/sql")
    public Long sql(){
        Long aLong = jdbcTemplate.queryForObject("select count(*) from book", Long.class);
        return aLong;
    }


    @GetMapping(value = {"/", "/login"})
    public String loginPage() {

        return "login";
    }

    /**
     * 知识点！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
     * 用 User来封装这两个  =   @RequestParam("username") String username + @RequestParam("password") String password,
     */
    @PostMapping("/login")
    public String main(User user, HttpSession session, Model model) {
        /**
         * Cannot resolve controller URL '/main.html'
         * 这么做的原因是防止表单重复提交
         *              不能直接redirect到html要再写个跳转
         */
//        return "redirect:/main.html";
//        if (StringUtils.hasLength(user.getUserName()) && "1".equals(user.getPassword())) {
        if (true){
            session.setAttribute("loginUser", user);
            return "redirect:/main.html";
        } else {
            model.addAttribute("msg", "账号密码错误");
            return "login";
        }
    }

    @GetMapping("/main.html")
    public String mainPage() {
        return "main";
    }
}
