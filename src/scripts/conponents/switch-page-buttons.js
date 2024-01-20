import { cleanOrCreateBox } from "./elementTools.js";

const localState = {
  page: {
    current: 1,
    maxButtonsShown: 5,
    maxNumber: null,
    maxShown: null,
    minShown: null,
    items: {
      maxNumber: null,
      maxShown: 5,
    },
  },
  selectors: {
    switchPagesBox: "page-switch-buttons-area",
    previousButton: "previous-page-button",
    nextButton: "next-page-button",
    pageNumberButtons: "page-number-buttons",
  },
  images: {
    caretLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M160,48V208L80,128Z" opacity="0.2"></path><path d="M163.06,40.61a8,8,0,0,0-8.72,1.73l-80,80a8,8,0,0,0,0,11.32l80,80A8,8,0,0,0,168,208V48A8,8,0,0,0,163.06,40.61ZM152,188.69,91.31,128,152,67.31Z"></path></svg>`,
    caretRight: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M176,128,96,208V48Z" opacity="0.2"></path><path d="M181.66,122.34l-80-80A8,8,0,0,0,88,48V208a8,8,0,0,0,13.66,5.66l80-80A8,8,0,0,0,181.66,122.34ZM104,188.69V67.31L164.69,128Z"></path></svg>`,
  },
  functions: {
    nextPage: () => console.log("adicione uma função para alterar o conteúdo para a próxima página"),
    previousPage: () => console.log("adicione uma função para alterar o conteúdo para a página anterior"),
    updatePage: () => console.log("adicione uma função para alterar para a página clicada")
  }
}
// TODO fazer suas funções para nextPage, previousButton e updatePage neste espaço


export function switchPagesBox({updatePage = null, previousPage = null, nextPage = null, state = localState}) {
  const switchPagesBox = cleanOrCreateBox(localState.selectors.switchPagesBox);

  const prevButton = document.createElement("button");
  prevButton.innerHTML = state.images.caretLeft;
  prevButton.id = localState.selectors.previousButton;
  prevButton.addEventListener("click", async () => {
    state.page.current -= 1;
    setMinMaxShownPages(state)
    updateSwitchPageButton(updatePage, state);
    if (previousPage) {
      previousPage();
    } else {
      localState.functions.previousPage()
    }
  })
  switchPagesBox.appendChild(prevButton);
  
  const switchPagesButtons = document.createElement("div");
  switchPagesButtons.id = localState.selectors.pageNumberButtons;
  switchPagesBox.appendChild(switchPagesButtons);
  
  const nextButton = document.createElement("button");
  nextButton.innerHTML = localState.images.caretRight;
  nextButton.id = localState.selectors.nextButton;
  nextButton.addEventListener("click", async () => {
    state.page.current += 1;
    setMinMaxShownPages(state)
    updateSwitchPageButton(updatePage, state);
    if (nextPage) {
      nextPage();
    } else {
      localState.functions.nextPage()
    }
  })
  switchPagesBox.appendChild(nextButton);
  return switchPagesBox;
}

export function setShownButtonsLimit(objects, totalOfItems = null, maxShownItems = null, state = localState) {
  const page = state.page;
  page.items.maxNumber = (totalOfItems)?totalOfItems:objects.length;
  page.items.maxShown = (maxShownItems)?maxShownItems:page.items.maxShown;
  page.maxNumber = (page.items.maxNumber%page.items.maxShown===0)?page.items.maxNumber/page.items.maxShown:Math.floor(page.items.maxNumber/page.items.maxShown)+1;
  
  setMinMaxShownPages(state);
}

function setMinMaxShownPages(state = localState) {
  const page = state.page;
  if (page.current <= page.maxButtonsShown / 2) {
    page.maxShown = page.maxNumber > page.maxButtonsShown ? page.maxButtonsShown : page.maxNumber;
    page.minShown = 1;
  } else if (page.current >= page.maxNumber - 2) {
    page.maxShown = page.maxNumber;
    page.minShown = page.maxNumber - page.maxButtonsShown + 1;
  } else {
    page.maxShown = page.maxButtonsShown % 2 === 0 ? page.current + page.maxButtonsShown / 2 : page.current + (page.maxButtonsShown - 1) / 2;
    page.minShown = page.maxButtonsShown % 2 === 0 ? page.current - page.maxButtonsShown / 2 + 1 : page.current - (page.maxButtonsShown - 1) / 2;
  }
}

export function createNumberButtons(updatePage, state = localState) {
  const pageButtonsArea = document.querySelector(`#${localState.selectors.pageNumberButtons}`);
  pageButtonsArea.innerHTML = "";
  for (let i = state.page.minShown; i <= state.page.maxShown; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    if (i === state.page.current) {
      button.classList.add("current");
      button.disabled = true;
    }
    button.addEventListener("click", () => {
      state.page.current = i;
      setMinMaxShownPages(state)
      updateSwitchPageButton(updatePage, state);
      if (updatePage) {
        updatePage(state.page.current);
      } else {
        localState.functions.nextPage()
      }
    });
    pageButtonsArea.appendChild(button);
  }
}

export function toggleDisableButton(state = localState) {
  const nextButton = document.querySelector(`#${localState.selectors.nextButton}`);
  nextButton.disabled = (state.page.current === state.page.maxNumber);
  
  const previousButton = document.querySelector(`#${localState.selectors.previousButton}`);
  previousButton.disabled = (state.page.current === 1);
}

export function updateSwitchPageButton(updatePage = null, state = localState) {
  createNumberButtons(updatePage, state);
  toggleDisableButton(state);
}