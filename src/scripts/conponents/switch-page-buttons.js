import { getPokemonFromAPI, state, updateContents } from "../main.js";
import { cleanOrCreateBox } from "./elementTools.js";
import { pokemonList } from "./pokemonList.js";

const localState = {
  page: {
    current: 1,
    maxButtonsShowed: 5,
    maxNumber: 10,
    maxShowed: null,
    minShowed: null,
  },
  images: {
    caretLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M160,48V208L80,128Z" opacity="0.2"></path><path d="M163.06,40.61a8,8,0,0,0-8.72,1.73l-80,80a8,8,0,0,0,0,11.32l80,80A8,8,0,0,0,168,208V48A8,8,0,0,0,163.06,40.61ZM152,188.69,91.31,128,152,67.31Z"></path></svg>`,
    caretRight: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M176,128,96,208V48Z" opacity="0.2"></path><path d="M181.66,122.34l-80-80A8,8,0,0,0,88,48V208a8,8,0,0,0,13.66,5.66l80-80A8,8,0,0,0,181.66,122.34ZM104,188.69V67.31L164.69,128Z"></path></svg>`,
  },
}

export function switchPagesBox(page = localState.page) {
  const switchPagesBox = cleanOrCreateBox("page-switch-buttons-area");

  const prevButton = document.createElement("button");
  prevButton.innerHTML = localState.images.caretLeft;
  prevButton.id = "previous-page-button";
  prevButton.addEventListener("click", async () => {
    page.current -= 1;
    state.api.offset -= state.api.limit;
    await updateContents(page)   
    })
  switchPagesBox.appendChild(prevButton);

  const switchPagesButtons = document.createElement("div");
  switchPagesButtons.id = "page-number-buttons";
  switchPagesBox.appendChild(switchPagesButtons);

  const nextButton = document.createElement("button");
  nextButton.innerHTML = localState.images.caretRight;
  nextButton.id = "next-page-button";
  nextButton.addEventListener("click", async () => {
    page.current += 1;
    state.api.offset += state.api.limit;
    await updateContents(page);
  })
  switchPagesBox.appendChild(nextButton);

  return switchPagesBox;
}

export function updateSwitchPageButtons(page = localState.page) {  
  setShowedButtonsLimit(page);
  toggleDisableButton("#previous-page-button", page.current === 1);
  toggleDisableButton("#next-page-button", page.current === page.maxNumber);  
  createNumberButtons(page);
}

function toggleDisableButton(selector, condiion) {
  const button = document.querySelector(selector);
  button.disabled = (condiion);
}

function setShowedButtonsLimit(page = localState.page) {
  if (page.current <= page.maxButtonsShowed / 2) {
    page.maxShowed = page.maxNumber > page.maxButtonsShowed ? page.maxButtonsShowed : page.maxNumber;
    page.minShowed = 1;
  } else if (page.current >= page.maxNumber - 2) {
    page.maxShowed = page.maxNumber;
    page.minShowed = page.maxNumber - page.maxButtonsShowed + 1;
  } else {
    page.maxShowed = page.maxButtonsShowed % 2 === 0 ? page.current + page.maxButtonsShowed / 2 : page.current + (page.maxButtonsShowed - 1) / 2;
    page.minShowed = page.maxButtonsShowed % 2 === 0 ? page.current - page.maxButtonsShowed / 2 + 1 : page.current - (page.maxButtonsShowed - 1) / 2;
  }
}

function createNumberButtons(page = localState.page) {
  const pageButtonsArea = document.querySelector("#page-number-buttons");
  pageButtonsArea.innerHTML = "";
  for (let i = page.minShowed; i <= page.maxShowed; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    if (i === page.current) {
      button.classList.add("current");
      button.disabled = true;
    }
    button.addEventListener("click", () => {
      page.current = i;
      state.api.offset = state.api.limit * (page.current - 1)
      updateContents(page)
    });
    pageButtonsArea.appendChild(button);
  }
}