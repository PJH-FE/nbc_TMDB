// TMDB api 불러오기
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjM1YTBkNjM5MGUxMWZiMDdkZDMzMjljODQ5MjUwMSIsIm5iZiI6MTcyMTY5Mjk0OS44MDYzOSwic3ViIjoiNjY5ZWYyMjNhYTJkNTY4N2Y3ZGQ4OGRiIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.EYJkbX63A4lwzPvknXp_39RdLgKWXZONaCkfvPj7ZZk",
    },
};

let region = navigator.language;
region !== "ko" && region !== "en" && region !== "ja" && (region = "en"); // default 언어 = en
let lang = "en-US"; // default 지역 = US

// 한국 or 일본만 예외처리
if (region === "ko") {
    lang = "ko-KR";
} else if (region === "ja") {
    lang = "ja-JP";
}
region = lang.substring(3);

// 영화 목록 불러오기
let loadMovie = (v, currLang, currRegion, currCate, currPage) => {
    document.querySelector("body").style.opacity = "0";

    // 지역, 언어, 카테고리 기본값 세팅 => 현재 지역, 언어, top_rated
    if (currCate === null || currCate === undefined || currCate === "") {
        currCate = !!location.href.split("#")[1] ? location.href.split("#")[1] : "top_rated";
    }
    (currLang === null || currLang === undefined || currLang === "") && (currLang = lang);
    (currRegion === null || currRegion === undefined || currRegion === "") && (currRegion = region);
    (currPage === null || currPage === undefined || currPage === "") && (currPage = 1);

    document.querySelectorAll("#header .cate a").forEach((a) => {
        a.getAttribute("href").replace("#", "") === currCate && a.classList.add("now");
    });

    if (v === null || v === undefined || v === "") {
        fetch(`https://api.themoviedb.org/3/movie/${currCate}?language=${currLang}&page=${currPage}&region=${currRegion}`, options)
            .then((response) => response.json())
            .then((response) => {
                document.querySelectorAll("#paging ol li").forEach((i) => {
                    parseInt(i.innerText) > response.total_pages ? (i.style.display = "none") : (i.style.display = "block");
                });

                response.results.map((i) => {
                    let ratingStar = Math.round(i.vote_average); // 별점
                    if (ratingStar >= 9) {
                        ratingStar = "⭐⭐⭐⭐⭐";
                    } else if (ratingStar >= 7) {
                        ratingStar = "⭐⭐⭐⭐";
                    } else if (ratingStar >= 5) {
                        ratingStar = "⭐⭐⭐";
                    } else if (ratingStar >= 3) {
                        ratingStar = "⭐⭐";
                    } else {
                        ratingStar = "⭐";
                    }

                    let alertMsg;
                    if (currRegion === "KR") {
                        alertMsg = `영화의 ID는 ${i.id}입니다.`;
                    } else if (currRegion === "JP") {
                        alertMsg = `映画のIDは${i.id}です。`;
                    } else {
                        alertMsg = `The ID of the movie is ${i.id}`;
                    }

                    document.getElementById("movie-list").insertAdjacentHTML(
                        "beforeend",
                        `
                        <li class="card">
                            <div class="poster"><img src="https://image.tmdb.org/t/p/w500${i.poster_path}" onerror="this.src='./img/no-img.png'" alt="${i.title}"></div>
                            <div class="info" onclick="alert('${alertMsg}')">
                                <div class="date">${i.release_date}</div>
                                <div class="title">${i.title}</div>
                                <div class="vote-average">Rating : ${ratingStar} (${i.vote_average})</div>
                                <div class="overview">${i.overview}</div>
                            </div>
                        </li>
                    `
                    );
                });

                makeGrid();

                // 검색된 영화 갯수 제거
                let resultDiv = document.querySelector(".result-count");
                !!resultDiv && document.querySelector(".result-count").remove();
            })
            .catch((err) => console.error(err));
    } else {
        fetch(`https://api.themoviedb.org/3/search/movie?query=${v}&include_adult=false&language=${currLang}&region=${currRegion}&page=${currPage}`, options)
            .then((response) => response.json())
            .then((response) => {
                document.querySelector("#header .cate a.now") && document.querySelector("#header .cate a.now").classList.remove("now");
                document.querySelectorAll("#paging ol li").forEach((i) => {
                    parseInt(i.innerText) > response.total_pages ? (i.style.display = "none") : (i.style.display = "block");
                });

                response.results.map((i) => {
                    let ratingStar = Math.round(i.vote_average); // 별점
                    if (ratingStar >= 9) {
                        ratingStar = "⭐⭐⭐⭐⭐";
                    } else if (ratingStar >= 7) {
                        ratingStar = "⭐⭐⭐⭐";
                    } else if (ratingStar >= 5) {
                        ratingStar = "⭐⭐⭐";
                    } else if (ratingStar >= 3) {
                        ratingStar = "⭐⭐";
                    } else {
                        ratingStar = "⭐";
                    }

                    let alertMsg;
                    if (currRegion === "KR") {
                        alertMsg = `영화의 ID는 ${i.id}입니다.`;
                    } else if (currRegion === "JP") {
                        alertMsg = `映画のIDは${i.id}です。`;
                    } else {
                        alertMsg = `The ID of the movie is ${i.id}`;
                    }

                    document.getElementById("movie-list").insertAdjacentHTML(
                        "beforeend",
                        `
                <li class="card">
                    <div class="poster"><img src="https://image.tmdb.org/t/p/w500${i.poster_path}" onerror="this.src='./img/no-img.png'" alt="${i.title}"></div>
                    <div class="info" onclick="alert('${alertMsg}')">
                        <div class="date">${i.release_date}</div>
                        <div class="title">${i.title}</div>
                        <div class="vote-average">Rating : ${ratingStar} (${i.vote_average})</div>
                        <div class="overview">${i.overview}</div>
                    </div>
                </li>
            `
                    );
                });

                makeGrid();

                // 검색된 영화 갯수 제거
                let resultDiv = document.querySelector(".result-count");
                !!resultDiv && document.querySelector(".result-count").remove();

                // 일치하는 검색어가 없을경우, 얼럿 노출 후 검색창과 영화목록 초기화
                if (document.querySelectorAll(".card").length == 0) {
                    isLang = document.querySelector("#global a.now").getAttribute("id");
                    isRegion = isLang.substring(3);

                    let noResult;
                    if (isRegion === "KR") {
                        noResult = "일치하는 영화가 없습니다.";
                    } else if (isRegion === "JP") {
                        noResult = "「一致する映画はありません。」";
                    } else {
                        noResult = "There are no matching movies.";
                    }

                    alert(noResult);
                    document.getElementById("movie-list").classList.remove("search-result");
                    document.getElementById("search").value = null;

                    
                    currCate = !!location.href.split("#")[1] ? location.href.split("#")[1] : null;
                    currPage = document.querySelector('#paging a.now').innerText;

                    loadMovie(null, currLang, currRegion, currCate, currPage);
                } else {
                    // 검색된 영화 갯수 출력
                    let totalCount = response.total_results >= 100 ? 100 : response.total_results;

                    document.querySelectorAll("#paging li");
                    document.getElementById("movie-list").before(resultCount(totalCount));
                }
            })
            .catch((err) => console.error(err));
    }
};

