import { pokeApi } from "../api.js";
// import { getPokemonFromAPI, state, updateContents } from "../main.js";
import { mainButtonsSystem, state, updatePokemonCards } from "../main.js";
import { cleanOrCreateBox } from "./elementTools.js";
import { pokemonList } from "./pokemonList.js";
import { createNumberButtons, setShownButtonsLimit, switchPagesBox, updateSwitchPageButton } from "./switch-page-buttons.js";

const localState = {
  values: {
    toFind: null,
    foundItems: null,
  },
  page: {
    current: 1,
    next: null,
    previous: null,
    maxButtonsShowed: 5,
    maxNumber: null,
    maxShowed: null,
    minShowed: null, 
  },
  images: {
    magnifyingGlass: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M192,112a80,80,0,1,1-80-80A80,80,0,0,1,192,112Z" opacity="0.2"></path><path d="M229.66,218.34,179.6,168.28a88.21,88.21,0,1,0-11.32,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>`,
  },
}

export function searchMenu(value = localState.values.toFind) {
  const searchMenuBox = cleanOrCreateBox("search-menu-box");

  const span = document.createElement("span");
  span.id = "search-menu-span";
  span.textContent = "MENU";
  searchMenuBox.appendChild(span);
  
  const icon = document.createElement("div");
  icon.id = "search-menu-icon";
  icon.innerHTML = localState.images.magnifyingGlass;
  searchMenuBox.appendChild(icon);
  
  const input = document.createElement("input");
  input.id = "search-menu-input";
  input.addEventListener("input", e => onChangeAttributes(e, value))
  searchMenuBox.appendChild(input);

  return searchMenuBox;
}

async function onChangeAttributes(e, value = localState.values.toFind) {
  const container = document.querySelector(".container");
  value = e.target.value;
  if (value) {
    localState.values.foundItems = state.localMemory.filter((pokemon) => {
      return pokemon.name.toLowerCase().includes(value.toLowerCase());
    });
    let i = 0;
    while (localState.values.foundItems.length === 0) {
      i++
      const response = await pokeApi.getPokemons(state.api.offset + (state.api.limit * i), state.api.limit * i);
      localState.values.foundItems = response.results.filter((pokemon) => {
        return pokemon.name.toLowerCase().includes(value.toLowerCase());
      });    
    }
    localState.page.maxNumber = (localState.values.foundItems.length) % state.api.limit === 0 ? (localState.values.foundItems.length) / state.api.limit : Math.floor((localState.values.foundItems.length) / state.api.limit + 1);
    const bounds = setBoundsItems()
    setShownButtonsLimit(localState.values.foundItems)
    updateSwitchPageButton(localState.page);
    searchButtonSystem(container);

    const pokemonToShow = localState.values.foundItems.slice(bounds.min, bounds.max);
    updatePokemonCards(pokemonToShow);
  } else {
    const container = document.querySelector(".container");
    const response = await pokeApi.getPokemons(state.api.offset, state.api.limit);
    setShownButtonsLimit(response.results, response.count, state.api.limit);
    updatePokemonCards(response.results);
    mainButtonsSystem(container)
  }
}

function setBoundsItems() {
  const min = (localState.page.current - 1) * state.api.limit;
  const max = (localState.page.current) * state.api.limit;
  return {min, max};
}

function searchButtonSystem(container) {
  container.appendChild(
    switchPagesBox({
      nextPage: handleSearchNextPage,
      previousPage: handleSearchPreviousPage,
      updatePage: handleSearchPage,
    }));
  createNumberButtons(handleSearchPage);
}

function handleSearchNextPage() {
  localState.page.current += 1;
  const bounds = setBoundsItems()
  const pokemonToShow = localState.values.foundItems.slice(bounds.min, bounds.max);
  updatePokemonCards(pokemonToShow);
}

function handleSearchPreviousPage() {
  localState.page.current -= 1;
  const bounds = setBoundsItems()
  const pokemonToShow = localState.values.foundItems.slice(bounds.min, bounds.max);
  updatePokemonCards(pokemonToShow);  
}

function handleSearchPage(pageNumber) {
  localState.page.current = pageNumber;
  const bounds = setBoundsItems()
  const pokemonToShow = localState.values.foundItems.slice(bounds.min, bounds.max);
  updatePokemonCards(pokemonToShow);  
}