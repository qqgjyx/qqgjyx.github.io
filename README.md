# juntangw.com

Personal site of Juntang Wang. One hand-written page: `index.html` and `style.css`. No build step, no dependencies.

- **Preview**: open `index.html` in a browser.
- **Deploy**: GitHub Pages serves the branch as is (`.nojekyll`).
- **Links to people and institutions**: `people.js` holds every URL. Write the plain name in `index.html`;
  the script links it in the bio, news and author lines (first mention per paragraph or author line).
- **Add a paper**: copy an `<li>` block inside `<ol class="pubs">` in `index.html`. Teasers go in `images/teasers/`: 600x400 JPEG, the poster if there is one, else a key slide or figure, fitted on white. The teaser is the link to the poster; the link row holds only Paper, arXiv and Code.
- **Old links**: `files/` keeps the PDF paths of both old sites (Jekyll `p01-...` names and Astro `p-...` names, identical content, stored once by Git), and the folders such as `publications/` and `about.html` are one-line redirect pages to the home page, so links into the old multi-page site keep working.
