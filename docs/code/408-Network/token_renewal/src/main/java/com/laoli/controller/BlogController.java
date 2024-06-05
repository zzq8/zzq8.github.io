package com.laoli.controller;

import com.laoli.model.ResponseModel;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class BlogController {
    @PostMapping("/blog")
    public ResponseModel blog(){
        return new ResponseModel(200,"success","发布成功");
    }
}
