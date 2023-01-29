const modalWindow = document.querySelector('#detailsModal');
const pagination = document.querySelector('.pagination');
const moviesTable = document.querySelector('#moviesTable tbody');
const currentPage = document.querySelector('#current-page');
const previousPage = document.querySelector('#previous-page');
const nextPage = document.querySelector('#next-page');
const modalTitle = document.querySelector('#modal-title');
const modalBody = document.querySelector('#modal-body');
const searchForm = document.querySelector('#searchForm');
const title = document.querySelector('#title');
const clearForm = document.querySelector('#clearForm');
let page = 1;
const perPage = 10;

async function loadMovieData(title = null) {
   const data = await getData(title);
   paginationAfterRequest(title);
   fillTableFromData(data);
   makeTableDynamic();
}

async function getData(title) {
   const url = title != null ? `/api/movies?page=${page}&perPage=${perPage}&title=${title}` : `/api/movies?page=${page}&perPage=${perPage}`;
   const res = await fetch(url);
   const json = await res.json();

   return json;
}

function paginationAfterRequest(title) {
    if(title != null) {
        page = 1;
        pagination.classList.add('d-none');
    }
       else {
        pagination.classList.remove('d-none');
    }
    currentPage.innerHTML = page;
}

function fillTableFromData(data) {
    if(Array.isArray(data)) {
        moviesTable.innerHTML = `${data.map(getMovieRow).join('')}`;
    }
    else {
        moviesTable.innerHTML = getMovieRow(data);
    }
}

function getMovieRow(element) {
    return `<tr data-id="${element._id}"><td>${element.year}</td><td>${element.title}</td><td>${element.plot ? element.plot : 'N/A'}</td><td>${element.rated ? element.rated : 'N/A'}</td><td>${Math.floor(element.runtime / 60)}:${(element.runtime % 60).toString().padStart(2, '0')}</td></tr>`;
}

function makeTableDynamic() {
    document.querySelectorAll('#moviesTable tbody tr').forEach(tr => {
        tr.addEventListener('click', async (e) => {
            const movie = await getMovieByID(tr.dataset.id);
            fillModalWindow(movie);
            showModalWindow();
        });
    });
}

async function getMovieByID(id) {
    const res = await fetch(`api/movies/${id}`);
    return await res.json();
}

function fillModalWindow(movie) {
    modalTitle.innerHTML = movie.title;
    modalBody.innerHTML = `<img alt="poster not found" class="img-fluid w-100" src="${movie.poster}"><br><br>
    <strong>Directed By:</strong> ${movie.directors.join(', ')}<br><br>
    <p>${movie.fullplot}</p>
    <strong>Cast:</strong> ${movie.cast ? movie.cast.join(', ') : 'N/A'}<br><br>
    <strong>Awards:</strong> ${movie.awards.text}<br>
    <strong>IMDB Rating:</strong> ${movie.imdb.rating} (${movie.imdb.votes} votes)`;
}

function showModalWindow() {
    const modal = new bootstrap.Modal(modalWindow, {
        backdrop: 'static', // default true - "static" indicates that clicking on the backdrop will not close the modal window
        keyboard: false, // default true - false indicates that pressing on the "esc" key will not close the modal window
        focus: true, // default true - this instructs the browser to place the modal window in focus when initialized
    });
    modal.show();
}

document.addEventListener('DOMContentLoaded', () => {
    previousPage.addEventListener('click', async () => {
        if(page > 1) {
            --page;
            await loadMovieData();
        }
    });
    nextPage.addEventListener('click', async () => {
        ++page;
        await loadMovieData();
    });

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await loadMovieData(title.value);
    });
    clearForm.addEventListener('click', async (e) => {
        e.preventDefault();
        title.value = '';
        await loadMovieData();
    });
});

(async () => {
    await loadMovieData();
})();