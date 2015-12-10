package org.artifact.base.util;

import java.io.File;
/**
 * 提取Window 10 聚焦图片
 * <p>
 * 日期：2015年12月10日
 * 
 * @version 0.1
 * @author Netbug
 */
public class ExtractFocusPicture {
	private String focusPath = "C:/Users/Leisen/AppData/Local/Packages/Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy/LocalState/Assets";
	private String savedPath = "C:/Users/Leisen/Pictures/Saved Pictures";

	public ExtractFocusPicture() {
		File f = new File(focusPath);
		if (f.isDirectory()) {
			File[] fileArr = f.listFiles();
			for (File s : fileArr) {
				File t = new File(savedPath + File.separator + s.getName()
						+ ".jpg");
				if (!t.exists()) {
					FileUtil.copy(s, t);
				}
			}
		}
	}

	public static void main(String[] args) {
		new ExtractFocusPicture();
	}

	public String getFocusPath() {
		return focusPath;
	}

	public void setFocusPath(String focusPath) {
		this.focusPath = focusPath;
	}

	public String getSavedPath() {
		return savedPath;
	}

	public void setSavedPath(String savedPath) {
		this.savedPath = savedPath;
	}

}
