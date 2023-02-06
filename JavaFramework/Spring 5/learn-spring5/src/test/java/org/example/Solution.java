package org.example;

import java.util.*;

class Solution {
    public static String findLongestWord(String s, List<String> list) {
        Collections.sort(list, (a,b)->{
            if (a.length() != b.length()) return b.length() - a.length();
            return a.compareTo(b);
        });

        list.stream().forEach(System.out::println);

        int n = s.length();
        for (String ss : list) {
            int m = ss.length();
            int i = 0, j = 0;
            while (i < n && j < m) {
                if (s.charAt(i) == ss.charAt(j)) j++;
                i++;
            }
            if (j == m) return ss;
        }
        return "";
    }

    public static void main(String[] args) {
        List<String> list = Arrays.asList("ale","apple","monkey","plea");


        System.out.println(findLongestWord("abpcplea", list));
    }
}