import { navButton,
    fetchThreads,
    refreshPage } from "./questionUtils.js"

let currentPage = 1;
let pageMode = 'recent';
let lastPageEl

window.addEventListener("load", async (event) => {
    const searchTerm = document.getElementById('searchTerm').innerText
    const res = await fetch(`/api/search?search=${searchTerm}`)
    let postArr = await res.json()
    postArr = postArr.threads
    console.log("postArr", postArr)
    debugger
    let pageData = await fetchThreads(postArr, 1);
    refreshPage(pageData);

    const totalPages = Math.ceil(postArr.length / 10);
    const container = document.getElementById('pageSelection');

    if (totalPages > 1) {
    lastPageEl=navButton('Prev', container, lastPageEl);
      for (let i = 1; i <= totalPages; i++) {
        if( i === 1) {
            lastPageEl=navButton(i, container, lastPageEl, true);
        } else {
            lastPageEl=navButton(i, container, lastPageEl);
        }
      }
      lastPageEl=navButton('Next', container, lastPageEl);
    }

    container.addEventListener('mouseup', async (event) => {
      if(event.target.nodeName !== "DIV") {


      const currentPageSave = currentPage;
      const target = event.target.innerText;
      if (target === 'Prev' && currentPage > 1) {
        currentPage--;
      } else if (target === 'Next' && totalPages > currentPage) {
        currentPage++;
      } else {
        if (currentPage !== target && target !== 'Prev' && target !== 'Next') {
          lastPageEl.classList.remove("numberedButton--selected")
          event.target.classList.add("numberedButton--selected")
          lastPageEl=event.target
          currentPage = Number.parseInt(target, 10);
          console.log(target)
        }
      }
      if (currentPage !== currentPageSave) {
        pageData = await fetchThreads(postArr, currentPage);
        refreshPage(pageData);
      }
    }
    });
})
