/**
 * Single source of truth for collaborator names and their personal sites.
 * PubEntry looks up each author name here; matching names get hyperlinked.
 * Names not in this map render as plain text. Self (Juntang) intentionally
 * has no URL — bolded but not linked, since the visitor is already on the
 * site this would link to.
 */
export const people: Record<string, { url?: string }> = {
  "Shixin Xu": {
    url: "https://faculty.dukekunshan.edu.cn/faculty_profiles/shixin-xu",
  },
  "Dongmian Zou": {
    url: "https://faculty.dukekunshan.edu.cn/faculty_profiles/dongmian-zou",
  },
  "Yihan Wang": { url: "https://yihanwang.qqgjyx.com" },
  "Pascal Grange": {
    url: "https://faculty.dukekunshan.edu.cn/faculty_profiles/pascal-grange",
  },
  "Shu Kit Eric Tam": {
    url: "https://faculty.dukekunshan.edu.cn/faculty_profiles/shu-kit-eric-tam",
  },
  "Hao Wu": { url: "https://jaylon1022.github.io" },
  "Jiayu Gao": { url: "https://www.linkedin.com/in/gloria1025/" },
  "Aleksandra Stryjska": {
    url: "https://www.linkedin.com/in/aleksandra-stryjska-862421200/",
  },
  "Xinze Xu": { url: "https://www.linkedin.com/in/xinze-xu-ab278740b/" },
  "Ghulam Hussain": { url: "https://orcid.org/0009-0000-9423-8391" },
  "Sze Chai Kwok": {
    url: "https://faculty.dukekunshan.edu.cn/faculty_profiles/sze-chai-kwok",
  },
  "Xiawa Wang": {
    url: "https://faculty.dukekunshan.edu.cn/faculty_profiles/xiawa-wang",
  },
};
