async function getPokemonData(pokemonId) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
  const data = await response.json();
  return data;
}
async function createPokemonList(initial, final) {
  const start = initial || 1;
  const numberOfPokemon = final || 151;
  const pokemonList = [];

  for (let i = 1; i <= numberOfPokemon; i++) {
      const pokemonData = await getPokemonData(i);
      const pokemon = {
          id: pokemonData.id,
          name: pokemonData.name,
          types: pokemonData.types.map(type => type.type.name),
          image: pokemonData.sprites.other.dream_world.front_default
      };

      pokemonList.push(pokemon);
  }
  return pokemonList;
}

async function createPokemonElements() {
  const pokemonList = await createPokemonList();
  const pokemonContainer = document.querySelector(".pokemons");
  
  pokemonList.forEach(pokemon => {
    const pokemonElement = document.createElement('li')
    pokemonElement.classList.add('pokemon');

    const registerDiv = document.createElement('div');
    registerDiv.classList.add('register');

    const nameSpan = document.createElement('span');
    nameSpan.classList.add('name');
    nameSpan.textContent = pokemon.name;

    const numberSpan = document.createElement('span');
    numberSpan.classList.add('number');
    numberSpan.textContent = `#${pokemon.id.toString().padStart(3, '0')}`;

    registerDiv.appendChild(nameSpan);
    registerDiv.appendChild(numberSpan);

    const detailDiv = document.createElement('div');
    detailDiv.classList.add('detail');

    const typesOl = document.createElement('ol');
    typesOl.classList.add('types');

    pokemon.types.forEach(type => {
      const typeLi = document.createElement('li');
      typeLi.classList.add('type');
      typeLi.textContent = type;
      typesOl.appendChild(typeLi);
    });
    const image = document.createElement('img');
    image.src = pokemon.image;
    image.alt = pokemon.name;

    detailDiv.appendChild(typesOl);
    detailDiv.appendChild(image);

    pokemonElement.appendChild(registerDiv);
    pokemonElement.appendChild(detailDiv);
    pokemonContainer.appendChild(pokemonElement);
  })
}
createPokemonElements();