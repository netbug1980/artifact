package org.artifact.security.intercept;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

/**
 * Csrf验证Matcher
 * <p>
 * 日期：2015年10月30日
 * 
 * @version 0.1
 * @author Netbug
 */
public class RequiresCsrfMatcher implements RequestMatcher {
	private Pattern allowedMethods = Pattern
			.compile("^(GET|HEAD|TRACE|OPTIONS)$");
	private List<String> ignoreUrlList = new ArrayList<String>();

	public boolean matches(HttpServletRequest request) {
		return !(allowedMethods.matcher(request.getMethod()).matches() || this
				.urlMatches(request));
	}

	private boolean urlMatches(HttpServletRequest request) {
		for (String url : this.ignoreUrlList) {
			if (new AntPathRequestMatcher(url).matches(request)) {
				return true;
			}
		}
		return false;
	}

	public List<String> getIgnoreUrlList() {
		return ignoreUrlList;
	}

	public void setIgnoreUrlList(List<String> ignoreUrlList) {
		this.ignoreUrlList = ignoreUrlList;
	}

}
