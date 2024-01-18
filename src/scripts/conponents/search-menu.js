import { cleanOrCreateBox } from "./elementTools.js";

const localState = {
  values: {
    toFind: null,
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

function onChangeAttributes(e, value = localState.values.toFind) {
  value = e.target.value;
}