// 변수명 생성
let isCate;
let isLang;
let isRegion;
let isPage;

// 검색된 영화 갯수 div생성 (createElement 써보기)
function resultCount(count) {
    isLang = document.querySelector("#global a.now").getAttribute("id");
    isRegion = isLang.substring(3);

    let totalMsg;
    if (isRegion === "KR") {
        totalMsg = `검색된 영화는 총 <span>${count}</span>개입니다.`;
    } else if (isRegion === "JP") {
        totalMsg = `検索された映画は合計 <span>${count}</span>です`;
    } else {
        totalMsg = `A total of <span>${count}</span> movies were searched.`;
    }

    let result = document.createElement("div");
    result.className = "result-count";
    result.innerHTML = totalMsg;

    return result;
}

// 검색어로 영화찾기
function searchMovie() {
    let keyword = document.getElementById("search").value;
    if (typeof keyword === null || keyword === undefined || keyword === "") {
        // 검색어가 없을 경우
        isLang = document.querySelector("#global a.now").getAttribute("id");
        isRegion = isLang.substring(3);

        let errMsg;
        if (isRegion === "KR") {
            errMsg = "영화 제목을 입력하세요.";
        } else if (isRegion === "JP") {
            errMsg = "映画のタイトルを入力してください。";
        } else {
            errMsg = "Please enter the movie title.";
        }

        alert(errMsg);
    } else {
        document.getElementById("movie-list").classList.add("search-result");
        document.getElementById("movie-list").innerHTML = "";

        isCate = !document.querySelector(".cate a.now") ? "top_rated" : document.querySelector(".cate a.now").getAttribute("href").replace("#", "");
        isLang = document.querySelector("#global a.now").getAttribute("id");
        isRegion = isLang.substring(3);
        document.querySelector("#paging li a.now").classList.remove('now')
        document.querySelector("#paging li:first-child a").classList.add('now')


        loadMovie(keyword, isLang, isRegion, isCate, 1);
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
    getCookie("language") != undefined ? (isLang = getCookie("language")) : (isLang = lang);
    getCookie("region") != undefined && (isRegion = getCookie("region"));
    getCookie("page") != undefined && (isPage = getCookie("page"));

    isCate = location.href.split("#")[1];
    document.querySelector("#global a.now").classList.remove("now");
    document.querySelector("#global #" + isLang).classList.add("now");

    loadMovie(null, isLang, isRegion, isCate, isPage); // 영화 불러오기

    // 로고 클릭시 기본화면으로const topBtn = document.querySelector("#top-btn");
    let logo = document.querySelector("a.logo");
    logo.setAttribute("href", location.pathname);
    logo.addEventListener("click", (e) => {
        delCookie("language");
        delCookie("region");
        delCookie("page");
    });

    // 카테고리 클릭시
    let cate = document.querySelectorAll(".cate > a");

    cate.forEach((item) => {
        if (item.getAttribute("href") === "#" + isCate) {
            document.querySelector("#header .cate a.now") && document.querySelector("#header .cate a.now").classList.remove("now");
            item.classList.add("now");
        }

        item.addEventListener("click", () => {
            if (!item.classList.contains("now")) {
                // 페이징 초기화
                delCookie("page");
                document.querySelector("#paging a.now").classList.remove("now");
                document.querySelector("#paging ol").firstElementChild.firstElementChild.classList.add("now");

                document.getElementById("movie-list").innerHTML = ""; // 영화목록 초기화

                // 현재 카테고리 강조
                document.querySelector("#header .cate a.now") && document.querySelector("#header .cate a.now").classList.remove("now");
                item.classList.add("now");

                // 현재 카테고리의 영화 불러오기
                let nowCate = item.getAttribute("href").replace("#", "");
                isLang = document.querySelector("#global a.now").getAttribute("id");
                isRegion = isLang.substring(3);
                loadMovie(null, isLang, isRegion, nowCate, 1);
            }
        });
    });

    const searchInput = document.getElementById("search");
    searchInput.focus(); // 검색창에 포커스

    searchInput.addEventListener("keyup", function (e) {
        isCate = !document.querySelector(".cate a.now") ? "top_rated" : document.querySelector(".cate a.now").getAttribute("href").replace("#", "");
        isLang = document.querySelector("#global a.now").getAttribute("id");
        isRegion = isLang.substring(3);
        isPage = document.querySelector("#paging li a.now").getAttribute("href");

        if (e.key === "Enter") {
            // 검색창에서 엔터 눌렀을 때
            searchMovie();
        }

        if (e.key === "Backspace" && searchInput.value === "" && document.getElementById("movie-list").classList.contains("search-result")) {
            // 검색결과가 있는 상태에서 검색창내용 지웠을 때
            document.getElementById("movie-list").classList.remove("search-result");
            document.getElementById("movie-list").innerHTML = "";
            loadMovie(null, isLang, isRegion, isCate, 1);
        }
    });

    // 언어 선택시
    let global = document.querySelectorAll("#global ul li a");

    global.forEach((flag) => {
        flag.addEventListener("click", () => {
            if (!flag.classList.contains("now")) {
                document.getElementById("search").value = ""; // 검색창 초기화
                // 페이징 초기화
                delCookie("page");
                document.querySelector("#paging a.now").classList.remove("now");
                document.querySelector("#paging ol").firstElementChild.firstElementChild.classList.add("now");

                let nowLang = flag.getAttribute("id");
                let nowRegion = nowLang.substring(3);

                setCookie("language", nowLang, 1);
                setCookie("region", nowRegion, 1);

                document.querySelector("#global a.now").classList.remove("now");
                flag.classList.add("now");
                document.getElementById("movie-list").innerHTML = "";

                isCate = location.href.split("#")[1];
                !!isCate ? loadMovie(null, nowLang, nowRegion, isCate, 1) : loadMovie(null, nowLang, nowRegion, null, 1);
            }
        });
    });

    // 페이징
    let paging = document.querySelectorAll("#paging li a");

    paging.forEach((page) => {
        getCookie("page") != undefined && (isPage = getCookie("page"));

        if (isPage === page.innerText) {
            document.querySelector("#paging a.now").classList.remove("now");
            page.classList.add("now");
        }
        page.addEventListener("click", (e) => {
            e.preventDefault();

            if (!page.classList.contains("now")) {
                window.scrollTo(0, 0);
                isLang = document.querySelector("#global a.now").getAttribute("id");
                isRegion = isLang.substring(3);
                isPage = page.getAttribute("href");

                setCookie("page", isPage, 1);

                document.querySelector("#paging a.now").classList.remove("now");
                page.classList.add("now");
                document.getElementById("movie-list").innerHTML = "";

                if( !document.querySelector(".cate a.now") ){
                    loadMovie(document.getElementById("search").value, isLang, isRegion, isCate, isPage);
                } else {
                    loadMovie(null, isLang, isRegion, document.querySelector(".cate a.now").getAttribute("href").replace("#", ""), isPage);
                }
            }
        });
    });

    document.querySelector("a.next").addEventListener("click", () => {
        let nextPage = document.querySelector("#paging a.now").parentElement.nextElementSibling;

        if (!!nextPage && nextPage.style.display === "block") {
            nextPage.firstElementChild.click();
        }
    });

    document.querySelector("a.first").addEventListener("click", () => {
        document.querySelector("#paging ol").firstElementChild.firstElementChild.click();
    });

    document.querySelector("a.prev").addEventListener("click", () => {
        let prevPage = document.querySelector("#paging a.now").parentElement.previousElementSibling;

        if (!!prevPage && prevPage.style.display === "block") {
            prevPage.firstElementChild.click();
        }
    });
    document.querySelector("a.last").addEventListener("click", () => {
        document.querySelectorAll("#paging ol li").forEach((i) => {
            if (!i.nextElementSibling || i.nextElementSibling.style.display === "none") {
                if (i.style.display === "block") {
                    i.firstElementChild.click();
                }
            }
        });
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

    /* 상단 fixed 공백 채우기 */
    document.querySelector(".header-blank").style.height = document.querySelector("#header").clientHeight + "px";
    window.addEventListener("resize", () => {
        document.querySelector(".header-blank").style.height = document.querySelector("#header").clientHeight + "px";

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

function setCookie(cookie_name, cookie_value, expire_date) {
    var today = new Date();
    var expire = new Date();
    expire.setTime(today.getTime() + 3600000 * 24 * expire_date);
    cookies = cookie_name + "=" + cookie_value + "; path=/;";
    if (expire_date != 0) cookies += "expires=" + expire.toGMTString();
    document.cookie = cookies;
}

function delCookie(cookie_name) {
    let today = new Date();
    let value = "";
    today.setDate(today.getDate() - 1);
    document.cookie = cookie_name + "=" + value + "; path=/;" + "; expires=" + today.toGMTString();
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
