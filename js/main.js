// TMDB api 불러오기
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjM1YTBkNjM5MGUxMWZiMDdkZDMzMjljODQ5MjUwMSIsIm5iZiI6MTcyMTY5Mjk0OS44MDYzOSwic3ViIjoiNjY5ZWYyMjNhYTJkNTY4N2Y3ZGQ4OGRiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.EYJkbX63A4lwzPvknXp_39RdLgKWXZONaCkfvPj7ZZk",
    },
};

let type = navigator.appName;
let region = type == "Netscape" ? navigator.language : navigator.userLanguage.substr(0, 2);
region !== "ko" && region !== "en" && region !== "jp" && (region = "en"); // default 언어 = en
let lang = "en-US"; // default 지역 = US

// 한국 or 일본만 예외처리
if (region === "ko") {
    lang = "ko-KR";
} else if (region === "jp") {
    lang = "ja-JP";
}
region = lang.substr(3, 5);

// 영화 목록 불러오기
let loadMovie = (v, currLang, currRegion, currCate) => {
    document.querySelector("body").style.opacity = "0";

    // 지역, 언어, 카테고리 기본값 세팅 => 현재 지역, 언어, top_rated
    (currLang === null || currLang === undefined || currLang === "") && (currLang = lang);
    (currRegion === null || currRegion === undefined || currRegion === "") && (currRegion = region);
    (currCate === null || currCate === undefined || currCate === "") && (currCate = "top_rated");

    fetch(`https://api.themoviedb.org/3/movie/${currCate}?language=${currLang}&page=1&region=${currRegion}`, options)
        .then((response) => response.json())
        .then((response) => {
            response.results.map((i) => {
                let ratingStar = Math.round(i.vote_average) >= 9 ? "⭐⭐⭐⭐⭐" : "⭐⭐⭐⭐"; // 별점

                if (v === null || v === undefined || v === "") {
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
                } else {
                    let title = i.title.toLowerCase().replace(" ", "");

                    if (title.indexOf(v.toLowerCase().replace(" ", "")) !== -1) {
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

            // 검색된 영화 갯수 제거
            let resultDiv = document.querySelector(".result-count");
            if (resultDiv === null || resultDiv === undefined || resultDiv === "") {
            } else document.querySelector(".result-count").remove();

            // 검색어가 있을 때
            if (v === null || v === undefined || v === "") {
            } else {
                // 일치하는 검색어가 없을경우, 얼럿 노출 후 검색창과 영화목록 초기화
                if (document.querySelectorAll(".card").length == 0) {
                    alert("일치하는 영화가 없습니다.");
                    document.getElementById("movie-list").classList.remove("search-result");
                    document.getElementById("search").value = null;
                    loadMovie();
                } else {
                    // 검색된 영화 갯수 출력
                    document.getElementById("movie-list").before(resultCount(document.getElementById("movie-list").childElementCount));
                }
            }
        })
        .catch((err) => console.error(err));
};

// 검색된 영화 갯수 div생성 (createElement 써보기)
function resultCount(count) {
    let result = document.createElement("div");
    result.className = "result-count";
    result.innerHTML = `검색된 영화는 총 <span>${count}</span>개 입니다.`;

    return result;
}

// 검색어로 영화찾기
function searchMovie() {
    let keyword = document.getElementById("search").value;
    if (typeof keyword === null || keyword === undefined || keyword === "") {
        // 검색어가 없을 경우
        alert("영화 제목을 입력하세요.");
    } else {
        document.getElementById("movie-list").classList.add("search-result");
        document.getElementById("movie-list").innerHTML = "";
        loadMovie(keyword);
    }
}

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

    document.querySelector("body").style.opacity = "1";
}

// 윈도우 로딩 완료되면
window.onload = function () {
    loadMovie(); // 영화 불러오기

    // 카테고리 클릭시
    let cate = document.querySelectorAll(".cate > a");

    cate.forEach((item) => {
        item.addEventListener("click", () => {
            if (!item.classList.contains("now")) {
                document.querySelector(".cate a.now").classList.remove("now");
                item.classList.add("now");
                let nowCate = item.getAttribute("href").replace("#", "");
                document.getElementById("movie-list").innerHTML = "";
                loadMovie(null, null, null, nowCate);
            }
        });
    });

    const searchInput = document.getElementById("search");
    searchInput.focus(); // 검색창에 포커스

    searchInput.addEventListener("keyup", function (e) {
        if (e.key === "Enter") {
            // 검색창에서 엔터 눌렀을 때
            searchMovie();
        }

        if (e.key === "Backspace" && searchInput.value === "" && document.getElementById("movie-list").classList.contains("search-result")) {
            // 검색결과가 있는 상태에서 검색창내용 지웠을 때
            document.getElementById("movie-list").classList.remove("search-result");
            document.getElementById("movie-list").innerHTML = "";
            loadMovie();
        }
    });

    // 탑버튼 클릭시 상단으로 부드럽게 스크롤
    const topBtn = document.querySelector("#top-btn");

    topBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });

    /* 반응형 1rem 지정 */
    let docWidth = window.innerWidth;
    if (docWidth >= 750) {
        document.querySelector("html").style.fontSize = "62.5%";
    } else if (docWidth >= 480) {
        document.querySelector("html").style.fontSize = 62.5 * (docWidth / 750) + "%";
    } else {
        document.querySelector("html").style.fontSize = 62.5 * (480 / 750) + "%";
    }

    window.addEventListener("resize", () => {
        docWidth = window.innerWidth;
        if (docWidth >= 750) {
            document.querySelector("html").style.fontSize = "62.5%";
        } else if (docWidth >= 480) {
            document.querySelector("html").style.fontSize = 62.5 * (docWidth / 750) + "%";
        } else {
            document.querySelector("html").style.fontSize = 62.5 * (480 / 750) + "%";
        }
    });
};
