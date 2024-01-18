export const pokeApi = {};

pokeApi.getPokemons = async (offset = 0, limit = 10) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao obter dados. Código de status: ${response.status}`)
    }
    const data = await response.json();
    return data
  } catch (error) {
    return error.message
  }
}

pokeApi.getPokeDetail = async (pokemonReference) => {
  const response = await fetch(pokemonReference.url);
  const pokemon = await response.json();
  return pokemon
}