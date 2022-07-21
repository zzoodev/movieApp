import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import InfoBox from "../components/InfoBox";
import { makeImgPath } from "../util/makeImgPath";

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  color: #f9f9f9;
  em {
    margin-right: 10px;
    font-weight: bold;
    font-size: 30px;
  }
  span {
    font-size: 22px;
    margin-top: 2px;
  }
`;
const Tabs = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
`;
const Tab = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 40px;
  margin: 0 5px;
  border-radius: 5px;
  background-color: ${(props) => (props.tabMatch ? "#ff3d3d" : "#d9d9d9")};
  color: ${(props) => (props.tabMatch ? "#111" : "#333")};
  border: none;
  font-size: 18px;
  font-weight: ${(props) => (props.tabMatch ? "bold" : "500")};
  cursor: pointer;
  :hover {
    filter: brightness(0.9);
  }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-template-rows: auto;
  gap: 20px;
  width: 100%;
  margin: 5px auto;
  height: max-content;
  padding: 15px;
`;
const Contents = styled.div`
  position: relative;
`;
const NotFound = styled.div`
  position: absolute;
  left: 50%;
  top: 50px;
  display: flex;
  align-items: center;
  transform: translateX(-50%);
  color: #f9f9f9;
  svg {
    width: 25px;
    height: 25px;
    margin-right: 10px;
  }
  span {
    font-size: 22px;
  }
`;

export default function GenreInfo() {
  const location = useLocation();
  let keyword = new URLSearchParams(location.search).get("id");

  const [allData, setAllData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [tvs, setTvs] = useState([]);
  const [movies, setMovies] = useState([]);
  const [tab, setTab] = useState("movie");

  useEffect(() => {
    const data = [];
    const fetchData = async () => {
      for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
        await fetch(
          `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.REACT_APP_API_KEY}&language=ko&page=${i}`
        )
          .then((res) => res.json())
          .then((json) => data.push(...json.results));
      }
      setAllData(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setMovies([]);
    setTvs([]);
    const set = async () => {
      await setFiltered([
        ...new Set(
          allData?.filter((content) => content?.genre_ids?.includes(+keyword))
        ),
      ]);
    };
    set();
  }, [keyword]);

  useEffect(() => {
    setTvs(filtered.filter((content) => content.media_type === "tv"));
    setMovies(filtered.filter((content) => content.media_type === "movie"));
  }, [filtered]);

  return (
    <>
      <Tabs>
        <Tab
          onClick={() => setTab("movie")}
          tabMatch={tab === "movie" ? true : false}
        >
          Movie
        </Tab>
        <Tab
          onClick={() => setTab("tv")}
          tabMatch={tab === "tv" ? true : false}
        >
          TV
        </Tab>
      </Tabs>
      <Contents>
        {tab === "movie" ? (
          <Grid>
            {movies.length > 0 ? (
              <>
                {movies?.map((movie, index) => (
                  <Link key={index} to={`/movies/${movie.id}`}>
                    <InfoBox
                      bgUrl={
                        movie.backdrop_path
                          ? makeImgPath(movie.backdrop_path, "w500")
                          : null
                      }
                      name={movie.title}
                      voteAverage={movie.vote_average}
                      firstDate={movie.release_date}
                    ></InfoBox>
                  </Link>
                ))}
              </>
            ) : (
              <NotFound>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    fill="#f9f9f9"
                    d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 400c-18 0-32-14-32-32s13.1-32 32-32c17.1 0 32 14 32 32S273.1 400 256 400zM325.1 258L280 286V288c0 13-11 24-24 24S232 301 232 288V272c0-8 4-16 12-21l57-34C308 213 312 206 312 198C312 186 301.1 176 289.1 176h-51.1C225.1 176 216 186 216 198c0 13-11 24-24 24s-24-11-24-24C168 159 199 128 237.1 128h51.1C329 128 360 159 360 198C360 222 347 245 325.1 258z"
                  />
                </svg>
                <span>검색결과가 없습니다.</span>
              </NotFound>
            )}
          </Grid>
        ) : (
          <Grid>
            {tvs.length > 0 ? (
              <>
                {" "}
                {tvs?.map((tv, index) => (
                  <Link key={index} to={`/tv/${tv.id}`}>
                    <InfoBox
                      bgUrl={
                        tv.backdrop_path
                          ? makeImgPath(tv.backdrop_path, "w500")
                          : null
                      }
                      name={tv.name}
                      voteAverage={tv.vote_average}
                      firstDate={tv.first_air_date}
                    ></InfoBox>
                  </Link>
                ))}
              </>
            ) : (
              <NotFound>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path
                    fill="#f9f9f9"
                    d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 400c-18 0-32-14-32-32s13.1-32 32-32c17.1 0 32 14 32 32S273.1 400 256 400zM325.1 258L280 286V288c0 13-11 24-24 24S232 301 232 288V272c0-8 4-16 12-21l57-34C308 213 312 206 312 198C312 186 301.1 176 289.1 176h-51.1C225.1 176 216 186 216 198c0 13-11 24-24 24s-24-11-24-24C168 159 199 128 237.1 128h51.1C329 128 360 159 360 198C360 222 347 245 325.1 258z"
                  />
                </svg>
                <span>검색결과가 없습니다.</span>
              </NotFound>
            )}
          </Grid>
        )}
      </Contents>
    </>
  );
}