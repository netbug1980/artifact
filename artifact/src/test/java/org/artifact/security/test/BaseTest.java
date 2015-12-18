package org.artifact.security.test;

import org.springframework.context.support.ClassPathXmlApplicationContext;

public class BaseTest {
	protected static ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext(
			new String[] { "spring-test.xml" });
	
}
