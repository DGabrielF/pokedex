import { pokeApi } from "../api.js";
import { state } from "../main.js";
import { cleanOrCreateBox } from "./elementTools.js";

export function pokemonList(pokemons, localMemory) {
  const cardArea = cleanOrCreateBox("card-area");
  const pokeList = cleanOrCreateBox("pokemon-list");
  pokemons.forEach(async pokemon => pokeList.appendChild(await pokeCard(pokemon, localMemory)));
  cardArea.appendChild(pokeList)
  return cardArea;
}

async function pokeCard(pokemonReference, localMemory) {
  let pokemon;
  const pokemonFound = state.localMemory.some((pokemonSaved) => {
    return pokemonSaved.name === pokemonReference.name;
  })
  if (pokemonFound) {
    pokemon = localMemory.find((pokemonSaved)=> {
      return pokemonSaved.name === pokemonReference.name;
    })
  } else {
    pokemon = await pokeApi.getPokeDetail(pokemonReference);
    localMemory.push(pokemon);
  }

  const card = document.createElement("div");
  card.classList.add("pokemon");
  card.id = pokemon.id;

  const nameSpan = document.createElement("span");
  nameSpan.classList.add("name");
  nameSpan.textContent = pokemon.name;
  card.appendChild(nameSpan);

  const detailBox = document.createElement("div");
  detailBox.classList.add("details");

  const typesList = document.createElement("ol");
  typesList.classList.add("types")
  pokemon.types.forEach(type => {
    const li = document.createElement("li");
    li.innerHTML = state.images.types[type.type.name];
    typesList.appendChild(li);
  })
  detailBox.appendChild(typesList);

  const numberSpan = document.createElement("span");
  numberSpan.textContent = `#${pokemon.id + 1}`;
  detailBox.appendChild(numberSpan);
  card.appendChild(detailBox)

  const imageBox = document.createElement("div");
  imageBox.classList.add("image");

  const image = document.createElement("img");
  image.src = (pokemon.sprites.other.dream_world.front_default) ? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_default;
  image.alt = pokemon.name;
  imageBox.appendChild(image)

  card.appendChild(imageBox)

  return card;
}