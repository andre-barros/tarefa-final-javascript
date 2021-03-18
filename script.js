var isLoading = false;
var people = [];
var person = {};
var page = 1;

var lista = document.querySelector("#lista");
var pagination = document.querySelector("#pagination");
var loading = document.querySelector("#loading");
var form = document.querySelector("#form");

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





const generateForm = (person) => {

  return `
    <div class="modal" id="modal">
    <div class="modal-container">
        <div class="modal-header">
            <p class="modal-title">Change People</p>
            <a class="close-button" href="#">&times;</a>
        </div>
    
        <form id="form-person">
            <input type="text" name="name" placeholder="Name" value="${person.name}"></input>
            <input type="text" name="height" placeholder="Height" value="${person.height}"></input>
            <input type="text" name="gender" placeholder="Gender" value="${person.gender}"></input>
            <input type="text" name="mass" placeholder="Mass" value="${person.mass}"></input>
        </form>
      
        <div class="buttons"><a href="#" onclick="handleSavePerson(${person.index})" class="button">SAVE</a></div>
    </div>      
  </div>  
  `
}

const handleSavePerson = (index) => {
  const person = {}
  var form = document.querySelector('#form-person');

  for ({ name, value } of form) {
    person[name] = value;
  }
  people.splice(index, 1, person);
  renderPeople(people); 
}



const renderModalEditPerson = render(form, generateForm);

const handleEditPerson = (index) => {
  person = { index, ...people[index]};
  renderModalEditPerson(person);
}

const generatePeople = (param) => {
  // 
  people = param;
  return people.map(({ name, height, gender, mass }, index) => {
    return `
    <tr>
      <td data-th="Name">${name}</td>
      <td data-th="Height">${height / 100}</td>
      <td data-th="Gender">${gender}</td>
      <td data-th="Mass">${mass}</td>
      <td>
        <a href="#modal">
          <button onclick="handleEditPerson(${index})">
          Edit
          </button>
        </a>
      </td>
      <td>
        <button onclick="handleRemovePeople(${index})">
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
  }).catch(() => {
    alert("Houve um erro ao carregar os dados!")
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

