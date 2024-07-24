// TMDB api 불러오기
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjM1YTBkNjM5MGUxMWZiMDdkZDMzMjljODQ5MjUwMSIsIm5iZiI6MTcyMTY5Mjk0OS44MDYzOSwic3ViIjoiNjY5ZWYyMjNhYTJkNTY4N2Y3ZGQ4OGRiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.EYJkbX63A4lwzPvknXp_39RdLgKWXZONaCkfvPj7ZZk",
    },
};

// 영화 목록 불러오기
let loadMovie = (v) => {
    document.querySelector('body').style.opacity = "0";
    fetch("https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1", options)
        .then((response) => response.json())
        .then((response) => {
            response.results.map((i) => {
                let ratingStar = Math.round(i.vote_average) >= 9 ? "⭐⭐⭐⭐⭐" : "⭐⭐⭐⭐"; // 별점

                if (typeof v === null || v === undefined || v === "") {
                    document.getElementById("movie-list").insertAdjacentHTML("beforeend",`
                        <li class="card">
                            <div class="poster"><img src="https://image.tmdb.org/t/p/original${i.poster_path}" alt="${i.title}"></div>
                            <div class="info" onclick="alert('영화의 ID는 ${i.id}입니다.')">
                                <div class="title">${i.title}</div>
                                <div class="vote-average">Rating : ${ratingStar} (${i.vote_average})</div>
                                <div class="overview">${i.overview}</div>
                            </div>
                        </li>
                    `
                    );
                } else {
                    let title = i.title.toLowerCase().replace(' ','');
                    
                    if (title.indexOf(v.toLowerCase().replace(' ','')) != -1) {
                        document.getElementById("movie-list").insertAdjacentHTML(
                            "beforeend",
                            `
                            <li class="card">
                                <div class="poster"><img src="https://image.tmdb.org/t/p/original${i.poster_path}" alt="${i.title}"></div>
                                <div class="info" onclick="alert('영화의 ID는 ${i.id}입니다.')">
                                    <div class="title">${i.title}</div>
                                    <div class="vote-average">Rating : ${ratingStar} (${i.vote_average})</div>
                                    <div class="overview">${i.overview}</div>
                                </div>
                            </li>
                        `
                        );
                    }
                }
            });

            makeGrid();

            // 일치하는 검색어가 없을경우, 얼럿 노출 후 검색창과 영화목록 초기화
            if(document.querySelectorAll(".card").length == 0){
                alert('일치하는 영화가 없습니다.');
                document.getElementById("movie-list").classList.remove("search-result");
                document.getElementById("search").value = null;
                loadMovie();
            };
        })
        .catch((err) => console.error(err));
};


// 검색어로 영화찾기
function searchMovie() {
    let keyword = document.getElementById("search").value;
    if (typeof keyword === null || keyword === undefined || keyword === "") { // 검색어가 없을 경우
        alert("영화 제목을 입력하세요.");
    } else {
        document.getElementById("movie-list").classList.add("search-result");
        document.getElementById("movie-list").innerHTML = "";
        loadMovie(keyword);
    }
};

// 그리드 조정
function makeGrid() {
    // 그리드 초기화
    document.querySelectorAll(".card").forEach((e) => {
        e.classList.remove("big-title");
        e.removeAttribute("style");
    });

    // 그리드 설정
    let rowStart = 1;
    let cardCount = document.querySelectorAll(".card").length;

    for (let i = 0; i < cardCount; i++) {
        if (i % 6 === 0 || i % 6 === 5) {
            document.querySelectorAll(".card")[i].classList.add("big-title");
            document.querySelectorAll(".card")[i].style.cssText = "grid-row : " + rowStart + "/" + (rowStart + 2);
            rowStart += 2;
        }
    }

    document.querySelector('body').style.opacity = "1";
};


// 윈도우 로딩 완료되면
window.onload = function () {
    loadMovie(); // 영화 불러오기

    const searchInput = document.getElementById("search");
    searchInput.focus(); // 검색창에 포커스

    searchInput.addEventListener("keyup", function (e) {
        if (e.key === "Enter") {
            // 검색창에서 엔터 눌렀을 때
            searchMovie();
        };

        if (e.key === "Backspace" && searchInput.value === "" && document.getElementById("movie-list").classList.contains("search-result")) {
            // 검색결과가 있는 상태에서 검색창내용 지웠을 때
            document.getElementById("movie-list").classList.remove("search-result");
            document.getElementById("movie-list").innerHTML = "";
            loadMovie();
        };
    });


    // 로고, 탑버튼 클릭시 상단으로 부드럽게 스크롤
    const logo = document.querySelector('.logo');
    const topBtn = document.querySelector('#top-btn');
    logo.addEventListener("click",()=>{
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });
    topBtn.addEventListener("click",()=>{
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });


    /* 반응형 1rem 지정 */ 
    let docWidth = window.innerWidth;
    if ( docWidth >= 750) {
        document.querySelector('html').style.fontSize = "62.5%";
    } else if (docWidth >= 480) {
        document.querySelector('html').style.fontSize = (62.5 * ( docWidth / 750 )) + "%";
    } else {
        document.querySelector('html').style.fontSize = (62.5 * ( 480 / 750 )) + "%";
    }

    window.addEventListener('resize', () => {
        docWidth = window.innerWidth;
        if ( docWidth >= 750) {
            document.querySelector('html').style.fontSize = "62.5%";
        } else if (docWidth >= 480) {
            document.querySelector('html').style.fontSize = (62.5 * ( docWidth / 750 )) + "%";
        } else {
            document.querySelector('html').style.fontSize = (62.5 * ( 480 / 750 )) + "%";
        }
    })
};
