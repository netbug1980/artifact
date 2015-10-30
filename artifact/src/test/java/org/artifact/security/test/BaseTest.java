package org.artifact.security.test;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class BaseTest {
	protected static ApplicationContext ctx = new ClassPathXmlApplicationContext(
			new String[] { "spring-test.xml" });
}
