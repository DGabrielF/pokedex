export function searchMenu() {
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