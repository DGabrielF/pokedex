export function cleanOrCreateBox(className) {
  let box = document.querySelector(`.${className}`);
  if (box) {
    box.innerHTML = "";
  } else {
    box = document.createElement("div");
    box.classList.add(className);
  }
  return box;
}

export function createBox(className = "separator") {
  const div = document.createElement("div");
  div.classList.add(className);
  return div
}