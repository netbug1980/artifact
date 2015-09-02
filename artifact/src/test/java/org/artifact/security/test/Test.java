/**
 * 
 */
package org.artifact.security.test;

import java.util.Arrays;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * <p>
 * 日期：2015年8月24日
 * 
 * @version 0.1
 * @author Netbug
 */
public class Test {
	@org.junit.Test
	public void testHashcode(){
		String[] aa = {"bb","aa"};
		String[] bb = {"bb","aa"};
		System.out.println(aa.hashCode());
		System.out.println(bb.hashCode());
		System.out.println(bb.equals(aa));
		System.out.println(Arrays.hashCode(aa));
		System.out.println(Arrays.hashCode(bb));
		
		String cc = "aa"+"bbb";
		String dd = "aa"+"bbb";
		System.out.println(cc.hashCode());
		System.out.println(dd.hashCode());
		System.out.println(Test.class.getName());
		System.out.println(("org.artifact.base.util.JsonResult").hashCode());
		BCryptPasswordEncoder  aaaa = new BCryptPasswordEncoder();
		System.out.println(aaaa.encode("123456"));
	}
}
