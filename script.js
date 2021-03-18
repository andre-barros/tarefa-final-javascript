var isLoading = false;
var people = [];
var page = 1;

var lista = document.querySelector("#lista");
var pagination = document.querySelector("#pagination");
var loading = document.querySelector("#loading");

const render = (el, f) => { 
  return (p) => el.innerHTML = f(p);
};

const generateLoading = (isLoading) => {

  if (isLoading) {
    render(lista, () => { return `` })();
    return `
    <img class="loading" src="images/loading.gif"></img>
    `;
  } else {
    return ``;
  }
}

const renderLoading = render(loading, generateLoading);

setLoading = (value) => {
  renderLoading(value);
}

async function fetchPeopleJSON(page = 1) {
  setLoading(true);
  const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
  const { results: people } = await response.json();
  setLoading(false);
  return people;
}

const handleRemovePeople = (index) => {
  people.splice(index, 1)
  renderPeople(people);
}

const generatePeople = (param) => {
  // .filter(filterContatos)
  people = param;
  return people.map(({ name, height, gender, mass }, index) => {
    return `
    <tr>
      <td data-th="Name">${name}</td>
      <td data-th="Height">${height / 100}</td>
      <td data-th="Gender">${gender}</td>
      <td data-th="Mass">${mass}</td>
      <td>
        <button>
          Edit
        </button>
      </td>
      <td>
        <button class="contato-remover js-contato-remover" onclick="handleRemovePeople(${index})">
            Remove
        </button>
      </td>   
    </tr>
    `
  }).join('');
}


var renderPeople = render(lista, generatePeople);

fetchPeopleJSON(page).then(people => {
  renderPeople(people);
})


const handlePage = (page) => {
  fetchPeopleJSON(page).then(people => {
    renderPagination(page);
    renderPeople(people);
  })
}

const generatePagination = (param) => {
  page = param; 
  return `
    <ul class="pagination">
      <li style="visibility: ${page === 1 ? "hidden" : "visible"}" onclick="handlePage(${param - 1})"><a href="#" class="prev" ><< Anterior</a></li>
      <li class="pageNumber active"><a href="#">${page}</a></li>
      <li onclick="handlePage(${param + 1})"><a href="#" class="next" >Próximo >></a></li>
    </ul>
  `
}

var renderPagination = render(pagination, generatePagination);
renderPagination(page);

