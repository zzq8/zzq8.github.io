# RuoYi

## *）验证码

验证码生成使用了google kaptcha的验证码组件，没有重复造轮子

```java
@Resource(name = "captchaProducerMath")
private Producer captchaProducerMath;


// 核心方法 --> 返回一个数学表达式类似于： 5-1=?@4
// 这里的验证码生成使用了google kaptcha的验证码组件，没有重复造轮子，具体的生成逻辑作者重写了
// 这里生成表达式的方法（重写）在 com.ruoyi.framework.config包下的KaptchaTextCreator验证码文本生成器类			
String capText = captchaProducerMath.createText();


-----------------------------
Producer 接口下就两个方法
   * BufferedImage createImage(String var1);      //9-8=?@1
   * String createText();    //BufferedImage.class  一张图！
```

