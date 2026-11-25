// One place for every link to a person or institution.
// In index.html, write the plain name ("Hao Wu"). This script turns it into a link,
// in the bio, the news and every author line. To add or fix a link, edit this list only.
//
// Rules: the name must match exactly; within one paragraph or author line only the first
// mention is linked; text that is already a link is left alone.

const LINKS = {
  // People
  "Tomaso Poggio": "https://poggio-lab.mit.edu/",
  "Yilun Du": "https://yilundu.github.io/",
  "Rong Ma": "https://hsph.harvard.edu/profile/rong-ma/",
  "Shixin Xu": "https://sites.google.com/site/shixinxupage/",
  "Dongmian Zou": "https://faculty.dukekunshan.edu.cn/faculty-profiles/dongmian-zou/",
  "Xiaobai Sun": "https://scholars.duke.edu/person/xiaobai.sun",
  "Hao Wu": "https://jaylon1022.github.io/",
  "Yihan Wang": "https://yihanwang.qqgjyx.com/",
  "Jiayu Gao": "https://www.linkedin.com/in/gloria1025/",
  "Sze Chai Kwok": "https://www.kwoklab.org/",
  "Shu Kit Eric Tam": "https://faculty.dukekunshan.edu.cn/faculty-profiles/shu-kit-eric-tam/",
  "Pascal Grange": "https://faculty.dukekunshan.edu.cn/faculty-profiles/pascal-grange/",
  "Aleksandra Stryjska": "https://www.linkedin.com/in/aleksandra-stryjska-862421200/",
  "Xiawa Wang": "https://faculty.dukekunshan.edu.cn/faculty-profiles/xiawa-wang/",
  "Ghulam Hussain": "https://www.linkedin.com/in/ghulam-hussain-396b0128a/",
  // No public page known (2026-11-25): Jianke Cen, Xinze Xu, Yihen Han, Qinyi Chen.

  // Institutions
  "Harvard University": "https://seas.harvard.edu/masters-data-science",
  "MIT McGovern Institute": "https://mcgovern.mit.edu/",
  "Broad Institute": "https://www.broadinstitute.org/",
  "Duke Kunshan University": "https://www.dukekunshan.edu.cn/",
  "Duke University": "https://duke.edu/",
};

(function linkNames() {
  // Longest first, so "Duke Kunshan University" wins over "Duke University" where both could match.
  const names = Object.keys(LINKS).sort((a, b) => b.length - a.length);
  const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`(?<![\\w-])(${names.map(escape).join("|")})(?![\\w-])`);

  document.querySelectorAll(".bio p, .news td, .authors").forEach((block) => {
    const done = new Set();
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement.closest("a") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    for (let node of textNodes) {
      let m;
      while (node && (m = pattern.exec(node.data))) {
        const name = m[1];
        const rest = node.splitText(m.index);
        node = rest.splitText(name.length);
        if (done.has(name)) continue;
        done.add(name);
        const a = document.createElement("a");
        a.href = LINKS[name];
        rest.replaceWith(a);
        a.append(rest);
      }
    }
  });
})();
