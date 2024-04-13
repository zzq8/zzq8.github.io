public class Father {

    void method(String s1, int i){

    }

    void method(int i, String s1){

    }

    void method(String... s){

    }


    public static void main(String[] args) {
        Father father = new Father();
        father.method(new String[]{"a", "b"});
    }
}
