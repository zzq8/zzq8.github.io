import org.junit.Test;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;


public class MyTest {

    @Test
    public void test01(){
        System.out.println( System.getProperty("os.name") );
        System.out.println( System.getProperty("os.version") );
        System.out.println( System.getProperty("os.arch") );
    }


    @Test
    public void test02(){
        Map map = System.getenv();
        Iterator it = map.entrySet().iterator();
        while(it.hasNext())
        {
            Map.Entry entry = (Map.Entry)it.next();
            System.out.print(entry.getKey()+"=");
            System.out.println(entry.getValue());
        }


        if (map != null) {

        }
    }



    @Test
    public void test03(){
        Map<String, String> map = new LinkedHashMap<String, String>();
        map.put("4", "d");
        map.put("1", "z");
        map.put("2", "b");
        map.put("3", "c");
        map.put("0", "f");
        map.put("10", "g");
        map.put("999", "e");
        System.out.println("第一种keySet遍历方式");
        for (String s : map.keySet()) {
            System.out.println("key:" + s + "," + "value:" + map.get(s));
        }
        Iterator<String> it = map.keySet().iterator();
        System.out.println("第二种iterator遍历方式");
        while (it.hasNext()) {
            String key = it.next();
            System.out.println("key:" + key + "," + " value:" + map.get(key));
        }


        for (String s : map.keySet()) {
            System.out.println(s);
        }
    }



    @Test
    public void test04(){
        int i = 0;
        i = i ++;
        System.out.println(i); //0
        System.out.println(i); //0
        i ++;
        System.out.println(i); //1
    }

    @Test
    public void test05(){
        String s;
//        System.out.println("s="+s);  //error
    }

}


class B
{
    public static B t1 = new B(); //1
    public static B t2 = new B(); //2
    {
        System.out.println("构造块");
    }
    static
    {
        System.out.println("静态块"); //3
    }
    public static void main(String[] args)
    {
        B t = new B(); //4
    }
}