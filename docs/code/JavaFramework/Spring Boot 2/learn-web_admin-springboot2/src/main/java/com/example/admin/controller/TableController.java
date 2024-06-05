package com.example.admin.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.admin.bean.User;
import com.example.admin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * @author zzq
 * @date 2021/12/28 19:09
 */
@Controller
public class TableController {

    @GetMapping("/basic_table")
    public String basic_table() {

        return "table/basic_table";
    }

    @Autowired
    UserService userService;

    @GetMapping("/user/delete/{id}")
    public String delete(@PathVariable("id") Integer id,
                         @RequestParam("pn") Integer pn,
                         RedirectAttributes attributes){
        userService.removeById(id);
        attributes.addAttribute("pn", pn);
        return "redirect:/dynamic_table";
    }

    @GetMapping("/dynamic_table")
    public String dynamic_table(@RequestParam(value = "pn",defaultValue = "1") Integer pn,
                                Model model) {

        Page<User> page = new Page<>(pn, 2);
        Page<User> userPage = userService.page(page);
//
//        attributes.addAttribute("page",userPage);
        model.addAttribute("pages",userPage);
        return "table/dynamic_table";
    }

    @GetMapping("/responsive_table")
    public String responsive_table() {
        return "responsive_table";
    }

    @GetMapping("/editable_table")
    public String editable_table() {
        return "editable_table";
    }
}
